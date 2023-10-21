module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  globals: {
    _: true,
    Ti: true,
    Alloy: true,
    $model: true,
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
    ecmaVersion: 'latest'
  },
  rules: {
    'spaced-comment': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      'never'
    ]
  }
}
