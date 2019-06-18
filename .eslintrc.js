'use strict';

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {

  extends: [    
    'prettier/react',
    'fbjs',
  ],

  plugins: ['react', 'flowtype', 'prettier'],

  // We're stricter than the default config, mostly. We'll override a few rules
  // and then enable some React specific ones.
  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'comma-dangle': [ERROR, 'always-multiline'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': OFF,
    eqeqeq: [ERROR, 'allow-null'],
    indent: [WARN, 2],
    'jsx-quotes': [ERROR, 'prefer-single'],
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    requireObjectKeysOnNewLine: true,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, { args: 'none' }],
    'no-useless-concat': OFF,
    'array-callback-return': WARN,
    'object-curly-spacing': [ERROR, 'always'],
    'space-before-blocks': ERROR,
    'object-property-newline': [
      ERROR,
      { allowMultiplePropertiesPerLine: false },
    ],
    'class-methods-use-this': OFF,
    'space-before-function-paren': OFF,
    quotes: [ERROR, 'single'],
    'max-len': [
      2,
      {
        code: 80,
        tabWidth: 4,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],

    // React & JSX
    // Our transforms set this automatically
    'react/jsx-boolean-value': [ERROR, 'always'],
    'react/jsx-no-undef': ERROR,
    // We don't care to do this
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-uses-react': ERROR,
    'react/no-is-mounted': OFF,
    'no-restricted-globals': WARN,
    'react/jsx-tag-spacing': [ERROR, { beforeSelfClosing: 'always' }],
    'react/jsx-one-expression-per-line': [ERROR, { allow: 'literal' }],
    // This isn't useful in our test code
    'react/react-in-jsx-scope': ERROR,
    'react/no-array-index-key': WARN,
    'react/destructuring-assignment': [OFF, 'always'],
    'react/jsx-first-prop-new-line': ERROR,
    'react/self-closing-comp': ERROR,
    'react/no-unused-prop-types': WARN,
    'react/default-props-match-prop-types': WARN,
    'react/require-default-props': WARN,
    'jsx-a11y/label-has-associated-control': WARN,
    'jsx-a11y/anchor-is-valid': WARN,
    'jsx-a11y/label-has-associated-control': OFF,
    'react/jsx-curly-brace-presence': [
      ERROR,
      {
        props: 'always',
        children: 'never',
      },
    ],
    'react/jsx-closing-bracket-location': [
      ERROR,
      { selfClosing: 'line-aligned', nonEmpty: 'after-props' },
    ],
    'react/jsx-wrap-multilines': [
      ERROR,
      { declaration: false, assignment: false },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-max-props-per-line': [
      WARN,
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'react/no-unused-state': WARN,
    'react/button-has-type': WARN,
    'react/prop-types': OFF,
    'no-underscore-dangle': OFF,
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
};
