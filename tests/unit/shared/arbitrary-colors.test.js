import assert from 'node:assert/strict'
import test from 'node:test'
import { _applyClasses, compileApplyDirectives, formatArbitraryValues } from '../../../src/shared/helpers/utils.js'
import { validateClassSyntax } from '../../../src/cli/utils/unsupported-class-reporter.js'

test('arbitrary RGB and RGBA colors generate properties and selectors', () => {
  const cases = [
    ['bg-(rgb(100,200,50))', 'backgroundColor: \'rgb(100,200,50)\''],
    ['bg-(rgba(10,20,30,0.5))', 'backgroundColor: \'rgba(10,20,30,0.5)\''],
    ['text-(rgb(100,200,50))', 'color: \'rgb(100,200,50)\', textColor: \'rgb(100,200,50)\''],
    ['border-(rgba(10,20,30,0.5))', 'borderColor: \'rgba(10,20,30,0.5)\''],
    ['bg-selected-(rgba(10,20,30,0.5))', 'backgroundSelectedColor: \'rgba(10,20,30,0.5)\'']
  ]

  for (const [className, properties] of cases) {
    assert.equal(formatArbitraryValues(className), properties, className)
    assert.equal(formatArbitraryValues(className, true), `'.${className}': { ${properties} }`, className)
  }
  assert.doesNotThrow(() => validateClassSyntax({ classes: cases.map(([className]) => className), viewPaths: [] }))
})

test('arbitrary values reject incomplete or incorrectly ordered parentheses', () => {
  for (const className of [
    'bg-(rgb(100,200,50)',
    'bg-(rgb(100,200,50)))',
    'bg-(rgb)100,200,50()',
    'bg-(rgb(100,200,50))suffix',
    'bg-()',
    'bg-(',
    'top-(-10)'
  ]) {
    assert.equal(formatArbitraryValues(className), null, className)
    assert.equal(formatArbitraryValues(className, true), `// Property not yet supported: ${className}`, className)
  }
})

test('hex colors, explicit units and leading negative prefixes remain supported', () => {
  assert.equal(formatArbitraryValues('bg-(#64C832)'), 'backgroundColor: \'#64C832\'')
  assert.equal(formatArbitraryValues('w-(100px)'), 'width: \'100px\'')
  assert.equal(formatArbitraryValues('-top-(10)'), 'top: -10')
})

test('apply preserves color commas and quoted text while overriding defaults', () => {
  _applyClasses['.colorProbe'] = new Set(['bg-(rgba(10,20,30,0.5))', 'border-(rgb(1,2,3))'])
  try {
    const output = compileApplyDirectives('\'.colorProbe\': { backgroundColor: \'#ffffff\', text: \'It\\\'s ), blue\', {_applyProperties_} }')
    assert.equal(output, '\'.colorProbe\': { backgroundColor: \'rgba(10,20,30,0.5)\', text: \'It\\\'s ), blue\', borderColor: \'rgb(1,2,3)\' }')
  } finally {
    delete _applyClasses['.colorProbe']
  }
})
