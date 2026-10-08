import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  title: string
  description?: string
}

export interface StepperProps {
  steps: (string | StepItem)[]
  currentStep: number // 1-indexed
  onStepClick?: (step: number) => void
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1
        const isDone = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const title = typeof step === 'string' ? step : step.title
        const isClickable = onStepClick && stepNum < currentStep

        return (
          <React.Fragment key={idx}>
            <div
              className={cn(
                'flex items-center gap-2.5',
                isClickable && 'cursor-pointer group'
              )}
              onClick={() => isClickable && onStepClick(stepNum)}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isDone && 'bg-ok text-white',
                  isCurrent && 'bg-brand text-white',
                  !isDone && !isCurrent && 'border border-line-strong text-ink-3 bg-surface'
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : stepNum}
              </div>

              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCurrent && 'text-ink font-semibold',
                  isDone && 'text-ink-2 group-hover:text-ink',
                  !isDone && !isCurrent && 'text-ink-3'
                )}
              >
                {title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-[1px] mx-3 transition-colors',
                  idx + 1 < currentStep ? 'bg-ok' : 'bg-line'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
