import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../firebase'
import { buildOrderItem, formatINR, orderTotals } from '../orders'
import { normalizePhone } from '../utils'
import type { Stay, FoodItem, Service, Order, OrderItem, CartLine, CartSource, OrderTotals } from '../types/firestore'
import Logo from './Logo'
import Spinner from './Spinner'
import ItemCard from './ItemCard'
import CartSheet from './CartSheet'

// Food orders go in as ROOM_SERVICE; add-on services as SERVICE.
const FOOD_TYPE = 'ROOM_SERVICE'
const SERVICE_TYPE = 'SERVICE'

const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
  NEW: { label: 'Received', tone: 'bg-gold-500/15 text-gold-300 ring-gold-500/30' },
  ASSIGNED: { label: 'In progress', tone: 'bg-sky-500/15 text-sky-300 ring-sky-500/30' },
  COMPLETED: { label: 'Delivered', tone: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
}

interface StayAppProps {
  user: User
  stay: Stay
  guestName: string
}

export default function StayApp({ user, stay, guestName }: StayAppProps) {
  // The guest who actually signed in. AccessGuard resolves this across the
  // group booking (the phone may belong to a sibling room); fall back to a
  // local match on this room's guests, then the stay's primary guest name.
  const requesterName =
    guestName ||
    (stay.guests || []).find(
      (g) => normalizePhone(g?.phone) === normalizePhone(user.phoneNumber),
    )?.name ||
    stay.guestName ||
    ''

  const [tab, setTab] = useState<'food' | 'services' | 'orders'>('food')
  const [food, setFood] = useState<FoodItem[] | null>(null)
  const [services, setServices] = useState<Service[] | null>(null)
  const [loadErr, setLoadErr] = useState(false)
  const [foodCategory, setFoodCategory] = useState('All')

  const [cart, setCart] = useState<Record<string, CartLine>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  // Load the hotel's menu + services once on mount (not real-time — items
  // rarely change mid-stay and a one-shot fetch keeps read counts low).
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [fSnap, sSnap] = await Promise.all([
          getDocs(query(collection(db, 'foodItems'), where('hotelId', '==', stay.hotelId))),
          getDocs(query(collection(db, 'services'), where('hotelId', '==', stay.hotelId))),
        ])
        if (!alive) return
        setFood(
          fSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as FoodItem))
            .filter((i) => i.isAvailable !== false),
        )
        setServices(
          sSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as Service))
            .filter((i) => i.isActive !== false),
        )
      } catch (err) {
        console.error('Failed to load menu', err)
        if (alive) setLoadErr(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [stay.hotelId])

  // Live view of this guest's own orders — real-time so status updates
  // (NEW → ASSIGNED → COMPLETED) appear without a manual refresh.
  useEffect(() => {
    const q = query(collection(db, 'orders'), where('userId', '==', stay.userId))
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Order))
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        setOrders(list)
      },
      (err) => console.error('Orders listener error', err),
    )
  }, [stay.userId])

  // Food category chips — categories may be comma-separated on a single doc
  // (e.g. "Breakfast, Veg"), so we split, dedupe, and sort them.
  const foodCategories = useMemo(() => {
    if (!food) return ['All']
    const set = new Set<string>()
    food.forEach((i) =>
      String(i.category || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => set.add(c)),
    )
    return ['All', ...[...set].sort()]
  }, [food])

  const visibleFood = useMemo(() => {
    if (!food) return []
    if (foodCategory === 'All') return food
    return food.filter((i) =>
      String(i.category || '')
        .split(',')
        .map((c) => c.trim())
        .includes(foodCategory),
    )
  }, [food, foodCategory])

  // --- cart helpers ---
  // Cart key format: `${source}:${itemId}` — separating food and service IDs
  // avoids collisions when both collections happen to share a Firestore doc ID.
  const setQty = (source: CartSource, item: FoodItem | Service, qty: number) =>
    setCart((prev) => {
      const key = `${source}:${item.id}`
      const next = { ...prev }
      if (qty <= 0) delete next[key]
      else next[key] = { source, item, qty }
      return next
    })

  const qtyOf = (source: CartSource, id: string) => cart[`${source}:${id}`]?.qty || 0

  const cartLines = Object.values(cart)
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0)
  const cartTotals: OrderTotals = useMemo(
    () => orderTotals(cartLines.map((l) => buildOrderItem(l.item, l.qty))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart],
  )

  // Place the cart as one order per type (food → ROOM_SERVICE, services → SERVICE).
  // Splitting by type lets the kitchen and housekeeping queues filter independently.
  const placeOrder = async () => {
    const groups: { food: CartLine[]; service: CartLine[] } = { food: [], service: [] }
    cartLines.forEach((l) => groups[l.source].push(l))

    const writes: Promise<unknown>[] = []
    const submit = (type: string, lines: CartLine[]) => {
      const items: OrderItem[] = lines.map((l) => buildOrderItem(l.item, l.qty))
      const t = orderTotals(items)
      writes.push(
        addDoc(collection(db, 'orders'), {
          hotelId: stay.hotelId,
          userId: stay.userId,
          guestName: requesterName,
          stayId: stay.id,
          groupStayId: stay.groupStayId || '',
          roomInstanceId: stay.roomInstanceId || '',
          roomNumber: stay.roomNumber || '',
          type,
          items,
          subtotalAmount: t.subtotalAmount,
          totalTaxAmount: t.totalTaxAmount,
          totalAmount: t.totalAmount,
          status: 'NEW',
          assignedTo: '',
          createdAt: serverTimestamp(),
        }),
      )
    }

    if (groups.food.length) submit(FOOD_TYPE, groups.food)
    if (groups.service.length) submit(SERVICE_TYPE, groups.service)
    await Promise.all(writes)
  }

  const onPlaced = () => {
    setCart({})
    setCartOpen(false)
    setTab('orders')
  }

  const tabs: { id: 'food' | 'services' | 'orders'; label: string }[] = [
    { id: 'food', label: 'Food' },
    { id: 'services', label: 'Services' },
    { id: 'orders', label: 'Orders' },
  ]

  return (
    <div className="relative flex min-h-full flex-col bg-forest-950">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]"
      />

      <header className="sticky top-0 z-30 border-b border-cream/10 bg-forest-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
          <Logo className="h-11 w-11 rounded-xl object-contain" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg leading-tight text-cream">Room {stay.roomNumber}</p>
            <p className="truncate text-xs text-cream/50">
              {stay.hotelName || 'Hotel Dreamland'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-full border border-cream/15 px-3 py-1.5 text-xs text-cream/60 transition-colors hover:text-cream"
          >
            Sign out
          </button>
        </div>

        <div className="mx-auto flex max-w-md gap-1 px-5 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-gold-500 text-forest-950'
                  : 'text-cream/60 hover:bg-cream/5 hover:text-cream'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-md flex-1 px-5 pb-32 pt-5">
        {tab === 'food' && (
          <FoodTab
            food={food}
            visibleFood={visibleFood}
            categories={foodCategories}
            category={foodCategory}
            setCategory={setFoodCategory}
            loadErr={loadErr}
            qtyOf={qtyOf}
            setQty={setQty}
          />
        )}

        {tab === 'services' && (
          <ListTab
            heading="Hotel services"
            subheading="Request a service to your room."
            items={services}
            loadErr={loadErr}
            source="service"
            qtyOf={qtyOf}
            setQty={setQty}
            emptyText="No services available right now."
          />
        )}

        {tab === 'orders' && <OrdersTab orders={orders} onBrowse={() => setTab('food')} />}
      </main>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-5">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="animate-fade-up mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-gold-500 px-5 py-4 font-semibold text-forest-950 shadow-2xl shadow-black/40 transition-all hover:bg-gold-400 active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-forest-950/15 px-1.5 text-sm tabular-nums">
                {cartCount}
              </span>
              View cart
            </span>
            <span className="tabular-nums">{formatINR(cartTotals.totalAmount)}</span>
          </button>
        </div>
      )}

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={cartLines}
        setQty={setQty}
        totals={cartTotals}
        roomNumber={stay.roomNumber}
        onPlace={placeOrder}
        onPlaced={onPlaced}
      />
    </div>
  )
}

