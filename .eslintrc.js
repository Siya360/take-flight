// .eslintrc.js
module.exports = {
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
      'plugin:jest/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['prettier', 'jest'],
    rules: {
      // Enforce consistent code style
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Enforce best practices
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      
      // Error handling
      'no-throw-literal': 'error',
      'handle-callback-err': 'error',
      
      // Testing rules
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/prefer-to-have-length': 'warn',
    },
  }