const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

module.exports = {
  extends: [
    ...[
      '@vercel/style-guide/eslint/node',
      '@vercel/style-guide/eslint/typescript',
      '@vercel/style-guide/eslint/browser',
      '@vercel/style-guide/eslint/react',
      '@vercel/style-guide/eslint/next',
    ].map(require.resolve),
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  // add rules configurations here
  rules: {
    'import/no-default-export': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'no-console': 'off',
    'import/order': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-alert': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'react/no-array-index-key': 'off',
    '@next/next/no-img-element': 'off',
    'react/jsx-sort-props': 'off',
    'no-template-curly-in-string': 'off',
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