function Loading() {
  return (
    <div className="flex flex-col items-center py-16 text-cream/60">
      <Spinner className="h-7 w-7 border-gold-400/30 border-t-gold-400" />
      <p className="mt-4 text-sm">Loading…</p>
    </div>
  )
}

interface FoodTabProps {
  food: FoodItem[] | null
  visibleFood: FoodItem[]
  categories: string[]
  category: string
  setCategory: (c: string) => void
  loadErr: boolean
  qtyOf: (source: CartSource, id: string) => number
  setQty: (source: CartSource, item: FoodItem | Service, qty: number) => void
}

function FoodTab({ food, visibleFood, categories, category, setCategory, loadErr, qtyOf, setQty }: FoodTabProps) {
  if (loadErr) return <ErrorState />
  if (food === null) return <Loading />
  if (food.length === 0) return <Empty text="The menu isn't available right now." />

  return (
    <div>
      <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
              category === c
                ? 'bg-gold-500/20 text-gold-200 ring-1 ring-gold-500/40'
                : 'bg-forest-900/50 text-cream/60 hover:text-cream'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {visibleFood.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            qty={qtyOf('food', item.id)}
            onChange={(q) => setQty('food', item, q)}
          />
        ))}
      </div>
    </div>
  )
}

interface ListTabProps {
  heading: string
  subheading: string
  items: Service[] | null
  loadErr: boolean
  source: CartSource
  qtyOf: (source: CartSource, id: string) => number
  setQty: (source: CartSource, item: FoodItem | Service, qty: number) => void
  emptyText: string
}

