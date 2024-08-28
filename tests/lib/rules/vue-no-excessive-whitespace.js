'use strict'
import rule from '../../../lib/rules/vue-no-excessive-whitespace.js'
import { createErrors, createVueTestCase, ruleTester } from '../../utils/index.js'

ruleTester.run('vue-no-excessive-whitespace', rule, {
  valid: [
    createVueTestCase({
      code: `<script setup>clsx('foo bar baz')</script>`,
    }),
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
    // Excessive whitespace in callee
    createVueTestCase({
      code: `<script setup>clsx('foo  bar baz')</script>`,
      output: `<script setup>clsx('foo bar baz')</script>`,
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),
    createVueTestCase({
      code: '<template><div :class="clsx(\'foo  bar baz\')" /></template>',
      output: '<template><div :class="clsx(\'foo bar baz\')" /></template>',
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),

    // Excessive whitespace in custom callee
    createVueTestCase({
      options: [{ callees: ['customCallee'] }],
      code: `<script setup>customCallee('foo  bar baz')</script>`,
      output: `<script setup>customCallee('foo bar baz')</script>`,
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),
    createVueTestCase({
      options: [{ callees: ['customCallee'] }],
      code: '<template><div :class="customCallee(\'foo  bar baz\')" /></template>',
      output: '<template><div :class="customCallee(\'foo bar baz\')" /></template>',
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),

    // Excessive whitespace in custom class regex
    createVueTestCase({
      options: [{ classRegex: '^quibble$' }],
      code: '<template><div quibble="foo  bar baz" /></template>',
      output: '<template><div quibble="foo bar baz" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),

    // Excessive whitespace in literal class attribute
    createVueTestCase({
      code: '<template><div class="foo  bar baz" /></template>',
      output: '<template><div class="foo bar baz" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div class="foo  " /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo" /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo " /></template>',
      output: '<template><div class="foo" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div class=" foo bar    baz       " /></template>',
      output: '<template><div class="foo bar baz" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),

    // Excessive whitespace in object expression class attribute
    createVueTestCase({
      code: '<template><div :class="{ \'foo  bar\': true }" /></template>',
      output: '<template><div :class="{ \'foo bar\': true }" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'foo  \': true }" /></template>',
      output: '<template><div :class="{ \'foo\': true }" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  \': true }" /></template>',
      output: '<template><div :class="{ \'foo\': true }" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  bar   baz\': true }" /></template>',
      output: '<template><div :class="{ \'foo bar baz\': true }" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="{ \'   foo  bar   baz\': condition, \'lam  bam\': condition2 }" /></template>',
      output: '<template><div :class="{ \'foo bar baz\': condition, \'lam bam\': condition2 }" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute', 2),
    }),

    // Excessive whitespace in array expression class attribute
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo \' : \'   baz \']" /></template>',
      output: '<template><div :class="[condition ? \'foo\' : \'baz\']" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute', 2),
    }),
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo  bar\' : \'baz lee\']" /></template>',
      output: '<template><div :class="[condition ? \'foo bar\' : \'baz lee\']" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="[condition ? \'foo  bar\' : \'baz  lee\']" /></template>',
      output: '<template><div :class="[condition ? \'foo bar\' : \'baz lee\']" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute', 2),
    }),

    // Excessive whitespace in object expression in array expression class attribute
    createVueTestCase({
      code: '<template><div :class="[{ [\'bar  \']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="[{ [\'    bar  \']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createVueTestCase({
      code: '<template><div :class="[{ [\'bar  baz\']: condition }]" /></template>',
      output: '<template><div :class="[{ [\'bar baz\']: condition }]" /></template>',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
  ],
})
