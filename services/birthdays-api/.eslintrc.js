module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2016',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    semi: [2, 'always'],
    'space-before-function-paren': ['error', 'never'],
    camelcase: 'off',
    'no-unused-vars': 'warn'
  }
};
