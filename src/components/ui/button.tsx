import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange min-h-12 px-6 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-green text-white hover:bg-green-soft shadow-sm hover:shadow-md',
        secondary:
          'bg-yellow text-text hover:bg-yellow-soft border border-border',
        outline:
          'border-2 border-green bg-transparent text-green hover:bg-green-muted',
        ghost: 'bg-transparent text-green hover:bg-green-muted',
        orange:
          'bg-orange text-white hover:bg-orange-soft shadow-sm hover:shadow-md',
      },
      size: {
        default: 'h-12 px-6',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-12 w-12 rounded-xl px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

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
