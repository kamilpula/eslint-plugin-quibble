const antfu = require('@antfu/eslint-config').default

const localPlugin = require('./lib/index.js')

module.exports = antfu({
  plugins: {
    localPlugin,
  },
  vue: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
    jsonc: true,

  },
  rules: {
    'jsonc/sort-keys': 'error',
    'localPlugin/foo': 'error',
  },
})
