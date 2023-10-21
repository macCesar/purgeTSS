module.exports = {
  extends: 'axway/env-alloy',
  globals: { task: true, $model: true },
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'array-bracket-spacing': ['error', 'never'],
    'max-statements-per-line': ['error', { max: 2 }],
    'space-before-function-paren': ['error', 'never']
  }
}
