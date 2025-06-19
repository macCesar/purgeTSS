/**
 * Helper Functions Counter Test
 * Counts exported functions in each helper module for validation
 */

console.log('� Contando funciones exportadas en cada módulo helper...\n')

export async function countHelperFunctions() {
  const modules = [
    ['../../../src/shared/helpers/accessibility.js', 'Accessibility'],
    ['../../../src/shared/helpers/animation.js', 'Animation'],
    ['../../../src/shared/helpers/colors.js', 'Colors'],
    ['../../../src/shared/helpers/core.js', 'Core'],
    ['../../../src/shared/helpers/form-controls.js', 'Form Controls'],
    ['../../../src/shared/helpers/input.js', 'Input'],
    ['../../../src/shared/helpers/layout.js', 'Layout'],
    ['../../../src/shared/helpers/lists.js', 'Lists'],
    ['../../../src/shared/helpers/media.js', 'Media'],
    ['../../../src/shared/helpers/platform.js', 'Platform'],
    ['../../../src/shared/helpers/scrolling.js', 'Scrolling'],
    ['../../../src/shared/helpers/typography.js', 'Typography'],
    ['../../../src/shared/helpers/ui-properties.js', 'UI Properties'],
    ['../../../src/shared/helpers/utils.js', 'Utils']
  ]

  const results = {}
  let total = 0
  
  for (const [path, name] of modules) {
    try {
      const module = await import(path)
      const functions = Object.keys(module)
      const count = functions.length
      results[name] = { count, functions }
      console.log(`📊 ${name}: ${count} funciones exportadas`)
      total += count
    } catch (error) {
      console.error(`❌ Error en ${name}:`, error.message)
      results[name] = { count: 0, functions: [], error: error.message }
    }
  }
  
  console.log(`\n🎯 Total de funciones: ${total}`)
  return { results, total }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  countHelperFunctions().catch(console.error)
}
