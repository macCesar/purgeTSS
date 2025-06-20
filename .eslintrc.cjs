module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
    node: true
  },
  extends: ['eslint:recommended'],
  plugins: ['import', 'n', 'promise'],
  globals: {
    _: true,
    Ti: true,
    Alloy: true,
    $model: true,
    OS_IOS: true,
    OS_ANDROID: true
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'spaced-comment': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    
    // Reglas de import plugin
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
    
    // Reglas de Node.js plugin
    'n/no-deprecated-api': 'error',
    
    // Reglas de Promise plugin
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error'
  }
}
