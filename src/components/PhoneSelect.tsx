import { useState } from 'react'
import type { CheckInOption } from '../types/firestore'
import Card from './Card'
import Spinner from './Spinner'

interface PhoneSelectProps {
  guests: CheckInOption[]
  onSelect: (guest: CheckInOption) => void
  sending: boolean
  error: string
}

export default function PhoneSelect({ guests, onSelect, sending, error }: PhoneSelectProps) {
  const [selected, setSelected] = useState<CheckInOption | null>(null)

  return (
    <Card>
      <div className="text-center">
        <p className="font-display text-sm tracking-[0.3em] text-gold-400 uppercase">Welcome</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-cream">
          Verify your stay
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
          Please select the mobile number registered at reception. We&apos;ll send a one-time
          code to confirm it&apos;s you.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {guests.map((g) => {
          const isSelected = selected?.token === g.token
          return (
            <button
              key={g.token}
              type="button"
              disabled={sending}
              onClick={() => setSelected(g)}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all ${
                isSelected
                  ? 'border-gold-400 bg-gold-500/10 ring-1 ring-gold-400/40'
                  : 'border-cream/10 bg-forest-800/40 hover:border-gold-500/40 hover:bg-forest-800/70'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                  isSelected ? 'bg-gold-500 text-forest-950' : 'bg-forest-700 text-gold-300'
                }`}
              >
                {g.name ? g.name.trim().charAt(0).toUpperCase() : '☎'}
              </span>
              <span className="min-w-0 flex-1">
                {g.name && (
                  <span className="block truncate text-sm font-medium text-cream">{g.name}</span>
                )}
                <span className="block font-mono text-base tracking-wide text-cream/85">
                  {g.maskedPhone}
                </span>
              </span>
              <span
                className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                  isSelected ? 'border-gold-400 bg-gold-400' : 'border-cream/30'
                }`}
              />
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}

      <button
        type="button"
        disabled={!selected || sending}
        onClick={() => selected && onSelect(selected)}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-500 px-6 py-4 font-semibold text-forest-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? (
          <>
            <Spinner /> Sending code…
          </>
        ) : (
          'Send verification code'
        )}
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-cream/40">
        Not seeing your number? Please contact the front desk for assistance.
      </p>
    </Card>
  )
}
