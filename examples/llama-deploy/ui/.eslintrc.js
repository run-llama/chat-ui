module.exports = {
  extends: ['@llamaindex/eslint-config/next.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-promise-executor-return': 'off',
    '@typescript-eslint/no-loop-func': 'off',
    'turbo/no-undeclared-env-vars': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'no-nested-ternary': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
  },
}
