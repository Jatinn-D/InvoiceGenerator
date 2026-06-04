import { TextareaHTMLAttributes, forwardRef } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className = '', ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`min-h-[80px] w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 ${className}`}
      {...rest}
    />
  )
})
