module.exports = {
  printWidth: 80,
  parser: 'typescript',
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  arrowParens: 'always',
  singleQuote: true,
  bracketSpacing: true,
  overrides: [
    {
      files: '*.test.js',
      options: {
        semi: true,
      },
    },
    {
      files: ['*.json'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
    {
      files: ['*.md'],
      options: {
        parser: 'markdown',
      },
    },
  ],
};
