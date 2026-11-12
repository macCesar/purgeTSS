import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-font-priority-'))
const repo = process.cwd()
try {
  fs.mkdirSync(path.join(root, 'purgetss/styles'), { recursive: true })
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict'
    import fs from 'node:fs'
    const p=await import(${JSON.stringify(pathToFileURL(repo + '/src/core/purger/icon-purger.js').href)})
    const {purgeFonts}=await import(${JSON.stringify(pathToFileURL(repo + '/src/core/purger/fonts-purger.js').href)})
    const {_applyClasses,compileApplyDirectives}=await import(${JSON.stringify(pathToFileURL(repo + '/src/shared/helpers/utils.js').href)})
    const sources=[p.purgeFontAwesome,p.purgeMaterialIcons,p.purgeMaterialSymbols,p.purgeFramework7,purgeFonts]
    const selectors=['fa-user','fas','mi-home','mi','ms-home','ms','f7-house','f7']
    const local=selectors.map(name=>"'."+name+"': { text: 'LOCAL', font: { fontFamily: 'MyFont' } }").join('\\n')
    for(const comment of ['', '// Font Awesome is merely a comment\\n']) {
      fs.writeFileSync('purgetss/styles/fonts.tss',comment+local)
      fs.writeFileSync('purgetss/styles/fontawesome.tss',"'.fa-user': { text: 'PROJECT' }\\n'.fa-project-only': { text: 'PROJECT' }\\n")
      for(const extra of [0,40]) {
        const names=[...selectors,'fa-project-only','fa-house','android:ms-home','ios:tablet:fa-user',...Array.from({length:extra},(_,i)=>'unknown-'+i)]
        const output=sources.map(fn=>fn(names,names)).join('')
        for(const name of selectors) {
          const lines=output.split('\\n').filter(line=>line.startsWith("'."+name+"':"))
          assert.equal(lines.length,1,'one definition for '+name)
          assert.ok(lines[0].includes('LOCAL'),name+' must come from fonts.tss')
        }
        assert.ok(output.includes("'.fa-project-only': { text: 'PROJECT' }"),'project-only class must survive')
        assert.ok(output.includes("'.fa-house':"),'missing project class must fall back to Free')
        assert.ok(output.includes("'.android:ms-home[platform=android]': { text: 'LOCAL'"))
        assert.ok(output.includes("'.ios:tablet:fa-user[platform=ios formFactor=tablet]': { text: 'LOCAL'"))
        for(const name of [...selectors,'fa-project-only','fa-house']) {
          _applyClasses['.badge']=new Set([name])
          const applied=compileApplyDirectives("'.badge': { {_applyProperties_} }")
          assert.ok(!applied.includes('{_applyProperties_}'))
          assert.ok(applied.includes(selectors.includes(name)?'LOCAL':name==='fa-project-only'?'PROJECT':'text:'),'apply fallback for '+name)
          delete _applyClasses['.badge']
        }
        _applyClasses['.iosBadge[platform=ios]']=new Set(['fa-user'])
        assert.ok(compileApplyDirectives("'.iosBadge[platform=ios]': { {_applyProperties_} }").includes('LOCAL'))
        delete _applyClasses['.iosBadge[platform=ios]']
      }
    }
    fs.writeFileSync('purgetss/styles/fonts.tss','// Font Awesome mentioned without any definitions\\n')
    assert.ok(p.purgeFontAwesome(['fas','fa-user'],['fas','fa-user']).includes("'.fas':"))
  `], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  // Exercise the production CLI assembly as well as individual purgers.
  for (const folder of ['app/views', 'app/controllers', 'app/styles', 'app/assets']) fs.mkdirSync(path.join(root, folder), { recursive: true })
  fs.writeFileSync(path.join(root, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.priority</id></ti:app>')
  fs.writeFileSync(path.join(root, 'app/views/index.xml'), '<Alloy><Window><Label class="fas fa-user fa-project-only fa-house mi-home ms-home f7-house" /></Window></Alloy>')
  fs.writeFileSync(path.join(root, 'purgetss/styles/fonts.tss'), '// Font Awesome custom subset\n\'.fa-user\': { text: \'LOCAL\' }\n')
  const cli = spawnSync(process.execPath, [path.join(repo, 'bin/purgetss')], { cwd: root, encoding: 'utf8' })
  assert.equal(cli.status, 0, cli.stdout + cli.stderr)
  const app = fs.readFileSync(path.join(root, 'app/styles/app.tss'), 'utf8')
  const matches = app.split('\n').filter(line => line.startsWith('\'.fa-user\':'))
  assert.equal(matches.length, 1)
  assert.ok(matches[0].includes('LOCAL'))
  for (const name of ['fas', 'fa-house', 'fa-project-only', 'mi-home', 'ms-home', 'f7-house']) {
    assert.ok(app.includes(`'.${name}':`), 'CLI must retain ' + name)
  }
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Font sources resolve per class with identical direct/apply priority and modifier behavior')
