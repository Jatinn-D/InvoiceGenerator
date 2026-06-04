import { SelectHTMLAttributes, forwardRef } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className = '', children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
})
