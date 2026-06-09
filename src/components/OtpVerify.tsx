import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import Spinner from './Spinner'

const OTP_LENGTH = 6

interface OtpVerifyProps {
  maskedPhone: string
  onConfirm: (code: string) => void
  onBack: () => void
  verifying: boolean
  error: string
}

export default function OtpVerify({ maskedPhone, onConfirm, onBack, verifying, error }: OtpVerifyProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const code = digits.join('')

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '')
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)))
      return
    }
    setDigits((prev) => {
      const next = [...prev]
      const chars = clean.split('')
      let i = index
      for (const ch of chars) {
        if (i >= OTP_LENGTH) break
        next[i] = ch
        i += 1
      }
      const focusAt = Math.min(i, OTP_LENGTH - 1)
      requestAnimationFrame(() => inputsRef.current[focusAt]?.focus())
      return next
    })
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === OTP_LENGTH) onConfirm(code)
  }

  return (
    <Card>
      <form onSubmit={submit} className="text-center">
        <p className="font-display text-sm tracking-[0.3em] text-gold-400 uppercase">Almost there</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream">Enter the code</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
          We sent a 6-digit verification code to{' '}
          <span className="whitespace-nowrap font-mono text-cream">{maskedPhone}</span>
        </p>

        <div className="mt-7 flex justify-center gap-2 sm:gap-3" dir="ltr">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el }}
              type="tel"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={OTP_LENGTH}
              value={d}
              disabled={verifying}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className="h-14 w-11 rounded-xl border border-cream/15 bg-forest-800/60 text-center font-mono text-xl text-cream caret-gold-400 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 disabled:opacity-50 sm:h-16 sm:w-12"
            />
          ))}
        </div>

        {error && <p className="mt-5 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={code.length !== OTP_LENGTH || verifying}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-500 px-6 py-4 font-semibold text-forest-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {verifying ? (
            <>
              <Spinner /> Verifying…
            </>
          ) : (
            'Verify & continue'
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={verifying}
          className="mt-4 text-sm text-cream/50 underline-offset-4 transition-colors hover:text-gold-300 hover:underline disabled:opacity-40"
        >
          Use a different number
        </button>
      </form>
    </Card>
  )
}
