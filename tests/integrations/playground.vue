<script setup>
const condition = true

function clsx() {
  return 'quibble!'
}

const t = clsx('clsx class example', { foo: 'shazam' })

function customCallee() {
  return 'quibble in custom callee!'
}
</script>

<template>
  <div class="f bar">
    hej
  </div>

  <div
    :class="{ 'text-primary foo': condition }"
  />

  <div :class="[condition ? 'absolute left-0 top-0' : 'text-warning']" />

  <div :class="[{ ['object-cover object-center transition']: condition }]" />

  <!-- clsx supported by default, overriden in the rule config -->
  <div :class="clsx('text-primary absolute')" />
  <div :class="customCallee('text-primary absolute')" />

  <!-- Custom class regex support -->
  <div bass="text-primary absolute" />
</template>
