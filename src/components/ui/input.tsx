import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, type, children, ...props }, ref) => {
    const a11yId = React.useId()

    return (
      <label
        htmlFor={id || a11yId}
        className={cn(
          'relative flex h-10 w-full overflow-hidden rounded-md border border-input bg-background px-3 py-2 font-semibold ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:cursor-text has-[span[data-corner="left"]]:pl-12 has-[input[disabled]]:opacity-50',
          className,
        )}
      >
        <input
          type={type}
          ref={ref}
          id={id || a11yId}
          className="appearance-none text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />
        {children}
      </label>
    )
  },
)
Input.displayName = 'Input'

export interface InputUnitProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  corner?: 'right' | 'left'
}

const InputUnit = React.forwardRef<HTMLSpanElement, InputUnitProps>(
  ({ corner = 'right', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-corner={corner}
        className={cn(
          'absolute right-0 top-0 flex h-full items-center justify-center border-l border-input bg-muted px-2 font-medium text-muted-foreground',
          { 'left-0 right-auto border-l-0 border-r': corner === 'left' },
          className,
        )}
        {...props}
      >
        {children}
      </span>
    )
  },
)
InputUnit.displayName = 'InputUnit'

export { Input, InputUnit }
