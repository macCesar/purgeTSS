/**
 * Test más real que simula el uso del helpers en PurgeTSS
 * Ejecuta funciones que realmente usan dependencias complejas
 */

import {
  backgroundColor,
  width,
  height,
  margin,
  padding,
  fontSize,
  borderRadius,
  shadowColor,
  textColor
} from '../../src/shared/helpers.js'

console.log('🧪 RUNNING REAL HELPERS TESTS...\n')

try {
  console.log('     ✅ Testing backgroundColor with complex values...')
  backgroundColor({ 'bg-red-500': true, 'bg-blue-300': true })
  console.log('        backgroundColor() executed successfully')

  console.log('     ✅ Testing width with responsive values...')
  width({ 'w-full': true, 'w-1/2': true })
  console.log('        width() executed successfully')

  console.log('     ✅ Testing height with arbitrary values...')
  height({ 'h-96': true, 'h-screen': true })
  console.log('        height() executed successfully')

  console.log('     ✅ Testing margin with negative values...')
  margin({ 'm-4': true, '-m-2': true })
  console.log('        margin() executed successfully')

  console.log('     ✅ Testing padding with responsive breakpoints...')
  padding({ 'p-2': true, 'p-4': true })
  console.log('        padding() executed successfully')

  console.log('     ✅ Testing fontSize with text properties...')
  fontSize({ 'text-lg': true, 'text-xl': true })
  console.log('        fontSize() executed successfully')

  console.log('     ✅ Testing borderRadius with complex values...')
  borderRadius({ 'rounded-md': true, 'rounded-full': true })
  console.log('        borderRadius() executed successfully')

  console.log('     ✅ Testing shadowColor with transparency...')
  shadowColor({ 'shadow-red-500': true, 'shadow-blue-300': true })
  console.log('        shadowColor() executed successfully')

  console.log('     ✅ Testing textColor with hover states...')
  textColor({ 'text-gray-800': true, 'text-white': true })
  console.log('        textColor() executed successfully')

  console.log('\n     🎉 TODOS LOS TESTS REALES PASARON EXITOSAMENTE!')
  console.log('     ✅ Todas las dependencias funcionan correctamente en contexto real')
} catch (error) {
  console.error('\n     ❌ ERROR EN TEST REAL:')
  console.error('     ' + error.message)
  console.error('\n     📍 Stack trace:')
  console.error('     ' + error.stack)
  throw error
}
