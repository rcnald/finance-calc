import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export interface BoxProps extends ComponentProps<'div'> {}

export function Box({ className, children, ...props }: BoxProps) {
  return (
    <div
      className={cn('rounded-xl border bg-primary/5 p-6 shadow', className)}
      {...props}
    >
      {children}
    </div>
  )
}
