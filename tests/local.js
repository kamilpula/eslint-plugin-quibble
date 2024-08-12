export function correctFooBar() {
  const foo = 'bar'
  console.warn(foo)
}

export function incorrectFoo() {
  const foo = 'bar' // Problem!
  console.warn(foo)
}
