import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import FontName from 'fontname'

const repo = process.cwd()
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-icon-headers-'))
try {
  for (const folder of ['src', 'lib/templates', 'assets/fonts']) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins -- Available on every supported Node version.
    fs.cpSync(path.join(repo, folder), path.join(root, folder), { recursive: true })
  }
  fs.writeFileSync(path.join(root, 'package.json'), '{"type":"module"}')
  fs.mkdirSync(path.join(root, 'dist'))
  fs.mkdirSync(path.join(root, 'node_modules'))
  for (const entry of fs.readdirSync('node_modules').filter(entry => entry !== 'framework7-icons')) {
    fs.symlinkSync(path.join(repo, 'node_modules', entry), path.join(root, 'node_modules', entry))
  }
  const framework = path.join(root, 'node_modules/framework7-icons')
  fs.mkdirSync(framework)
  fs.symlinkSync(path.join(repo, 'node_modules/framework7-icons/svg'), path.join(framework, 'svg'))
  fs.writeFileSync(path.join(framework, 'package.json'), '{"version":"98.76.54"}')
  const versions = { materialicons: [], materialsymbols: [] }
  for (const file of fs.readdirSync(path.join(root, 'assets/fonts')).filter(file => file.startsWith('Material'))) {
    const destination = path.join(root, 'assets/fonts', file)
    const bytes = fs.readFileSync(destination)
    const original = FontName.parse(bytes)[0].version
    const changed = original.replace(/\d(?=\D*$)/, digit => String((Number(digit) + 1) % 10))
    assert.notEqual(changed, original)
    for (const encoding of ['utf8', 'utf16le']) {
      let from = Buffer.from(original, encoding)
      let to = Buffer.from(changed, encoding)
      if (encoding === 'utf16le') { from = from.swap16(); to = to.swap16() }
      for (let at = bytes.indexOf(from); at !== -1; at = bytes.indexOf(from, at + to.length)) to.copy(bytes, at)
    }
    fs.writeFileSync(destination, bytes)
    assert.equal(FontName.parse(bytes)[0].version, changed)
    versions[file.startsWith('MaterialSymbols') ? 'materialsymbols' : 'materialicons'].push(changed.trim())
  }
  const code = `
    import fs from 'node:fs'
    import vm from 'node:vm'
    import assert from 'node:assert/strict'
    const versions=${JSON.stringify(versions)}
    const exportsOf=code=>{const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports});return JSON.parse(JSON.stringify(module.exports))}
    for(const [family,base,method] of [
      ['framework7icons','framework7','buildFramework7Icons'],
      ['materialicons','material-icons','buildMaterialIcons'],
      ['materialsymbols','material-symbols','buildMaterialSymbols']
    ]) {
      const tssBuilder=await import('./src/dev/builders/icon-builders/'+base+'-builder.js')
      const jsBuilder=await import('./src/dev/builders/icon-builders/'+base+'-js-builder.js')
      tssBuilder[method]()
      jsBuilder[method+'JS']()
      const tss=fs.readFileSync('dist/'+family+'.tss','utf8')
      const js=fs.readFileSync('dist/'+family+'.js','utf8')
      for(const version of family==='framework7icons'?['98.76.54']:versions[family]) {
        assert.ok(tss.includes(version),family+' TSS header misses '+version)
        assert.ok(js.includes(version),family+' JS header misses '+version)
      }
      assert.ok(!tss.includes('__ICON_')&&!js.includes('__ICON_'))
      assert.ok(!tss.includes('03/22/23')&&!js.includes('03/22/23'))
      const original=fs.readFileSync(${JSON.stringify(repo)}+'/dist/'+family+'.tss','utf8')
      const classes=text=>text.split('\\n').filter(line=>line.startsWith("'.")).join('\\n')
      assert.equal(classes(tss),classes(original),'class output must remain unchanged')
      assert.deepEqual(exportsOf(js),exportsOf(fs.readFileSync(${JSON.stringify(repo)}+'/dist/'+family+'.js','utf8')))
    }
    // A missing npm version must not replace previously generated Framework7 files.
    fs.writeFileSync('node_modules/framework7-icons/package.json','{}')
    for(const suffix of ['','-js']) {
      const builder=await import('./src/dev/builders/icon-builders/framework7'+suffix+'-builder.js')
      const method=suffix?'buildFramework7IconsJS':'buildFramework7Icons'
      const file='dist/framework7icons.'+(suffix?'js':'tss')
      const previous=fs.readFileSync(file,'utf8')
      assert.throws(()=>builder[method](),/Missing framework7-icons package version/)
      assert.equal(fs.readFileSync(file,'utf8'),previous)
    }
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Framework7/Material dynamic headers preserve glyphs, classes, families and aliases')
