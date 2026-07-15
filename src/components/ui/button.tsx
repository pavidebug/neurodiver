import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { buttonPrimary } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

const buttonVariants = cva(buttonPrimary, {
  variants: {
    variant: {
      default:
        'bg-gradient-to-r from-green to-green-soft text-white shadow-[0_4px_14px_rgba(45,90,61,0.18)] hover:brightness-105 hover:shadow-[0_6px_18px_rgba(45,90,61,0.24)]',
      secondary:
        'border border-orange/10 bg-gradient-to-r from-yellow to-yellow-soft text-text shadow-sm hover:brightness-105',
      outline:
        'border-2 border-green bg-transparent text-green hover:bg-green-muted',
      ghost: 'bg-transparent text-green hover:bg-green-muted',
      orange:
        'bg-orange text-white hover:bg-orange-soft shadow-sm hover:shadow-md',
    },
    size: {
      default: 'min-h-[3.25rem] px-5 py-4 lg:min-h-12 lg:px-7',
      lg: 'min-h-14 px-8 text-lg',
      sm: 'min-h-10 px-4 py-2 text-sm',
      icon: 'min-h-11 min-w-11 rounded-full px-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
