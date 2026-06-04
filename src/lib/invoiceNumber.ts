import { loadCounter, bumpCounter } from './storage'

function pad(n: number, width = 4): string {
  return n.toString().padStart(width, '0')
}

export function previewNextInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const current = loadCounter()
  const seq = current.year === year ? current.seq + 1 : 1
  return `INV-${year}-${pad(seq)}`
}

export function commitNextInvoiceNumber(): string {
  const next = bumpCounter()
  return `INV-${next.year}-${pad(next.seq)}`
}
