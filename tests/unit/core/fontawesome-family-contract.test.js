import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import FontName from 'fontname'

const repo = path.resolve('.')
const builder = pathToFileURL(path.join(repo, 'src/dev/builders/fontawesome-builder.js')).href
const icons = pathToFileURL(path.join(repo, 'src/cli/commands/icon-library.js')).href
const source = path.join(repo, 'assets/fonts')
const expected = FontName.parse(fs.readFileSync(path.join(source, 'FontAwesome7Free-Solid.ttf')))[0].postScriptName
for (const variant of ['pro', 'beta', 'alternate', 'classic', 'optional', 'invalid']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-fa-family-'))
  try {
    const classic = variant === 'classic'
    const base = variant === 'beta' || classic ? 'purgetss/fontawesome-beta' : variant === 'alternate' ? 'app/lib/node_modules/@fortawesome/fontawesome-pro' : 'node_modules/@fortawesome/fontawesome-pro'
    fs.mkdirSync(path.join(root, base, 'css'), { recursive: true })
    fs.mkdirSync(path.join(root, base, 'webfonts'))
    fs.mkdirSync(path.join(root, classic ? 'Resources' : 'app/views'), { recursive: true })
    fs.mkdirSync(path.join(root, 'purgetss/styles'), { recursive: true })
    if (!classic) fs.mkdirSync(path.join(root, 'app/assets'), {recursive:true})
    fs.writeFileSync(path.join(root, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.fonts</id></ti:app>')
    fs.writeFileSync(path.join(root, base, 'css/all.css'), '.fa-test::before { --fa: "\\\\f123"; }')
    // Real OpenType name tables with names intentionally unlike the old Pro/Beta guesses.
    for (const [file, asset] of Object.entries({'fa-thin-100.ttf':'FontAwesome7Free-Regular.ttf','fa-light-300.ttf':'FontAwesome7Free-Regular.ttf','fa-solid-900.ttf':'FontAwesome7Free-Solid.ttf','fa-regular-400.ttf':'FontAwesome7Free-Regular.ttf','fa-brands-400.ttf':'FontAwesome7Brands-Regular.ttf'})) {
      if (variant === 'optional' && /thin|light/.test(file)) continue
      fs.copyFileSync(path.join(source, asset), path.join(root, base, 'webfonts', file))
    }
    if (variant === 'invalid') fs.writeFileSync(path.join(root, base, 'webfonts/fa-solid-900.ttf'), Buffer.alloc(12))
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import assert from 'node:assert/strict'
      import fs from 'node:fs'
      import vm from 'node:vm'
      if(${classic}){
        const {copyFonts}=await import(${JSON.stringify(icons)})
        assert.equal(await copyFonts({vendor:'fa',module:true}),true)
      }else{
        const {buildFontAwesome,buildFontAwesomeJS}=await import(${JSON.stringify(builder)})
        if (${variant === 'invalid'}) {
          assert.throws(()=>buildFontAwesome(),/Failed to parse file/)
          assert.ok(!fs.existsSync('purgetss/styles/fontawesome.tss'))
          assert.ok(!fs.existsSync('app/lib/fontawesome.js'))
          process.exit(0)
        }
        buildFontAwesome()
        buildFontAwesomeJS()
        const tss=fs.readFileSync('purgetss/styles/fontawesome.tss','utf8')
        assert.ok(tss.includes("fontFamily: '${expected}'"),'TSS must use the installed PostScript name')
        assert.ok(!tss.includes('FontAwesome6Pro-'))
      }
      const folder=${classic}?'Resources':'app'
      const fonts=folder+(${classic}?'/fonts':'/assets/fonts')
      assert.ok(fs.existsSync(fonts+'/${expected}.ttf'),'copied font and TSS must agree')
      const module={exports:{}}
      vm.runInNewContext(fs.readFileSync(folder+'/lib/fontawesome.js','utf8'),{module,exports:module.exports})
      assert.equal(module.exports.families.default,${JSON.stringify(expected)})
      assert.equal(module.exports.icons.test, '\\uf123')
      assert.equal(module.exports.solid,${JSON.stringify(expected)})
      assert.ok(module.exports.families.regular)
      assert.ok(module.exports.families.brands)
      assert.equal(Boolean(module.exports.families.thin), ${variant !== 'optional'})
      assert.ok(!fs.readFileSync(folder+'/lib/fontawesome.js','utf8').includes('__FA_'))
      if(!${classic})assert.ok(!fs.readFileSync('purgetss/styles/fontawesome.tss','utf8').includes('__FA_'))
    `], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, variant + ': ' + result.stdout + result.stderr)
  } finally { fs.rmSync(root, { recursive: true, force: true }) }
}
console.log('Pro/Beta font metadata, TSS/module and Alloy/Classic copy contracts passed')
