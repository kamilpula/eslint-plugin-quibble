export default function HiMyNameIs({
  name = 'Hi, my name is -',
}) {
  function clsx(str) {
    return str
  }

  function cva(str, obj) {
    return { str, obj }
  }

  const cornerVariants = cva('', {
    variants: {
      corners: {
        default: 'rounded-none',
        roundedTop: 'rounded-t-lg',
        rounded: 'rounded-lg',
      },
    },
    defaultVariants: {
      corners: 'default',
    },
  })

  const foo = clsx(' ')

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
  )

  return (
    <h1 className={clsx('foo bar baz')}>
      {name}
      Slim Shady
    </h1>
  )
}
