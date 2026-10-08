import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-line]:stroke-line [&_.recharts-cartesian-axis-tick-line]:stroke-line [&_.recharts-cartesian-grid-horizontal_line]:stroke-line [&_.recharts-cartesian-grid-vertical_line]:stroke-line",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-line bg-surface p-2 shadow-pop text-xs text-ink">
        {label && <p className="font-medium text-ink-2 mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color || "var(--color-brand)" }}
            />
            <span className="text-ink-2">{entry.name}:</span>
            <span className="font-semibold text-ink tabular-nums">
              {new Intl.NumberFormat("vi-VN").format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export { ChartContainer, ChartTooltip }