function ListTab({ heading, subheading, items, loadErr, source, qtyOf, setQty, emptyText }: ListTabProps) {
  if (loadErr) return <ErrorState />
  if (items === null) return <Loading />
  if (items.length === 0) return <Empty text={emptyText} />

  return (
    <div>
      <h2 className="font-display text-2xl text-cream">{heading}</h2>
      <p className="mb-4 mt-1 text-sm text-cream/55">{subheading}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            qty={qtyOf(source, item.id)}
            onChange={(q) => setQty(source, item, q)}
          />
        ))}
      </div>
    </div>
  )
}

function OrdersTab({ orders, onBrowse }: { orders: Order[]; onBrowse: () => void }) {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-2xl">
          🧾
        </div>
        <p className="font-display text-xl text-cream">No orders yet</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-cream/55">
          Your room-service and service requests will appear here.
        </p>
        <button
          type="button"
          onClick={onBrowse}
          className="mt-5 rounded-full border border-gold-500/40 bg-gold-500/10 px-6 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/20"
        >
          Browse the menu
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-cream">Your orders</h2>
      {orders.map((o) => {
        const status = STATUS_LABELS[o.status] ?? STATUS_LABELS['NEW']
        const items = o.items || []
        return (
          <div key={o.id} className="rounded-2xl border border-cream/10 bg-forest-900/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-cream/40">
                  {o.type === 'SERVICE' ? 'Service' : 'Room service'}
                </p>
                <p className="mt-0.5 text-xs text-cream/45">{formatTime(o.createdAt)}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${status.tone}`}
              >
                {status.label}
              </span>
            </div>

            <ul className="mt-3 space-y-2 border-t border-cream/10 pt-3">
              {items.map((i, idx) => {
                const base = i.basePrice ?? i.price ?? 0
                const lineTotal = i.total ?? base * i.quantity
                return (
                  <li key={i.itemId || idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-cream/90">
                        {i.name} <span className="text-cream/50">×{i.quantity}</span>
                      </p>
                      <p className="text-[11px] text-cream/45">
                        {formatINR(base)} each
                        {(i.taxPercentage ?? 0) > 0 ? ` · +${i.taxPercentage}% tax` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-cream/85">
                      {formatINR(lineTotal)}
                    </span>
                  </li>
                )
              })}
            </ul>

            <dl className="mt-3 space-y-1 border-t border-cream/10 pt-3 text-sm">
              <div className="flex justify-between text-cream/55">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatINR(o.subtotalAmount)}</dd>
              </div>
              <div className="flex justify-between text-cream/55">
                <dt>Tax</dt>
                <dd className="tabular-nums">{formatINR(o.totalTaxAmount)}</dd>
              </div>
              <div className="flex justify-between pt-0.5 font-semibold text-cream">
                <dt>Total</dt>
                <dd className="tabular-nums text-gold-300">{formatINR(o.totalAmount)}</dd>
              </div>
            </dl>
          </div>
        )
      })}
    </div>
  )
}

function formatTime(ts: Order['createdAt']): string {
  const ms = ts?.toMillis?.()
  if (!ms) return 'Just now'
  return new Date(ms).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function Empty({ text }: { text: string }) {
  return <p className="py-12 text-center text-sm text-cream/55">{text}</p>
}

function ErrorState() {
  return (
    <p className="py-12 text-center text-sm text-red-300">
      We couldn&apos;t load this just now. Please check your connection and try again.
    </p>
  )
}
