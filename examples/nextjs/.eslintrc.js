module.exports = {
  extends: ['@llamaindex/eslint-config/next.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-promise-executor-return': 'off',
    '@typescript-eslint/no-loop-func': 'off',
    'turbo/no-undeclared-env-vars': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
}
