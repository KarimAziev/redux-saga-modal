module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: '2018',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'eslint-plugin-tsdoc'],
  rules: {
    'tsdoc/syntax': 'warn',
    'import/default': ['warn'],
    'import/export': ['warn'],
    'import/extensions': 'off',
    'import/first': 'error',
    'import/imports-first': ['error', 'absolute-first'],
    'import/named': 'off',
    'import/namespace': ['off'],
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-as-default-member': 'off',
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
      },
    ],
    'import/prefer-default-export': 0,
    'react/prop-types': 'off',
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
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
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
    'import/internal-regex': '^@/',
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    react: {
      version: 'detect',
    },
  },
};
