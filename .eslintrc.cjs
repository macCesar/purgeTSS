module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true, // Esto le dice a ESLint que estás usando Jest
    node: true
  },
  extends: 'standard',
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
    'space-before-function-paren': [
      'error',
      'never'
    ],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single']
  }
}
