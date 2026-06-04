import { Plus, Save } from 'lucide-react'
import type { Client, Invoice, ItemCategory, LineItem } from '../types/invoice'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'
import { LineItemRow } from './LineItemRow'
import { ClientPicker } from './ClientPicker'
import { QUICK_ADD_ITEMS } from '../data/suvarnaDefaults'

type Props = {
  invoice: Invoice
  clients: Client[]
  selectedClientId: string | null
  onInvoiceChange: (next: Invoice) => void
  onClientSelect: (client: Client | null) => void
  onClientSave: () => void
  onClientDelete: (id: string) => void
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function Section({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-line bg-paper p-5">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">{title}</h3>
        {action}
      </header>
      {children}
    </section>
  )
}

type ItemSeed = {
  description?: string
  detail?: string
  category?: ItemCategory
  rate?: number
  quantity?: number
}

export function InvoiceForm({
  invoice,
  clients,
  selectedClientId,
  onInvoiceChange,
  onClientSelect,
  onClientSave,
  onClientDelete,
}: Props) {
  function patch(partial: Partial<Invoice>) {
    onInvoiceChange({ ...invoice, ...partial })
  }
  function patchClient(partial: Partial<Client>) {
    onInvoiceChange({ ...invoice, client: { ...invoice.client, ...partial } })
  }
  function updateItem(next: LineItem) {
    patch({ items: invoice.items.map((i) => (i.id === next.id ? next : i)) })
  }
  function removeItem(id: string) {
    patch({ items: invoice.items.filter((i) => i.id !== id) })
  }
  function addItem(seed?: ItemSeed) {
    const item: LineItem = {
      id: newId(),
      description: seed?.description ?? '',
      detail: seed?.detail ?? '',
      category: seed?.category,
      rate: seed?.rate ?? 0,
      quantity: seed?.quantity ?? 1,
    }
    patch({ items: [...invoice.items, item] })
  }

  return (
    <div className="space-y-5">
      <Section title="Invoice meta">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label htmlFor="num">Invoice number</Label>
            <Input
              id="num"
              value={invoice.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="period">Billing period</Label>
            <Input
              id="period"
              placeholder="Oct 2025"
              value={invoice.billingPeriod ?? ''}
              onChange={(e) => patch({ billingPeriod: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="issued">Issue date</Label>
            <Input
              id="issued"
              type="date"
              value={invoice.issueDate}
              onChange={(e) => patch({ issueDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="due">Due date</Label>
            <Input
              id="due"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => patch({ dueDate: e.target.value })}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Billed to"
        action={
          <Button size="sm" variant="secondary" onClick={onClientSave}>
            <Save size={14} />
            {selectedClientId ? 'Update client' : 'Save client'}
          </Button>
        }
      >
        <div className="mb-4">
          <Label>Saved clients</Label>
          <ClientPicker
            clients={clients}
            currentId={selectedClientId}
            onSelect={onClientSelect}
            onDelete={onClientDelete}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={invoice.client.name}
              onChange={(e) => patchClient({ name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="c-company">Shop / company</Label>
            <Input
              id="c-company"
              value={invoice.client.company ?? ''}
              onChange={(e) => patchClient({ company: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="c-addr">Address</Label>
            <Textarea
              id="c-addr"
              rows={2}
              value={invoice.client.address}
              onChange={(e) => patchClient({ address: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              value={invoice.client.email ?? ''}
              onChange={(e) => patchClient({ email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="c-phone">Phone</Label>
            <Input
              id="c-phone"
              value={invoice.client.phone ?? ''}
              onChange={(e) => patchClient({ phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="c-gstin">GSTIN (optional)</Label>
            <Input
              id="c-gstin"
              value={invoice.client.gstin ?? ''}
              onChange={(e) => patchClient({ gstin: e.target.value })}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Items"
        action={
          <Button size="sm" onClick={() => addItem()}>
            <Plus size={14} />
            Add item
          </Button>
        }
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.12em] text-soft">
            Quick add:
          </span>
          {QUICK_ADD_ITEMS.map((q) => (
            <button
              key={q.description}
              onClick={() => addItem(q)}
              className="rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink hover:border-accent hover:bg-paper"
            >
              + {q.description}
            </button>
          ))}
        </div>

        {invoice.items.length === 0 ? (
          <p className="rounded-md border border-dashed border-line bg-bg p-6 text-center text-sm text-soft">
            No items yet. Use the quick-add chips above or click "Add item".
          </p>
        ) : (
          <div className="space-y-2">
            {invoice.items.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                onChange={updateItem}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Discount">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="d-type">Type</Label>
            <Select
              id="d-type"
              value={invoice.discount.type}
              onChange={(e) =>
                patch({
                  discount: {
                    ...invoice.discount,
                    type: e.target.value as 'flat' | 'percent',
                  },
                })
              }
            >
              <option value="flat">Flat (₹)</option>
              <option value="percent">Percentage (%)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="d-value">Value</Label>
            <Input
              id="d-value"
              type="number"
              min={0}
              step={0.01}
              value={invoice.discount.value}
              onChange={(e) =>
                patch({
                  discount: {
                    ...invoice.discount,
                    value: Number(e.target.value) || 0,
                  },
                })
              }
            />
          </div>
        </div>
      </Section>

      <Section title="GST">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="g-mode">Mode</Label>
            <Select
              id="g-mode"
              value={invoice.gst.mode}
              onChange={(e) =>
                patch({
                  gst: {
                    ...invoice.gst,
                    mode: e.target.value as 'none' | 'intra' | 'inter',
                  },
                })
              }
            >
              <option value="none">None</option>
              <option value="intra">Intra-state (CGST + SGST)</option>
              <option value="inter">Inter-state (IGST)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="g-rate">Rate (%)</Label>
            <Input
              id="g-rate"
              type="number"
              min={0}
              step={0.01}
              disabled={invoice.gst.mode === 'none'}
              value={invoice.gst.rate}
              onChange={(e) =>
                patch({
                  gst: { ...invoice.gst, rate: Number(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>
      </Section>

      <Section title="Notes & terms">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={invoice.notes ?? ''}
              onChange={(e) => patch({ notes: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="terms">Terms</Label>
            <Textarea
              id="terms"
              rows={2}
              value={invoice.terms ?? ''}
              onChange={(e) => patch({ terms: e.target.value })}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
