import { LabelHTMLAttributes } from 'react'

export function Label({
  className = '',
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-soft ${className}`}
      {...rest}
    />
  )
}
