'use strict';

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'plugin:import/typescript',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: '2018',
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import', 'prettier', 'react', 'typescript'],
  rules: {
    'import/default': ['warn'],
    'import/export': ['warn'],
    'import/extensions': 'off',
    'import/first': 'error',
    'import/imports-first': ['error', 'absolute-first'],
    'import/named': OFF,
    'import/namespace': ['warn'],
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-as-default-member': OFF,
    'import/no-unresolved': [
      'error',
      {
        amd: true,
        commonjs: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            group: 'external',
            pattern: '@/**',
          },
        ],
      },
    ],
    'import/prefer-default-export': OFF,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/prop-types': 0,
    'react/display-name': 'off',
  },
  overrides: [
    {
      files: ['**/*.js?(x)'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/ban-ts-comment': ['warn'],
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'none',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            classes: false,
            functions: false,
            typedefs: false,
            variables: false,
          },
        ],
        '@typescript-eslint/no-useless-constructor': 'warn',
        'default-case': 'off',
        'no-dupe-class-members': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
      },
    },
    {
      files: ['*.test.ts', '*test.tsx', '*testUtil.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
