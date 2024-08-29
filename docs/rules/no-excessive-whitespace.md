# quibble/no-excessive-whitespace

## :book: Rule details

This rule removes unnecessary whitespace characters, including leading, trailing, and multiple consecutive spaces in class names. It applies to callees inside `<script>` and `<template>` tags and within `class` attributes matching a class regex inside Vue templates.

## :x: Examples of **incorrect** code for this rule:

### Class definition inside a callee in the `<script>` tag

```html
<script setup>
  const foo = clsx(' foo bar baz')
</script>

```

### Class definition inside a callee in the `<template>` tag

```html
<template>
  <div :class="clsx('foo bar baz ')" />
</template>

```

### Custom attribute

```js
...
options: [{ classRegex: '^quibble$' }],
...
```

```html
<template>
  <div quibble="foo  bar baz" />
</template>

```

### Literal class definition

```html
<template>
  <div class="text-primary bg-background px-2 py-1">
    Incorrect literal class definition.
  </div>
</template>

```

### Object expression class definition

```html
<template>
  <div :class="{ 'text-primary ': condition, ' flex    gap-2 ': condition2 }">
    Incorrect object expression class definition.
  </div>
</template>

```

### Array expression class definition

```html
<template>
  <div :class="[condition ? 'absolute  left-0   top-0 ' : ' text-warning ']" />
    Incorrect array expression class definition.
  </div>
</template>

```

### Object expression inside array expression class definition

```html
<template>
  <div
    :class="[{ [' object-cover   object-center  transition   ']: condition }]"
  >
    Incorrect object expression inside an array expression class definition.
  </div>
</template>

```

## :white_check_mark: Examples of **correct** code for this rule:

### Class definition inside a callee in the `<script>` tag

```html
<script setup>
  const foo = clsx('foo bar baz')
</script>

```

### Class definition inside a callee in the `<template>` tag

```html
<template>
  <div :class="clsx('foo bar baz')" />
</template>

```

### Custom attribute

```js
...
options: [{ classRegex: '^quibble$' }],
...
```

```html
<template>
  <div quibble="foo bar baz" />
</template>

```

### Literal class definition

```html
<template>
  <div class="text-primary bg-background px-2 py-1">
    Correct literal class definition.
  </div>
</template>

```

### Object expression class definition

```html
<template>
  <div :class="{ 'text-primary': condition, 'flex gap-2': condition2 }">
    Correct object expression class definition.
  </div>
</template>

```

### Array expression class definition

```html
<template>
  <div :class="[condition ? 'absolute left-0 top-0 ' : 'text-warning']" />
    Correct array expression class definition.
  </div>
</template>

```

### Object expression inside array expression class definition

```html
<template>
  <div :class="[{ ['object-cover object-center transition']: condition }]">
    Correct object expression inside array expression class definition.
  </div>
</template>

```

## :wrench: Options

```js
...
"quibble/no-excessive-whitespace": [<enabled>, {
  'classRegex': <string>,
  'callees': Array<string>
}]
...
```

### `callees`

Callees in this case are functions that are usually responsible for merging different class declarations on certain conditions. The default options cover most of those functions from commonly used libraries, such as [`clsx`](https://github.com/lukeed/clsx), [`cva`](https://github.com/joe-bell/cva) or [`twMerge`](https://github.com/dcastil/tailwind-merge) etc.

#### Default:

```js
['classnames', 'clsx', 'ctl', 'cva', 'tv', 'cn', 'twMerge']
```

### `classRegex`

Regular expression to match the class attribute. By default, the rule is looking for the `class` or `className` attribute in the template.

#### Default:

```js
'classRegex': '^class(Name)?$'
```

## :warning: Limitations

This rule currently supports following languages/frameworks:

- Vue

The support for `{j,t}sx` is on the way.

## :rocket: Version

This rule was first introduced in `eslint-plugin-quibble` in [`v0.1.3`](https://github.com/kamilpula/eslint-plugin-quibble/releases/tag/v0.1.3).
