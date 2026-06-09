// Money + order-item math, matching the `orders` schema (OrderItem fields and
// the per-order subtotal/tax/total aggregates).
import type { FoodItem, Service, OrderItem, OrderTotals } from './types/firestore'

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatINR = (n: number): string => inr.format(Number(n) || 0)

// Build a single OrderItem from a source foodItems/services doc + quantity.
// taxedPrice = basePrice × (1 + taxPercentage/100); line tax derived from the
// rounded totals so the per-order aggregates always reconcile.
export function buildOrderItem(src: FoodItem | Service, quantity: number): OrderItem {
  const basePrice = Number(src.price) || 0
  const taxPercentage = Number(src.taxPercentage) || 0
  const taxedPrice = round2(basePrice * (1 + taxPercentage / 100))
  const subtotal = round2(basePrice * quantity)
  const total = round2(taxedPrice * quantity)
  const taxAmount = round2(total - subtotal)
  return {
    itemId: src.id,
    name: src.name,
    quantity,
    basePrice,
    taxPercentage,
    taxedPrice,
    taxAmount,
    subtotal,
    total,
  }
}

// Aggregate the per-order monetary fields from a list of OrderItems.
export function orderTotals(items: OrderItem[]): OrderTotals {
  const subtotalAmount = round2(items.reduce((s, i) => s + i.subtotal, 0))
  const totalTaxAmount = round2(items.reduce((s, i) => s + i.taxAmount, 0))
  const totalAmount = round2(items.reduce((s, i) => s + i.total, 0))
  return { subtotalAmount, totalTaxAmount, totalAmount }
}

// Per-unit, tax-inclusive price for menu display.
export const unitPrice = (src: FoodItem | Service): number =>
  round2((Number(src.price) || 0) * (1 + (Number(src.taxPercentage) || 0) / 100))
