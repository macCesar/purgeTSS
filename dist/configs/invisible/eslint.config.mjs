import js from '@eslint/js'

// Globals that Alloy and the Titanium runtime inject into every controller.
// This is what `eslint-config-axway/env-alloy` used to provide; axway removed
// the `env-alloy` and `env-titanium` environments in v10.0.0, so the template
// declares them itself.
const titanium = {
  // Titanium & Alloy
  Ti: 'readonly',
  Titanium: 'readonly',
  Alloy: 'readonly',
  Backbone: 'readonly',
  $: 'readonly',
  $model: 'readonly',
  _: 'readonly',
  L: 'readonly',
  Widget: 'readonly',

  // Compile-time constants Alloy substitutes
  OS_IOS: 'readonly',
  OS_ANDROID: 'readonly',
  ENV_DEV: 'readonly',
  ENV_TEST: 'readonly',
  ENV_PRODUCTION: 'readonly',
  DIST_ADHOC: 'readonly',
  DIST_STORE: 'readonly',

  // Host globals the Titanium runtime provides (not ECMAScript built-ins)
  console: 'readonly',
  alert: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',

  // `task` is the global inside alloy.jmk build hooks
  task: 'readonly'
}

export default [
  // `Resources/` is Alloy's compiled output and `build/` is the native build:
  // both are generated, so linting them only reports someone else's code.
  // The files under `app/lib/` are the ones PurgeTSS itself copies in
  // (`purgetss icon-library`, `purgetss module`, `purgetss color-module`).
  // They are listed one by one on purpose: ignoring `app/lib/**` wholesale
  // would silence the developer's own libraries living in that same folder.
  {
    ignores: [
      'Resources/**',
      'build/**',
      'node_modules/**',
      'purgetss/**',
      'app/lib/fontawesome.js',
      'app/lib/materialicons.js',
      'app/lib/materialsymbols.js',
      'app/lib/framework7icons.js',
      'app/lib/purgetss.ui.js',
      'app/lib/purgetss.colors.js'
    ]
  },

  {
    files: ['app/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: titanium
    },
    rules: {
      ...js.configs.recommended.rules,

      'spaced-comment': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'array-bracket-spacing': ['error', 'never'],
      'max-statements-per-line': ['error', { max: 2 }],

      // Alloy wires event handlers from the XML view (`onClick="tocar"`,
      // `dataTransform="fila"`), so a controller function with no caller in the
      // JS may still be in use. `eslint-plugin-alloy` used to read the XML to
      // tell those apart, but it has been unmaintained since 2022 and does not
      // load under eslint 9. Warn instead of erroring until that gap is closed.
      'no-unused-vars': ['warn', { args: 'none' }]
    }
  }
]
