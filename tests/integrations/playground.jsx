export default function HiMyNameIs({
  name = 'Hi, my name is -',
}) {
  function clsx(str) {
    return str
  }

  const foo = clsx('foo bar baz')

  return (
    <h1 className={clsx('foo bar baz')}>
      {name}
      Slim Shady
    </h1>
  )
}
