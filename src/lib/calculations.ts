import type { Discount, Gst, LineItem, Totals } from '../types/invoice'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function lineAmount(item: LineItem): number {
  return round2(item.rate * item.quantity)
}

export function computeTotals(
  items: LineItem[],
  discount: Discount,
  gst: Gst,
): Totals {
  const subtotal = round2(items.reduce((sum, i) => sum + lineAmount(i), 0))

  const rawDiscount =
    discount.type === 'percent'
      ? (subtotal * discount.value) / 100
      : discount.value
  const discountAmount = round2(Math.min(Math.max(rawDiscount, 0), subtotal))

  const taxable = round2(subtotal - discountAmount)

  let cgst = 0
  let sgst = 0
  let igst = 0
  if (gst.mode === 'intra') {
    const half = round2((taxable * gst.rate) / 200)
    cgst = half
    sgst = half
  } else if (gst.mode === 'inter') {
    igst = round2((taxable * gst.rate) / 100)
  }

  const total = round2(taxable + cgst + sgst + igst)
  return { subtotal, discountAmount, taxable, cgst, sgst, igst, total }
}

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatINR(n: number): string {
  return INR.format(n)
}
