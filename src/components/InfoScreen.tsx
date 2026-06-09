import type { ReactNode } from 'react'
import Card from './Card'

type InfoTone = 'neutral' | 'error' | 'success'

interface InfoScreenProps {
  icon: string
  title: string
  message: string
  tone?: InfoTone
  children?: ReactNode
}

// A simple, friendly status card used for empty / error / blocked states.
// Pass `children` to render an action button below the message.
export default function InfoScreen({ icon, title, message, tone = 'neutral', children }: InfoScreenProps) {
  const ring: Record<InfoTone, string> = {
    neutral: 'bg-gold-500/15 text-gold-300 ring-gold-500/30',
    error: 'bg-red-500/15 text-red-300 ring-red-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  }

  return (
    <Card className="text-center">
      <div
        className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl ring-1 ${ring[tone]}`}
      >
        {icon}
      </div>
      <h1 className="font-display text-3xl font-semibold text-cream">{title}</h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </Card>
  )
}
