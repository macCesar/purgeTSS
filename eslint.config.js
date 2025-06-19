import js from '@eslint/js'
import nodePlugin from 'eslint-plugin-n'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'

export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  nodePlugin.configs['flat/recommended'],
  promisePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        _: 'readonly',
        Ti: 'readonly',
        Alloy: 'readonly',
        $model: 'readonly',
        OS_IOS: 'readonly',
        OS_ANDROID: 'readonly'
      }
    },
    rules: {
      'spaced-comment': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single']
    }
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'module'
    }
  }
]
