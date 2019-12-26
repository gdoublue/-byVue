module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-infix-ops': 0,
    'keyword-spacing': 0,
    'spaced-comment': 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'standard/computed-property-even-spacing': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
