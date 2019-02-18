'use strict';

const OFF = 0;
const ERROR = 2;

module.exports = {
  extends: ['plugin:prettier/recommended', 'react-app'],

  plugins: ['react', 'prettier'],

  // We're stricter than the default config, mostly. We'll override a few rules
  // and then enable some React specific ones.
  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, 'stroustrup'],
    'comma-dangle': [ERROR, 'always-multiline'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': OFF,
    eqeqeq: [ERROR, 'allow-null'],
    'indent': [ERROR, 2, { "flatTernaryExpressions": true, "ignoredNodes": ["ConditionalExpression"]  }],
    'jsx-quotes': [ERROR, 'prefer-double'],
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, { args: 'none' }],
    "no-tabs": ["error", {"allowIndentationTabs": true}],
    'no-useless-concat': OFF,
    'object-curly-spacing': [ERROR, 'always'],
    quotes: [
      ERROR,
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    //'max-len': [2, { code: 300, tabWidth: 4, ignoreUrls: true }],

    // React & JSX
    // Our transforms set this automatically
    'react/jsx-boolean-value': [ERROR, 'always'],
    'react/jsx-no-undef': ERROR,
    // We don't care to do this
    'react/jsx-sort-prop-types': OFF,
    // 'react/jsx-space-before-closing': ERROR,
    'react/jsx-tag-spacing': [ERROR, { beforeSelfClosing: 'always' }],
    'react/jsx-uses-react': ERROR,
    'react/no-is-mounted': OFF,
    // This isn't useful in our test code
    'react/react-in-jsx-scope': ERROR,
    'react/self-closing-comp': ERROR,
    "prettier/prettier": "error",
    // We don't care to do this
    'react/jsx-wrap-multilines': [
      ERROR,
      { declaration: false, assignment: false },
    ],
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
};
