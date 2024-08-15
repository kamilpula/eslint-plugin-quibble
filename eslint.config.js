import antfu from '@antfu/eslint-config'

import quibble from './lib/index.js'

export default antfu({
  plugins: {
    quibble,
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
    'quibble/vue-no-excessive-whitespaces': 'error',
  },
})
