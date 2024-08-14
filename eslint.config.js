import antfu from '@antfu/eslint-config'

import localPlugin from './lib/index.js'

export default antfu({
  plugins: {
    localPlugin
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
