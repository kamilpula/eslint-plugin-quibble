# Remove any excessive whitespace from class attribute in Vue template.

## Rule details

This rule ensures that the class attribute in Vue templates does not contain any excessive whitespace. It removes unnecessary whitespace characters, including leading and trailing spaces, as well as multiple spaces between class names.

### Examples of **incorrect** code for this rule:

#### Static class definition

```html
<template>
  <div class="text-primary bg-background px-2 py-1">
    Incorrect static class definition.
  </div>
</template>

```

#### Object expression class definition

```html
<template>
  <div :class="{ 'text-primary ': condition, ' flex    gap-2 ': condition2 }">
    Incorrect object expression class definition.
  </div>
</template>

```

#### Array expression class definition

```html
<template>
  <div :class="[condition ? 'absolute  left-0   top-0 ' : ' text-warning ']" />
    Incorrect array expression class definition.
  </div>
</template>

```

#### Object expression inside array expression class definition

```html
<template>
  <div
    :class="[{ [' object-cover   object-center  transition   ']: condition }]"
  >
    Incorrect object expression inside array expression class definition.
  </div>
</template>

```

### Examples of **correct** code for this rule:

#### Static class definition

```html
<template>
  <div class="text-primary bg-background px-2 py-1">
    Correct static class definition.
  </div>
</template>

```

#### Object expression class definition

```html
<template>
  <div :class="{ 'text-primary': condition, 'flex gap-2': condition2 }">
    Correct object expression class definition.
  </div>
</template>

```

#### Array expression class definition

```html
<template>
  <div :class="[condition ? 'absolute left-0 top-0 ' : 'text-warning']" />
    Correct array expression class definition.
  </div>
</template>

```

#### Object expression inside array expression class definition

```html
<template>
  <div :class="[{ ['object-cover object-center transition']: condition }]">
    Correct object expression inside array expression class definition.
  </div>
</template>

```

### Limitations

At the moment, the rule works only inside the `Vue` template for the following class definitions:

- static
- object expression
- array expression
- object expression inside an array expression.

### Options

```js
...
"quibble/vue-no-excessive-whitespace": <enabled>
...
```
