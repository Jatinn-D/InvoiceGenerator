import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = '', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink placeholder:text-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 ${className}`}
      {...rest}
    />
  )
})
