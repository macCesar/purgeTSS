import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const builder = pathToFileURL(path.resolve('src/core/builders/auto-utilities-builder.js')).href
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-sdk14-'))
try {
  fs.mkdirSync(path.join(root, 'purgetss'))
  fs.writeFileSync(path.join(root, 'purgetss/config.cjs'), 'module.exports={theme:{extend:{}}}')
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict'
    import fs from 'node:fs'
    const { createRequire } = await import('node:module')
    const require = createRequire(${JSON.stringify(builder)})
    const input = require('../../../lib/completions/titanium/completions-v3.json')
    input.properties.readonlyProbe = {type:'Boolean',description:'Read-only probe',readOnly:true,values:['true','false']}
    input.properties.writableProbe = {type:'Boolean',description:'Writable probe',readOnly:false,values:['true','false']}
    input.properties.mixedProbe = {type:'Boolean',description:'Shared writable probe',readOnly:false,values:['true','false']}
    input.types['Ti.UI.PermissionProbe'] = {description:'',properties:['readonlyProbe','writableProbe','mixedProbe'],functions:[],events:[]}
    const { autoBuildUtilitiesTSS } = await import(${JSON.stringify(builder)})
    autoBuildUtilitiesTSS({glossary:true})
    const output=fs.readFileSync('purgetss/styles/utilities.tss','utf8')
    assert.ok(!output.includes("'.readonly-probe'"), 'readOnly:true must exclude an arbitrary property, not only known names')
    assert.ok(output.includes("'.writable-probe': { writableProbe: true }"))
    assert.ok(output.includes("'.mixed-probe': { mixedProbe: true }"),'an aggregate writable property must not be excluded')
    for(const state of ['is-active','is-foreground','is-primary','is-key']) {
      assert.ok(!output.includes("'."+state+"'"), 'read-only scene state must not generate '+state)
      assert.ok(!output.includes("'."+state+"-false'"))
    }
    assert.ok(output.includes("'.primary-col-w-fraction-1/2[platform=ios]': { primaryColumnWidthFraction: 0.5 }"), 'ratio must be numeric and iOS-scoped')
    assert.ok(output.includes("'.primary-col-w-fraction-1[platform=ios]': { primaryColumnWidthFraction: 1 }"))
    assert.ok(output.includes("'.primary-col-w-fraction-1/5[platform=ios]': { primaryColumnWidthFraction: 0.2 }"))
    assert.ok(output.includes("'.primary-col-w-fraction-full[platform=ios]': { primaryColumnWidthFraction: 1 }"))
    assert.ok(output.includes("'.minimum-primary-col-w-16[platform=ios]': { minimumPrimaryColumnWidth: 64 }"))
    for(const line of output.split('\\n').filter(line=>/primaryColumnWidthFraction:|minimumPrimaryColumnWidth:|maximumPrimaryColumnWidth:/.test(line))) {
      assert.ok(!/Ti.UI.|'\\d|%/.test(line.slice(line.indexOf(': {'))),line)
    }
    for(const state of ['isActive','isForeground','isPrimary','isKey'])assert.ok(!fs.existsSync('purgetss/glossary/booleanProperties/'+state+'.md'))
    fs.writeFileSync('purgetss/config.cjs','module.exports={theme:{extend:{primaryColumnWidthFraction:{custom:0.35},minimumPrimaryColumnWidth:{custom:280}}}}')
    autoBuildUtilitiesTSS()
    const custom=fs.readFileSync('purgetss/styles/utilities.tss','utf8')
    assert.ok(custom.includes("'.primary-col-w-fraction-custom[platform=ios]': { primaryColumnWidthFraction: 0.35 }"))
    assert.ok(custom.includes('minimumPrimaryColumnWidth: 280'))
    fs.writeFileSync('purgetss/config.cjs',"module.exports={theme:{primaryColumnWidthFraction:{bad:'50%'}}}")
    assert.throws(()=>autoBuildUtilitiesTSS(),/primaryColumnWidthFraction/)
    assert.equal(fs.readFileSync('purgetss/styles/utilities.tss','utf8'),custom,'invalid numeric config must not replace utilities')
    fs.writeFileSync('purgetss/config.cjs',"module.exports={theme:{minimumPrimaryColumnWidth:{bad:'auto'}}}")
    assert.throws(()=>autoBuildUtilitiesTSS(),/minimumPrimaryColumnWidth/)
    assert.equal(fs.readFileSync('purgetss/styles/utilities.tss','utf8'),custom)
  `], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('SDK14 scene and SplitWindow generation contracts passed')
