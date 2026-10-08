import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium transition-colors focus:outline-none leading-none h-5",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-white",
        secondary:
          "bg-page text-ink-2 border border-line",
        destructive:
          "bg-bad-soft text-bad border border-bad/20",
        bad:
          "bg-bad-soft text-bad border border-bad/20",
        ok:
          "bg-ok-soft text-ok border border-ok/20",
        warn:
          "bg-warn-soft text-warn border border-warn/20",
        info:
          "bg-info-soft text-info border border-info/20",
        neutral:
          "bg-page text-ink-2 border border-line",
        outline:
          "border border-line text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
