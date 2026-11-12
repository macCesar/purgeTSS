import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const cli = fileURLToPath(new URL('../../bin/purgetss', import.meta.url))

test('CLI emits arbitrary RGB/RGBA colors from XML, controllers and apply directives', () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-arbitrary-colors-'))
  try {
    for (const folder of ['app/views', 'app/controllers', 'app/styles', 'app/assets', 'purgetss']) {
      fs.mkdirSync(path.join(project, folder), { recursive: true })
    }
    fs.writeFileSync(path.join(project, 'app/views/index.xml'), `<Alloy>
  <Window class="bg-(rgb(100,200,50))">
    <View>
      <Label class="text-(rgba(10,20,30,0.5)) ios:border-(rgb(1,2,3))">Colors</Label>
    </View>
  </Window>
</Alloy>`)
    fs.writeFileSync(path.join(project, 'app/controllers/index.js'), '$.UI.create(\'View\', { classes: [\'bg-focused-(rgba(70,80,90,0.75))\'] })')
    fs.writeFileSync(path.join(project, 'purgetss/config.cjs'), `module.exports = {
  purge: { mode: 'all', method: 'sync', options: { missing: true, widgets: false, safelist: [], plugins: [] } },
  theme: { extend: { View: { apply: 'bg-(rgba(40,50,60,0.25)) border-(rgb(4,5,6))' } } }
}`)

    const result = spawnSync(process.execPath, [cli], { cwd: project, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stdout + result.stderr)
    const output = fs.readFileSync(path.join(project, 'app/styles/app.tss'), 'utf8')
    assert.ok(output.includes('\'.bg-(rgb(100,200,50))\': { backgroundColor: \'rgb(100,200,50)\' }'), output)
    assert.ok(output.includes('\'.text-(rgba(10,20,30,0.5))\': { color: \'rgba(10,20,30,0.5)\', textColor: \'rgba(10,20,30,0.5)\' }'), output)
    assert.ok(output.includes('\'.ios:border-(rgb(1,2,3))[platform=ios]\': { borderColor: \'rgb(1,2,3)\' }'), output)
    assert.ok(output.includes('\'.bg-focused-(rgba(70,80,90,0.75))\': { backgroundFocusedColor: \'rgba(70,80,90,0.75)\' }'), output)
    assert.match(output, /'View': \{[^\n]*backgroundColor: 'rgba\(40,50,60,0\.25\)'[^\n]*borderColor: 'rgb\(4,5,6\)'/)
    assert.ok(!output.includes('Property not yet supported'), output)
  } finally {
    fs.rmSync(project, { recursive: true, force: true })
  }
})
