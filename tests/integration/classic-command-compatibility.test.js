/**
 * Integration contract for commands that can run in Titanium Classic apps.
 *
 * Every scenario starts from a pristine Classic project so one command cannot
 * hide another command's Alloy-only side effects.
 */

import assert from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(import.meta.url)
const purgetssBin = path.join(repoRoot, 'bin', 'purgetss')
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-classic-'))

function createClassicProject(name, targets = { android: true, ios: true }) {
  const projectPath = path.join(tempRoot, name)
  fs.mkdirSync(path.join(projectPath, 'Resources'), { recursive: true })
  fs.writeFileSync(path.join(projectPath, 'Resources', 'app.js'), 'Ti.UI.createWindow({ backgroundColor: \'#fff\' }).open()\n')
  fs.writeFileSync(path.join(projectPath, 'tiapp.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<ti:app xmlns:ti="http://ti.appcelerator.org">',
    `  <id>com.purgetss.${name}</id>`,
    `  <name>${name}</name>`,
    '  <deployment-targets>',
    `    <target device="android">${targets.android}</target>`,
    `    <target device="iphone">${targets.ios}</target>`,
    '  </deployment-targets>',
    '</ti:app>',
    ''
  ].join('\n'))
  return projectPath
}

function run(projectPath, ...args) {
  return execFileSync(process.execPath, [purgetssBin, ...args], {
    cwd: projectPath,
    encoding: 'utf8',
    env: {
      ...process.env,
      NO_COLOR: '1',
      PURGETSS_YES: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  })
}

function listFiles(root) {
  const files = []
  const visit = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) visit(absolute)
      else files.push(path.relative(root, absolute))
    }
  }
  visit(root)
  return files
}

function assertNoAlloyArtifacts(projectPath) {
  const files = listFiles(projectPath)
  assert.ok(!fs.existsSync(path.join(projectPath, 'app')), 'Classic command created an app/ folder')
  assert.ok(!fs.existsSync(path.join(projectPath, 'app', 'alloy.jmk')), 'Classic command created app/alloy.jmk')
  assert.deepStrictEqual(files.filter(file => file.endsWith('.tss')), [], 'Classic command created TSS files')
}

function assertNoEmptyPurgeTSSAssetFolders(projectPath) {
  const purgeTSSPath = path.join(projectPath, 'purgetss')
  assert.ok(fs.existsSync(purgeTSSPath), 'expected purgetss/ for config.cjs')
  assert.deepStrictEqual(
    fs.readdirSync(purgeTSSPath).sort(),
    ['config.cjs'],
    'Classic color commands created unrelated empty PurgeTSS asset folders'
  )
}

function testSemanticWithoutPurgeTSS() {
  const projectPath = createClassicProject('semantic')

  run(projectPath, 'semantic', '--single', '#F9FAFB', 'surfaceColor', '--dark', '#0F172A')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'semantic.colors.json')))
  assert.ok(!fs.existsSync(path.join(projectPath, 'purgetss')), 'semantic created an unnecessary purgetss/ folder')
  assertNoAlloyArtifacts(projectPath)
}

function testExternalImageWithoutPurgeTSS() {
  const projectPath = createClassicProject('images')
  const source = path.join(projectPath, 'sample.svg')
  fs.writeFileSync(source, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2563eb"/></svg>')

  run(projectPath, 'images', source, '--android', '--width', '16', '--yes')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'android', 'images', 'res-mdpi', 'sample.png')))
  assert.ok(!fs.existsSync(path.join(projectPath, 'purgetss')), 'images created an unnecessary purgetss/ folder for an external source')
  assertNoAlloyArtifacts(projectPath)
}

function testImageDeploymentTargets() {
  const projectPath = createClassicProject('images-android-only', { android: true, ios: false })
  const source = path.join(projectPath, 'sample.svg')
  fs.writeFileSync(source, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2563eb"/></svg>')

  const output = run(projectPath, 'images', source, '--width', '16', '--yes')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'android', 'images', 'res-mdpi', 'sample.png')))
  assert.ok(!fs.existsSync(path.join(projectPath, 'Resources', 'iphone')), 'images ignored disabled iOS deployment target')
  assert.ok(!output.includes('iPhone:'), 'images reported an output path for disabled iOS')
  assertNoAlloyArtifacts(projectPath)
}

