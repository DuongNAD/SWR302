import React from 'react'

export interface StatItem {
  id: string
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down' | 'neutral' | 'warn'
}

interface StatStripProps {
  stats: StatItem[]
  className?: string
}

export const StatStrip: React.FC<StatStripProps> = ({ stats, className = '' }) => {
  return (
    <div
      className={`border border-line rounded-lg bg-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line shadow-xs overflow-hidden ${className}`}
    >
      {stats.map((item) => {
        const trendClass =
          item.trend === 'up'
            ? 'text-ok'
            : item.trend === 'warn'
            ? 'text-warn'
            : item.trend === 'down'
            ? 'text-danger'
            : 'text-ink-3'

        return (
          <div key={item.id} className="p-4 sm:p-5 space-y-1">
            <span className="text-[13px] font-medium text-ink-2 block">
              {item.label}
            </span>
            <div className="text-2xl font-semibold text-ink tabular-nums tracking-tight">
              {item.value}
            </div>
            {item.subtext && (
              <p className={`text-xs ${trendClass} leading-tight`}>
                {item.subtext}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
