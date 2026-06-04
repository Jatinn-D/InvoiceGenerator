import type { Client, Invoice, Seller } from '../types/invoice'
import { SUVARNA_SELLER } from '../data/suvarnaDefaults'

const KEYS = {
  seller: 'suvarna.invoice.seller',
  clients: 'suvarna.invoice.clients',
  counter: 'suvarna.invoice.counter',
  draft: 'suvarna.invoice.draft',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadSeller(): Seller {
  return read<Seller>(KEYS.seller, SUVARNA_SELLER)
}

export function saveSeller(seller: Seller): void {
  write(KEYS.seller, seller)
}

export function loadClients(): Client[] {
  return read<Client[]>(KEYS.clients, [])
}

export function saveClients(clients: Client[]): void {
  write(KEYS.clients, clients)
}

export function upsertClient(client: Client): Client[] {
  const clients = loadClients()
  const idx = clients.findIndex((c) => c.id === client.id)
  if (idx >= 0) clients[idx] = client
  else clients.push(client)
  saveClients(clients)
  return clients
}

export function deleteClient(id: string): Client[] {
  const clients = loadClients().filter((c) => c.id !== id)
  saveClients(clients)
  return clients
}

export function loadDraft(): Invoice | null {
  return read<Invoice | null>(KEYS.draft, null)
}

export function saveDraft(invoice: Invoice): void {
  write(KEYS.draft, invoice)
}

export type Counter = { year: number; seq: number }

export function loadCounter(): Counter {
  const year = new Date().getFullYear()
  return read<Counter>(KEYS.counter, { year, seq: 0 })
}

export function bumpCounter(): Counter {
  const year = new Date().getFullYear()
  const current = loadCounter()
  const next: Counter =
    current.year === year ? { year, seq: current.seq + 1 } : { year, seq: 1 }
  write(KEYS.counter, next)
  return next
}