function testIconLibrary() {
  const projectPath = createClassicProject('icons')

  run(projectPath, 'icon-library', '--vendor=fa', '--module', '--styles')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'fonts', 'FontAwesome7Free-Solid.ttf')))
  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'lib', 'fontawesome.js')))
  assertNoAlloyArtifacts(projectPath)
}

function testModule() {
  const projectPath = createClassicProject('module')

  run(projectPath, 'module')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'lib', 'purgetss.ui.js')))
  assertNoAlloyArtifacts(projectPath)
}

function testShadesAndColorModule() {
  const projectPath = createClassicProject('colors')

  run(projectPath, 'shades', '#2563EB', 'brand')
  assert.ok(fs.existsSync(path.join(projectPath, 'purgetss', 'config.cjs')))
  assertNoEmptyPurgeTSSAssetFolders(projectPath)

  run(projectPath, 'color-module')
  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'lib', 'purgetss.colors.js')))
  assertNoEmptyPurgeTSSAssetFolders(projectPath)
  assertNoAlloyArtifacts(projectPath)
}

function testCustomFonts() {
  const projectPath = createClassicProject('fonts')
  const sourceFolder = path.join(projectPath, 'purgetss', 'fonts')
  fs.mkdirSync(sourceFolder, { recursive: true })
  fs.copyFileSync(
    path.join(repoRoot, 'assets', 'fonts', 'FontAwesome7Free-Regular.ttf'),
    path.join(sourceFolder, 'custom-icons.ttf')
  )
  fs.writeFileSync(path.join(sourceFolder, 'custom-icons.css'), [
    '.custom-icon-home::before { content: "\\e001"; }',
    '.custom-icon-settings::before { content: "\\e002"; }',
    ''
  ].join('\n'))

  run(projectPath, 'build-fonts', '--module', '--font-class-from-filename')

  assert.ok(fs.existsSync(path.join(projectPath, 'Resources', 'fonts', 'FontAwesome7Free-Regular.ttf')))
  const modulePath = path.join(projectPath, 'Resources', 'lib', 'purgetss.fonts.js')
  assert.ok(fs.existsSync(modulePath))
  const customFonts = require(modulePath)
  assert.strictEqual(customFonts.families.customIcons, 'FontAwesome7Free-Regular')
  assert.strictEqual(customFonts.icons.customIcons.home, '\ue001')
  assertNoAlloyArtifacts(projectPath)
}

function testTextFontsOnlyModule() {
  const projectPath = createClassicProject('text-fonts')
  const sourceFolder = path.join(projectPath, 'purgetss', 'fonts')
  fs.mkdirSync(sourceFolder, { recursive: true })
  fs.copyFileSync(
    path.join(repoRoot, 'assets', 'fonts', 'MaterialIcons-Regular.ttf'),
    path.join(sourceFolder, 'Brand-Regular.ttf')
  )

  run(projectPath, 'build-fonts', '--module', '--font-class-from-filename')

  const modulePath = path.join(projectPath, 'Resources', 'lib', 'purgetss.fonts.js')
  assert.ok(fs.existsSync(modulePath), 'text-only --module output was not created')
  const customFonts = require(modulePath)
  assert.deepStrictEqual(customFonts.icons, {})
  assert.strictEqual(customFonts.families.brandRegular, 'MaterialIcons-Regular')
  assertNoAlloyArtifacts(projectPath)
}

try {
  testSemanticWithoutPurgeTSS()
  testExternalImageWithoutPurgeTSS()
  testImageDeploymentTargets()
  testIconLibrary()
  testModule()
  testShadesAndColorModule()
  testCustomFonts()
  testTextFontsOnlyModule()
  console.log('✅ Classic command compatibility contract passed')
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true })
}
