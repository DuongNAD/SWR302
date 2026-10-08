import React from 'react'
import { LucideIcon, PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto',
        className
      )}
    >
      <Icon className="h-8 w-8 text-ink-3 mb-3 stroke-[1.5]" />
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-2 mb-5 max-w-sm">{description}</p>
      )}
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
          >
            {action.label}
          </a>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}
