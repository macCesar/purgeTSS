import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import FontName from 'fontname'

const repo = process.cwd()
const version = JSON.parse(fs.readFileSync('node_modules/@fortawesome/fontawesome-free/package.json', 'utf8')).version
const advanceDigit = (value, step) => value.replace(/\d$/, digit => String((Number(digit) + step) % 10))
const nextVersion = advanceDigit(version, 1)
const wrongVersion = advanceDigit(version, 2)
const solidFile = fs.readdirSync('src/fonts').find(file => file.includes('Solid'))
const prefix = /^FontAwesome\d+/.exec(FontName.parse(fs.readFileSync('src/fonts/' + solidFile))[0].postScriptName)[0]
const nextPrefix = advanceDigit(prefix, 1)
for (const scenario of ['metadata', 'metadata-alloy', 'mismatch', 'missing', 'duplicate']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-free-'))
  try {
    for (const folder of ['src', 'lib/templates', 'assets/fonts']) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins -- cpSync exists on every supported Node version.
      fs.cpSync(path.join(repo, folder), path.join(root, folder), { recursive: true })
    }
    fs.writeFileSync(path.join(root, 'package.json'), '{"type":"module"}')
    fs.mkdirSync(path.join(root, 'node_modules'))
    for (const entry of fs.readdirSync(path.join(repo, 'node_modules')).filter(entry => entry !== '@fortawesome')) {
      fs.symlinkSync(path.join(repo, 'node_modules', entry), path.join(root, 'node_modules', entry))
    }
    const freePackage = path.join(root, 'node_modules/@fortawesome/fontawesome-free')
    fs.mkdirSync(path.join(freePackage, 'css'), { recursive: true })
    fs.copyFileSync(path.join(repo, 'node_modules/@fortawesome/fontawesome-free/css/all.css'), path.join(freePackage, 'css/all.css'))
    fs.writeFileSync(path.join(freePackage, 'package.json'), JSON.stringify({ version: nextVersion }))
    fs.mkdirSync(path.join(root, 'dist'))
    const fonts = path.join(root, 'src/fonts')
    for (const file of fs.readdirSync(fonts)) {
      let bytes = fs.readFileSync(path.join(fonts, file))
      // Change real name-table data, keeping lengths/offsets intact.
      const replacements = [[prefix, nextPrefix], [version, scenario === 'mismatch' ? wrongVersion : nextVersion]]
      for (const [before, after] of replacements) {
        for (const encoding of ['utf8', 'utf16le']) {
          let from = Buffer.from(before, encoding)
          let to = Buffer.from(after, encoding)
          if (encoding === 'utf16le') { from = from.swap16(); to = to.swap16() }
          for (let at = bytes.indexOf(from); at !== -1; at = bytes.indexOf(from, at + to.length)) to.copy(bytes, at)
        }
      }
      fs.writeFileSync(path.join(fonts, file), bytes)
    }
    const solid = fs.readdirSync(fonts).find(file => file.includes('Solid'))
    if (scenario === 'missing') fs.unlinkSync(path.join(fonts, solid))
    if (scenario === 'duplicate') fs.copyFileSync(path.join(fonts, solid), path.join(fonts, 'duplicate.otf'))
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import assert from 'node:assert/strict'
      import fs from 'node:fs'
      import vm from 'node:vm'
      const {buildFontAwesome}=await import('./src/dev/builders/icon-builders/fontawesome-builder.js')
      const {buildFontAwesomeJS}=await import('./src/dev/builders/icon-builders/fontawesome-js-builder.js')
      const {buildFontsFolder}=await import('./src/dev/builders/fonts-folder-builder.js')
      const scenario=${JSON.stringify(scenario)}
      if(!scenario.startsWith('metadata')) {
        const error=scenario==='mismatch'?/font version.*does not match npm version/i:scenario==='missing'?/missing.*solid/i:/duplicate.*solid/i
        assert.throws(()=>buildFontAwesome(),error)
        assert.throws(()=>buildFontAwesomeJS(),error)
        await assert.rejects(buildFontsFolder(),error)
        assert.deepEqual(fs.readdirSync('dist'),[])
      } else {
        buildFontAwesome()
        buildFontAwesomeJS()
        await buildFontsFolder()
        const tss=fs.readFileSync('dist/fontawesome.tss','utf8')
        const js=fs.readFileSync('dist/fontawesome.js','utf8')
        assert.ok(tss.includes("fontFamily: '${nextPrefix}Free-Solid'"))
        assert.ok(tss.includes('Font Awesome Free ${nextVersion}'))
        assert.ok(js.includes('Font Awesome Free ${nextVersion}'))
        assert.ok(!tss.includes('__FA_')&&!js.includes('__FA_'))
        const module={exports:{}}
        vm.runInNewContext(js,{module,exports:module.exports})
        assert.equal(module.exports.families.solid,'${nextPrefix}Free-Solid')
        assert.ok(Object.keys(module.exports.icons).length>1000)
        assert.ok(fs.existsSync('assets/fonts/${nextPrefix}Free-Solid.ttf'))
        assert.ok(!fs.readdirSync('assets/fonts').some(file=>file.startsWith('${prefix}')))
        const alloy=scenario==='metadata-alloy'
        fs.mkdirSync(alloy?'app/views':'Resources',{recursive:true})
        fs.writeFileSync('tiapp.xml','<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.free</id></ti:app>')
        const {copyFonts}=await import('./src/cli/commands/icon-library.js')
        assert.equal(await copyFonts({vendor:'fa',module:true}),true)
        await new Promise(resolve=>setImmediate(resolve))
        for(const family of Object.values(module.exports.families))assert.ok(fs.existsSync((alloy?'app/assets/fonts/':'Resources/fonts/')+family+'.ttf'))
      }
    `], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, scenario + ': ' + result.stdout + result.stderr)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
}
console.log('Free font metadata, version validation, generation and Alloy/Classic copy contracts passed')
