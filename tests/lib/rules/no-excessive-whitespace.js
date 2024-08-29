'use strict'
import rule from '../../../lib/rules/no-excessive-whitespace.js'
import { createErrors, createTestCase, createVueTestCase, ruleTester } from '../../utils/index.js'

ruleTester.run('no-excessive-whitespace', rule, {
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
    createTestCase({
      code: `cva('', {})`,
    }),
    createTestCase({
      code: `
      const badgeVariants = cva(
        'inline-flex items-center text-xs',
        {
          variants: {
            size: {
              sm: 'min-h-1.5 min-w-1.5 self-center',
              lg: 'px-2',
            },
            variant: {
              default: 'text-foreground bg-gray-500',
              primary: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-primary-foreground',
              success: 'bg-success text-success-foreground',
              warning: 'bg-warning text-warning-foreground',
              destructive: 'bg-destructive text-destructive-foreground',
            },
            singleDigit: {
              true: 'px-1.5',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'lg',
          },
        },
      )`,
    }),
    createTestCase({
      code: `
      export default function HiMyNameIs({
          name = 'Hi, my name is -',
        }) {
          return (
            <h1 className="thats an awfully hot coffee pot">
              {name}
              Slim Shady
            </h1>
          )
        }`,
    }),
  ],
  invalid: [
    /* -------------------------------
    * JSX
    * ------------------------------- */
    createTestCase({
      code: `clsx('foo  bar baz')`,
      output: `clsx('foo bar baz')`,
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),
    createTestCase({
      code: `customCallee('foo  bar baz')`,
      output: `customCallee('foo bar baz')`,
      options: [{ callees: ['customCallee'] }],
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),
    createTestCase({
      code: `
      export default function HiMyNameIs({
          name = 'Hi, my name is -',
        }) {
          return (
            <h1 className="thats an awfully hot coffee pot ">
              {name}
              Slim Shady
            </h1>
          )
        }`,
      output: `
      export default function HiMyNameIs({
          name = 'Hi, my name is -',
        }) {
          return (
            <h1 className="thats an awfully hot coffee pot">
              {name}
              Slim Shady
            </h1>
          )
        }`,
      filename: 'test.tsx',
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createTestCase({
      code: `
      export default function foo() {
        function clsx(str) {
          return str
        }

        return clsx('foo bar baz ')
      }`,
      output: `
      export default function foo() {
        function clsx(str) {
          return str
        }

        return clsx('foo bar baz')
      }`,
      filename: 'test.js',
      errors: createErrors('excessive-whitespace-in-class-callee'),
    }),
    createTestCase({
      code: `
      export default function HiMyNameIs({
          name = 'Hi, my name is -',
        }) {
          return (
            <h1 quibble="thats an awfully hot coffee pot ">
              {name}
              Slim Shady
            </h1>
          )
        }`,
      output: `
      export default function HiMyNameIs({
          name = 'Hi, my name is -',
        }) {
          return (
            <h1 quibble="thats an awfully hot coffee pot">
              {name}
              Slim Shady
            </h1>
          )
        }`,
      filename: 'test.jsx',
      options: [{ classRegex: '^quibble$' }],
      errors: createErrors('excessive-whitespace-in-class-attribute'),
    }),
    createTestCase({
      code: `
      const badgeVariants = cva('inline-flex items-center text-xs',
        {
          variants: {
            size: {
              sm: 'min-h-1.5 min-w-1.5 self-center ',
              lg: 'px-2',
            },
            variant: {
              default: ' text-foreground bg-gray-500',
              primary: ' bg-primary text-primary-foreground',
              secondary: ' bg-secondary  text-primary-foreground',
              success: 'bg-success  text-success-foreground',
              warning: 'bg-warning text-warning-foreground',
              destructive: 'bg-destructive  text-destructive-foreground',
            },
            singleDigit: {
              true: 'px-1.5',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'lg',
          },
        },
      )`,
      output: `
      const badgeVariants = cva('inline-flex items-center text-xs',
        {
          variants: {
            size: {
              sm: 'min-h-1.5 min-w-1.5 self-center',
              lg: 'px-2',
            },
            variant: {
              default: 'text-foreground bg-gray-500',
              primary: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-primary-foreground',
              success: 'bg-success text-success-foreground',
              warning: 'bg-warning text-warning-foreground',
              destructive: 'bg-destructive text-destructive-foreground',
            },
            singleDigit: {
              true: 'px-1.5',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'lg',
          },
        },
      )`,
      filename: 'test.jsx',
      errors: createErrors('excessive-whitespace-in-class-attribute', 6),
    }),
    createTestCase({
      code: `
      const badgeVariants = cva('inline-flex items-center text-xs ',
        {
          variants: {
            size: {
              sm: 'min-h-1.5 min-w-1.5 self-center ',
              lg: 'px-2',
            },
            variant: {
              default: ' text-foreground bg-gray-500',
              primary: ' bg-primary text-primary-foreground',
              secondary: ' bg-secondary  text-primary-foreground',
              success: 'bg-success  text-success-foreground',
              warning: 'bg-warning text-warning-foreground',
              destructive: 'bg-destructive  text-destructive-foreground',
            },
            singleDigit: {
              true: 'px-1.5',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'lg',
          },
        },
      )`,
      output: `
      const badgeVariants = cva('inline-flex items-center text-xs',
        {
          variants: {
            size: {
              sm: 'min-h-1.5 min-w-1.5 self-center',
              lg: 'px-2',
            },
            variant: {
              default: 'text-foreground bg-gray-500',
              primary: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-primary-foreground',
              success: 'bg-success text-success-foreground',
              warning: 'bg-warning text-warning-foreground',
              destructive: 'bg-destructive text-destructive-foreground',
            },
            singleDigit: {
              true: 'px-1.5',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'lg',
          },
        },
      )`,
      filename: 'test.jsx',
      errors: [
        ...createErrors('excessive-whitespace-in-class-callee', 1),
        ...createErrors('excessive-whitespace-in-class-attribute', 6),
      ],
    }),

    /* -------------------------------
    * Vue
    * ------------------------------- */

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
