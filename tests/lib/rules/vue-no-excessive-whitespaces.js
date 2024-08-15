'use strict'
import { create, meta } from '../../../lib/rules/vue-no-excessive-whitespaces.js'
import { createErrors, createVueTestCase, ruleTester } from '../../utils/index.js'

const rule = { meta, create }

ruleTester.run('vue-no-excessive-whitespaces', rule, {
  valid: [
    createVueTestCase({
      code: '<template><div class="foo bar baz" /></template>',
    }),
    createVueTestCase({
      code: '<template><div :class="{ foo: true, bar: true }" /></template>',
    }),
    createVueTestCase({
      code: '<template><div :class="[\'foo\', \'bar\']" /></template>',
    }),
  ],
  invalid: [
    // Excessive whitespaces in static class
    createVueTestCase({
      code: '<template><div class="foo  bar baz" /></template>',
      output: '<template><div class="foo bar baz" /></template>',
      errors: createErrors('excessive-whitespaces-in-static-class'),
    }),
    createVueTestCase({
      code: '<template><div class="foo  " /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespaces-in-static-class'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo" /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespaces-in-static-class'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo " /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespaces-in-static-class'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo bar    baz       " /></template>',
      output: '<template><div class="foo bar baz" /></template>',
      errors: createErrors('excessive-whitespaces-in-static-class'),
    }),

    // Excessive whitespaces in class object expression
    createVueTestCase({
      code: '<template><div :class="{ \'foo  bar\': true }" /></template>',
      output: '<template><div :class="{ \'foo bar\': true }" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'foo  \': true }" /></template>',
      output: '<template><div :class="{ \'foo\': true }" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  \': true }" /></template>',
      output: '<template><div :class="{ \'foo\': true }" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  bar   baz\': true }" /></template>',
      output: '<template><div :class="{ \'foo bar baz\': true }" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  bar   baz\': condition, \'lam  bam\': condition2 }" /></template>',
      output: '<template><div :class="{ \'foo bar baz\': condition, \'lam bam\': condition2 }" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression', 2),
    }),

    // Excessive whitespaces in class array expression
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo \' : \'   baz \']" /></template>',
      output: '<template><div :class="[condition ? \'foo\' : \'baz\']" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-array-expression', 2),
    }),
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo  bar\' : \'baz lee\']" /></template>',
      output: '<template><div :class="[condition ? \'foo bar\' : \'baz lee\']" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-array-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo  bar\' : \'baz  lee\']" /></template>',
      output: '<template><div :class="[condition ? \'foo bar\' : \'baz lee\']" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-array-expression', 2),
    }),

    // Excessive whitespaces in class object expression in array expression
    createVueTestCase({
      code: '<template><div :class="[{ [\'bar  \']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="[{ [\'    bar  \']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
    createVueTestCase({
      code: '<template><div :class="[{ [\'bar  baz\']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar baz\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespaces-in-class-object-expression'),
    }),
  ],
})
