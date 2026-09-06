/**
 * Tests for the ESLint config template shipped to user projects.
 *
 * This guards the exact rot that broke it before: the template used to be an
 * `.eslintrc.js` extending `eslint-config-axway/env-alloy`, and it silently
 * stopped working when eslint 9 dropped eslintrc and axway 10.0.0 removed the
 * `env-alloy` environment. Nothing failed loudly, because nothing tested it.
 *
 * The template is checked in BOTH directions on purpose: a config that lints
 * nothing at all would also report zero problems on valid code.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ESLint } from 'eslint'

const here = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(here, '../../../dist/configs/invisible')
const templatePath = path.join(templateDir, 'eslint.config.mjs')

// Written the way the template demands: no semicolons, single quotes, two-space
// indent, no space before the function parens, and leaning on the Titanium and
// Alloy globals that `env-alloy` used to declare.
const CONTROLADOR_VALIDO = `const helper = require('helper')

function tocar(e) {
  if (OS_ANDROID) {
    console.log(e.source.id, Ti.Platform.osname, L('saludo'))
  }
  $.win.close()
}

$.win.addEventListener('click', tocar)
exports.destroy = () => helper.limpiar(Alloy.Globals, _.first([1, 2]))
`

const CONTROLADOR_INVALIDO = `function mal () {
      var x = "comillas dobles";
      return x
}
mal()
`

async function lintear(codigo, nombre) {
  const eslint = new ESLint({
    overrideConfigFile: templatePath,
    cwd: templateDir
  })
  const [resultado] = await eslint.lintText(codigo, {
    filePath: path.join(templateDir, 'app/controllers', nombre)
  })
  return resultado.messages
}

// Un controlador idiomático de Alloy no debe reportar NADA. Si aquí aparece un
// `no-undef`, es que a la lista de globales le falta uno.
async function testControladorValidoNoReportaNada() {
  try {
    const mensajes = await lintear(CONTROLADOR_VALIDO, 'valido.js')

    if (mensajes.length === 0) {
      console.log('✅ Valid Alloy controller reports no problems')
      return true
    }

    console.error('❌ Valid Alloy controller reported problems:')
    mensajes.forEach(m => console.error(`   ${m.line}:${m.column} ${m.ruleId}: ${m.message}`))
    return false
  } catch (error) {
    console.error('❌ Error linting the valid controller:', error.message)
    return false
  }
}

// El control positivo: si el template dejara de aplicar reglas, el test de
// arriba seguiría en verde. Este exige que las reglas de estilo sí disparen.
async function testControladorInvalidoSiReportaReglas() {
  try {
    const mensajes = await lintear(CONTROLADOR_INVALIDO, 'invalido.js')
    const reglas = new Set(mensajes.map(m => m.ruleId))
    const esperadas = ['semi', 'quotes', 'indent', 'space-before-function-paren']
    const faltantes = esperadas.filter(r => !reglas.has(r))

    if (faltantes.length === 0) {
      console.log('✅ Style rules fire on non-conforming code:', esperadas.join(', '))
      return true
    }

    console.error('❌ These rules never fired, the template may not be applying them:', faltantes.join(', '))
    return false
  } catch (error) {
    console.error('❌ Error linting the invalid controller:', error.message)
    return false
  }
}

// PurgeTSS copies its own generated libraries into the project's `app/lib/`.
// Linting them floods the report with thousands of problems the developer
// cannot act on, so the template must ignore them by name.
async function testIgnoraLibrariasGeneradas() {
  try {
    const eslint = new ESLint({ overrideConfigFile: templatePath, cwd: templateDir })
    const generadas = [
      'app/lib/materialsymbols.js',
      'app/lib/materialicons.js',
      'app/lib/fontawesome.js',
      'app/lib/framework7icons.js',
      'app/lib/purgetss.ui.js',
      'app/lib/purgetss.colors.js'
    ]

    const noIgnoradas = []
    for (const archivo of generadas) {
      const ignorado = await eslint.isPathIgnored(path.join(templateDir, archivo))
      if (!ignorado) { noIgnoradas.push(archivo) }
    }

    // El código propio del desarrollador en esa misma carpeta SÍ debe lintearse.
    const propio = await eslint.isPathIgnored(path.join(templateDir, 'app/lib/miHelper.js'))

    if (noIgnoradas.length === 0 && !propio) {
      console.log('✅ Generated libraries ignored, developer code in app/lib still linted')
      return true
    }

    if (noIgnoradas.length) { console.error('❌ Not ignored:', noIgnoradas.join(', ')) }
    if (propio) { console.error('❌ app/lib/miHelper.js is ignored, the ignore pattern is too broad') }
    return false
  } catch (error) {
    console.error('❌ Error checking ignores:', error.message)
    return false
  }
}

async function testInstaladoresCopianElTemplate() {
  try {
    const instaladores = [
      path.resolve(here, '../../../src/cli/commands/create.js'),
      path.resolve(here, '../../../src/cli/commands/dependencies.js')
    ]

    const problemas = []
    for (const archivo of instaladores) {
      const codigo = fs.readFileSync(archivo, 'utf8')
      const nombre = path.basename(archivo)

      // El nombre del template vive en dos lados: aquí y en el `cp` de cada
      // instalador. Renombrarlo en uno solo deja un `cp` que falla en el
      // proyecto del usuario, y este test seguiría pasando sin esta línea.
      if (!codigo.includes('dist/configs/invisible/eslint.config.mjs')) {
        problemas.push(`${nombre} no copia dist/configs/invisible/eslint.config.mjs`)
      }
      for (const muerto of ['eslint-config-axway', 'eslint-plugin-alloy', '.eslintrc']) {
        if (codigo.includes(muerto)) { problemas.push(`${nombre} todavía referencia ${muerto}`) }
      }
    }

    if (!fs.existsSync(templatePath)) { problemas.push('el template no existe en dist/configs/invisible/') }

    if (problemas.length === 0) {
      console.log('✅ create.js and dependencies.js copy the shipped template, with no dead references')
      return true
    }

    for (const problema of problemas) { console.error('❌', problema) }
    return false
  } catch (error) {
    console.error('❌ Error checking installers:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting ESLint Template Tests...\n')

  const results = await Promise.all([
    testControladorValidoNoReportaNada(),
    testControladorInvalidoSiReportaReglas(),
    testIgnoraLibrariasGeneradas(),
    testInstaladoresCopianElTemplate()
  ])

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`\n📊 Test Results: ${passed}/${total} passed`)

  if (passed === total) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed!')
    process.exit(1)
  }
}

runTests().catch(error => {
  console.error(error)
  process.exit(1)
})
