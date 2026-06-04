import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Download, Printer, Settings as SettingsIcon } from 'lucide-react'
import { Button } from './components/ui/Button'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoicePreview } from './components/InvoicePreview'
import { SellerSettingsDrawer } from './components/SellerSettingsDrawer'
import { computeTotals } from './lib/calculations'
import {
  commitNextInvoiceNumber,
  previewNextInvoiceNumber,
} from './lib/invoiceNumber'
import { downloadInvoiceAsPdf } from './lib/pdf'
import {
  deleteClient as removeClient,
  loadClients,
  loadDraft,
  loadSeller,
  saveDraft,
  saveSeller,
  upsertClient,
} from './lib/storage'
import { DEFAULT_NOTES, DEFAULT_TERMS } from './data/suvarnaDefaults'
import type { Client, Invoice, Seller } from './types/invoice'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function makeEmptyClient(): Client {
  return {
    id: newId(),
    name: '',
    company: '',
    address: '',
    email: '',
    phone: '',
    gstin: '',
  }
}

const A4_WIDTH_PX = 794 // 210mm at 96dpi

function useFitToWidth(targetWidthPx: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const available = el.clientWidth
      if (available <= 0) return
      setScale(Math.min(1, available / targetWidthPx))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [targetWidthPx])
  return { containerRef, scale }
}

function buildInitialInvoice(seller: Seller): Invoice {
  const issue = today()
  return {
    number: previewNextInvoiceNumber(),
    issueDate: issue,
    dueDate: plusDays(issue, 30),
    seller,
    client: makeEmptyClient(),
    items: [],
    discount: { type: 'flat', value: 0 },
    gst: { mode: 'none', rate: 18 },
    notes: DEFAULT_NOTES,
    terms: DEFAULT_TERMS,
  }
}

export default function App() {
  const [seller, setSeller] = useState<Seller>(() => loadSeller())
  const [clients, setClients] = useState<Client[]>(() => loadClients())
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const savedSeller = loadSeller()
    const draft = loadDraft()
    if (draft) return { ...draft, seller: savedSeller }
    return buildInitialInvoice(savedSeller)
  })
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewHeight, setPreviewHeight] = useState<number | null>(null)
  const { containerRef: fitRef, scale } = useFitToWidth(A4_WIDTH_PX)

  useLayoutEffect(() => {
    const el = previewRef.current
    if (!el) return
    const update = () => setPreviewHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const totals = useMemo(
    () => computeTotals(invoice.items, invoice.discount, invoice.gst),
    [invoice.items, invoice.discount, invoice.gst],
  )

  useEffect(() => {
    setInvoice((inv) => ({ ...inv, seller }))
  }, [seller])

  useEffect(() => {
    saveDraft(invoice)
  }, [invoice])

  function handleSellerSave(next: Seller) {
    setSeller(next)
    saveSeller(next)
  }

  function handleClientSelect(c: Client | null) {
    if (!c) {
      setSelectedClientId(null)
      setInvoice((inv) => ({ ...inv, client: makeEmptyClient() }))
      return
    }
    setSelectedClientId(c.id)
    setInvoice((inv) => ({ ...inv, client: { ...c } }))
  }

  function handleClientSave() {
    if (!invoice.client.name.trim()) {
      alert('Enter a client name before saving.')
      return
    }
    const id = selectedClientId ?? invoice.client.id ?? newId()
    const toSave: Client = { ...invoice.client, id }
    const next = upsertClient(toSave)
    setClients(next)
    setSelectedClientId(id)
    setInvoice((inv) => ({ ...inv, client: { ...toSave } }))
  }

  function handleClientDelete(id: string) {
    const next = removeClient(id)
    setClients(next)
    if (selectedClientId === id) {
      setSelectedClientId(null)
      setInvoice((inv) => ({ ...inv, client: makeEmptyClient() }))
    }
  }

  async function handleDownload() {
    if (invoice.items.length === 0) {
      alert('Add at least one line item before downloading.')
      return
    }
    if (!invoice.client.name.trim()) {
      alert('Enter a client name before downloading.')
      return
    }
    const node = previewRef.current
    if (!node) return
    setDownloading(true)
    try {
      const numberForFile = invoice.number
      await downloadInvoiceAsPdf(node, `Invoice-${numberForFile}.pdf`)
      commitNextInvoiceNumber()
      setInvoice((inv) => ({ ...inv, number: previewNextInvoiceNumber() }))
    } catch (err) {
      console.error(err)
      alert('Could not generate PDF. See console for details.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3">
          <div>
            <div className="font-serif text-xl font-semibold leading-none tracking-[-0.01em] text-ink">
              {seller.name} <span className="text-soft">· Invoice Generator</span>
            </div>
            <div className="mt-1 hidden text-[11px] uppercase tracking-[0.12em] text-soft sm:block">
              {seller.tagline ?? 'Pawn Shop Management System'}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              aria-label="Business details"
            >
              <SettingsIcon size={16} />
              <span className="hidden sm:inline">Business details</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              aria-label="Print"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">
                {downloading ? 'Generating…' : 'Download PDF'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          <div className="no-print">
            <InvoiceForm
              invoice={invoice}
              clients={clients}
              selectedClientId={selectedClientId}
              onInvoiceChange={setInvoice}
              onClientSelect={handleClientSelect}
              onClientSave={handleClientSave}
              onClientDelete={handleClientDelete}
            />
          </div>
          <div
            ref={fitRef}
            className="preview-fit-col flex justify-center lg:justify-start"
          >
            <div
              className="preview-sizer"
              style={{
                width: A4_WIDTH_PX * scale,
                height:
                  previewHeight !== null ? previewHeight * scale : undefined,
                overflow: 'hidden',
              }}
            >
              <div
                className="preview-scaler"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: A4_WIDTH_PX,
                }}
              >
                <InvoicePreview
                  ref={previewRef}
                  invoice={invoice}
                  totals={totals}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerSettingsDrawer
        open={settingsOpen}
        seller={seller}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSellerSave}
      />
    </div>
  )
}
