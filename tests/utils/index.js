import { RuleTester } from 'eslint'
import vueParser from 'vue-eslint-parser'

export const parserOptions = {
  ecmaVersion: 2019,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

export const ruleTester = new RuleTester({ languageOptions: { parserOptions } })

export function createErrors(messageId, count = 1) {
  const errors = []

  for (let i = 0; i < count; i++)
    errors.push({ messageId })

  return errors
}

export function createVueTestCase({ code, output = '', errors = [], options = [] }) {
  return { code, output, errors, languageOptions: { parser: vueParser }, filename: 'test.vue', options }
}
