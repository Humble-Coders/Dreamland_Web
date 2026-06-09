import { useEffect, useState } from 'react'
import type { CartLine, CartSource, FoodItem, Service, OrderTotals } from '../types/firestore'
import { formatINR, unitPrice } from '../orders'
import Spinner from './Spinner'

interface CartSheetProps {
  open: boolean
  onClose: () => void
  lines: CartLine[]
  setQty: (source: CartSource, item: FoodItem | Service, qty: number) => void
  totals: OrderTotals
  roomNumber: string
  onPlace: () => Promise<void>
  onPlaced: () => void
}

// Bottom-sheet cart: review → confirm → place. Drives a small internal step
// machine so the confirmation and result share one surface.
type CartStep = 'cart' | 'confirm' | 'placing' | 'error'

export default function CartSheet({ open, onClose, lines, setQty, totals, roomNumber, onPlace, onPlaced }: CartSheetProps) {
  const [step, setStep] = useState<CartStep>('cart')
  const [errorMsg, setErrorMsg] = useState('')

  // Reset to the cart view whenever the sheet is (re)opened.
  useEffect(() => {
    if (open) {
      setStep('cart')
      setErrorMsg('')
    }
  }, [open])

  if (!open) return null

  const empty = lines.length === 0

  const handlePlace = async () => {
    setStep('placing')
    try {
      await onPlace()
      onPlaced()
    } catch (err) {
      console.error('Failed to place order', err)
      // permission-denied most likely means the stay went inactive between
      // opening the cart and tapping confirm — surface a specific message.
      const code = (err as { code?: string })?.code
      setErrorMsg(
        code === 'permission-denied'
          ? "We couldn't place this order against your stay. Please contact the front desk."
          : 'Something went wrong placing your order. Please try again.',
      )
      setStep('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop — disabled while the order write is in flight to prevent accidental close. */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 'placing' ? undefined : onClose}
      />

      <div className="animate-fade-up relative z-10 flex max-h-[88vh] w-full max-w-md flex-col rounded-t-3xl border border-gold-500/25 bg-forest-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-cream/10 px-6 py-4">
          <h2 className="font-display text-2xl text-cream">
            {step === 'confirm' ? 'Confirm order' : 'Your cart'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={step === 'placing'}
            className="text-cream/50 transition-colors hover:text-cream disabled:opacity-40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {empty ? (
            <p className="py-10 text-center text-sm text-cream/60">
              Your cart is empty. Add a few items to get started.
            </p>
          ) : step === 'error' ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-2xl text-red-300 ring-1 ring-red-500/30">
                ⚠️
              </div>
              <p className="text-sm text-cream/80">{errorMsg}</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream/10">
              {lines.map((l) => (
                <li key={`${l.source}:${l.item.id}`} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cream">{l.item.name}</p>
                    <p className="text-xs text-cream/50">
                      {formatINR(unitPrice(l.item))} × {l.qty}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-cream/90">
                    {formatINR(unitPrice(l.item) * l.qty)}
                  </span>
                  {step === 'cart' && (
                    <div className="ml-2 flex items-center gap-2 rounded-full border border-cream/15 px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => setQty(l.source, l.item, l.qty - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="min-w-4 text-center text-sm tabular-nums text-cream">
                        {l.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(l.source, l.item, l.qty + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {!empty && step !== 'error' && (
          <div className="border-t border-cream/10 px-6 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-cream/60">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatINR(totals.subtotalAmount)}</dd>
              </div>
              <div className="flex justify-between text-cream/60">
                <dt>Tax</dt>
                <dd className="tabular-nums">{formatINR(totals.totalTaxAmount)}</dd>
              </div>
              <div className="flex justify-between border-t border-cream/10 pt-2 text-base font-semibold text-cream">
                <dt>Total</dt>
                <dd className="tabular-nums text-gold-300">{formatINR(totals.totalAmount)}</dd>
              </div>
            </dl>

            {step === 'confirm' && (
              <p className="mt-4 rounded-xl bg-forest-800/60 px-4 py-3 text-center text-xs leading-relaxed text-cream/70">
                This order will be delivered to{' '}
                <span className="font-semibold text-cream">Room {roomNumber}</span> and added to
                your room bill.
              </p>
            )}

            {step === 'cart' && (
              <button
                type="button"
                onClick={() => setStep('confirm')}
                className="mt-4 w-full rounded-2xl bg-gold-500 px-6 py-4 font-semibold text-forest-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 active:scale-[0.99]"
              >
                Review &amp; place order
              </button>
            )}

            {step === 'confirm' && (
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="flex-1 rounded-2xl border border-cream/15 px-6 py-4 font-medium text-cream/80 transition-colors hover:bg-cream/5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlace}
                  className="flex-1 rounded-2xl bg-gold-500 px-6 py-4 font-semibold text-forest-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 active:scale-[0.99]"
                >
                  Confirm order
                </button>
              </div>
            )}

            {step === 'placing' && (
              <button
                type="button"
                disabled
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-500/70 px-6 py-4 font-semibold text-forest-950"
              >
                <Spinner /> Placing your order…
              </button>
            )}
          </div>
        )}

        {step === 'error' && (
          <div className="border-t border-cream/10 px-6 py-4">
            <button
              type="button"
              onClick={() => setStep('cart')}
              className="w-full rounded-2xl bg-gold-500 px-6 py-4 font-semibold text-forest-950 transition-all hover:bg-gold-400"
            >
              Back to cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
