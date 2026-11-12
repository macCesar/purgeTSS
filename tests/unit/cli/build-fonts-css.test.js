import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-font-css-'))
const repo = process.cwd()
try {
  fs.mkdirSync(path.join(root, 'app/views'), { recursive: true })
  fs.mkdirSync(path.join(root, 'purgetss/fonts/icons'), { recursive: true })
  fs.writeFileSync(path.join(root, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.fontcss</id></ti:app>')
  fs.copyFileSync('assets/fonts/FontAwesome7Free-Solid.ttf', path.join(root, 'purgetss/fonts/icons/solid.ttf'))
  const css = '@font-face { font-family: "MyIcons"; src: url(solid.ttf); }\n' +
    '.fa-new, .fa-alias { display: inline; --fa: "\\f123"; }\n' +
    '.fa-old:before, .fa-legacy::before { color: red; content: "\\f124"; }\n' +
    '.fa-single::before { content: \'\\f125\'; }\n' +
    '.fa-emoji { --fa: "\\1f600"; }\n' +
    '.fa::before { content: var(--fa); }\n'
  fs.writeFileSync(path.join(root, 'purgetss/fonts/icons/icons.css'), css)
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict'
    import fs from 'node:fs'
    import vm from 'node:vm'
    const {buildFonts}=await import(${JSON.stringify(pathToFileURL(repo + '/src/cli/commands/fonts.js').href)})
    for(const rename of [false,true]) {
      assert.equal(buildFonts({module:true,fontClassFromFilename:rename}),true)
      const tss=fs.readFileSync('purgetss/styles/fonts.tss','utf8')
      const module={exports:{}}
      vm.runInNewContext(fs.readFileSync('app/lib/purgetss.fonts.js','utf8'),{module,exports:module.exports})
      const prefix=rename?'icons':'fa'
      for(const [name,glyph] of Object.entries({new:'\\uf123',alias:'\\uf123',old:'\\uf124',legacy:'\\uf124',single:'\\uf125',emoji:'😀'})) {
        assert.ok(tss.includes("'."+prefix+'-'+name+"':"),'missing class '+name)
        assert.equal(module.exports.icons[prefix][name],glyph,'module glyph '+name)
      }
      assert.ok(!tss.includes("'.fa': { text:"),'var(--fa) is not a glyph')
    }
    fs.copyFileSync(${JSON.stringify(repo + '/node_modules/@fortawesome/fontawesome-free/css/all.css')},'purgetss/fonts/icons/icons.css')
    assert.equal(buildFonts({module:true}),true)
    const realTSS=fs.readFileSync('purgetss/styles/fonts.tss','utf8')
    assert.ok(realTSS.includes("'.fa-user': { text: '\\\\uf007'"),'real FA7 CSS must produce fa-user')
    const realModule={exports:{}}
    vm.runInNewContext(fs.readFileSync('app/lib/purgetss.fonts.js','utf8'),{module:realModule,exports:realModule.exports})
    assert.equal(realModule.exports.icons.fa.user,'\\uf007')
    assert.ok(Object.keys(realModule.exports.icons.fa).length>1000)
  `], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  fs.rmSync(path.join(root, 'app'), { recursive: true })
  fs.mkdirSync(path.join(root, 'Resources'))
  const classic = spawnSync(process.execPath, [path.join(repo, 'bin/purgetss'), 'build-fonts', '--module'], { cwd: root, encoding: 'utf8' })
  assert.equal(classic.status, 0, classic.stdout + classic.stderr)
  const verify = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import fs from 'node:fs'
    import vm from 'node:vm'
    import assert from 'node:assert/strict'
    const module={exports:{}}
    vm.runInNewContext(fs.readFileSync('Resources/lib/purgetss.fonts.js','utf8'),{module,exports:module.exports})
    assert.equal(module.exports.icons.fa.user,'\\uf007')
    assert.ok(Object.keys(module.exports.icons.fa).length>1000)
    assert.ok(!fs.existsSync('app'))
  `], { cwd: root, encoding: 'utf8' })
  assert.equal(verify.status, 0, verify.stdout + verify.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('build-fonts reads modern/legacy CSS, aliases and Unicode while preserving filename prefixes')
