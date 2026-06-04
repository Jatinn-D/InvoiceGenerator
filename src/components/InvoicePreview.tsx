import { forwardRef } from 'react'
import type { Invoice, Totals } from '../types/invoice'
import { formatINR, lineAmount } from '../lib/calculations'
import { amountInWords } from '../lib/numberToWords'
import { CATEGORY_LABEL } from '../data/suvarnaDefaults'

type Props = {
  invoice: Invoice
  totals: Totals
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(
  function InvoicePreview({ invoice, totals }, ref) {
    const { seller, client, items, gst, discount, billingPeriod } = invoice
    const showGstSplit = gst.mode === 'intra'
    const showIgst = gst.mode === 'inter'
    const showAnyGst = gst.mode !== 'none'

    const hasPaymentInfo = Boolean(
      seller.upiId || seller.bankName || seller.accountNumber || seller.ifsc,
    )

    return (
      <div ref={ref} className="a4-sheet mx-auto text-ink">
        <div
          className="flex flex-col"
          style={{ minHeight: '297mm', padding: '48px 56px 44px' }}
        >
          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-line pb-5">
            <div>
              <h1 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                {seller.name}
              </h1>
              {seller.tagline && (
                <div className="mt-0.5 text-md text-medium">{seller.tagline}</div>
              )}
              <div className="mt-0.5 space-y-0.5 text-[13px] leading-[1.7] text-soft">
                {seller.address && (
                  <div className="whitespace-pre-line">{seller.address}</div>
                )}
                {(seller.email || seller.phone) && (
                  <div>
                    {seller.email}
                    {seller.email && seller.phone && (
                      <span className="mx-1.5">·</span>
                    )}
                    {seller.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif text-[34px] font-normal leading-none tracking-[0.02em] text-accent">
                Invoice
              </div>
              <div className="mt-1 text-sm tracking-[0.03em] text-soft">
                {invoice.number}
              </div>
            </div>
          </div>

          {/* INFO ROW */}
          <div className="mt-7 flex justify-between gap-8">
            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
                Billed To
              </div>
              <div className="text-[17px] font-medium text-ink">
                {client.name || 'Client name'}
              </div>
              {client.company && (
                <div className="mt-0.5 text-sm text-soft">{client.company}</div>
              )}
              {client.address && (
                <div className="mt-0.5 whitespace-pre-line text-sm text-soft">
                  {client.address}
                </div>
              )}
              {client.phone && (
                <div className="mt-0.5 text-sm text-soft">{client.phone}</div>
              )}
              {client.email && (
                <div className="mt-0.5 text-sm text-soft">{client.email}</div>
              )}
              {client.gstin && (
                <div className="mt-0.5 text-sm text-soft">
                  GSTIN: <span className="text-ink">{client.gstin}</span>
                </div>
              )}
            </div>
            <div className="text-right text-sm">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
                Details
              </div>
              <DetailRow label="Issue Date" value={formatDate(invoice.issueDate)} />
              <DetailRow label="Due Date" value={formatDate(invoice.dueDate)} />
              {billingPeriod && (
                <DetailRow label="Billing Period" value={billingPeriod} />
              )}
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="mt-10 w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-[1.5px] border-ink pb-3 pr-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-soft">
                  Description
                </th>
                <th className="w-14 border-b-[1.5px] border-ink pb-3 pl-3 text-right text-[11px] font-medium uppercase tracking-[0.1em] text-soft">
                  Qty
                </th>
                <th className="w-28 border-b-[1.5px] border-ink pb-3 pl-3 text-right text-[11px] font-medium uppercase tracking-[0.1em] text-soft">
                  Rate
                </th>
                <th className="w-32 border-b-[1.5px] border-ink pb-3 pl-3 text-right text-[11px] font-medium uppercase tracking-[0.1em] text-soft">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border-b border-line py-6 text-center text-sm text-soft"
                  >
                    Add line items to see them here.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-line py-[14px] pr-3 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-medium text-ink">
                          {item.description || '—'}
                        </span>
                        {item.category && (
                          <span className="inline-block rounded-[3px] bg-cyan-50 px-2 py-[2px] text-[10.5px] font-medium uppercase tracking-[0.08em] text-cyan-700">
                            {CATEGORY_LABEL[item.category]}
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <div className="mt-1 max-w-[340px] text-[13.5px] leading-[1.55] text-soft">
                          {item.detail}
                        </div>
                      )}
                    </td>
                    <td className="border-b border-line py-[14px] pl-3 text-right align-top text-[15px] text-ink">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap border-b border-line py-[14px] pl-3 text-right align-top text-[15px] text-ink">
                      {formatINR(item.rate)}
                    </td>
                    <td className="whitespace-nowrap border-b border-line py-[14px] pl-3 text-right align-top text-[15px] text-ink">
                      {formatINR(lineAmount(item))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* TOTALS */}
          <div className="mt-7 flex justify-end">
            <div className="w-[300px]">
              <TotalRow label="Subtotal" value={formatINR(totals.subtotal)} />
              {totals.discountAmount > 0 && (
                <TotalRow
                  label={
                    discount.type === 'percent'
                      ? `Discount (${discount.value}%)`
                      : 'Discount'
                  }
                  value={`− ${formatINR(totals.discountAmount)}`}
                  valueClassName="text-red-600"
                />
              )}
              {!showAnyGst && <TotalRow label="Tax" value={formatINR(0)} />}
              {showGstSplit && (
                <>
                  <TotalRow
                    label={`CGST (${gst.rate / 2}%)`}
                    value={formatINR(totals.cgst)}
                  />
                  <TotalRow
                    label={`SGST (${gst.rate / 2}%)`}
                    value={formatINR(totals.sgst)}
                  />
                </>
              )}
              {showIgst && (
                <TotalRow
                  label={`IGST (${gst.rate}%)`}
                  value={formatINR(totals.igst)}
                />
              )}
              <div className="mt-2 flex items-baseline justify-between border-t-[1.5px] border-ink pt-4 font-serif text-[21px] font-semibold">
                <span className="text-ink">Total Due</span>
                <span className="text-accent">{formatINR(totals.total)}</span>
              </div>
              {totals.total > 0 && (
                <div className="mt-2 text-right text-[14px] italic leading-snug text-soft">
                  {amountInWords(totals.total)}
                </div>
              )}
            </div>
          </div>

          {/* NOTE BLOCK */}
          <div className="mt-7 flex gap-12 border-t border-line pt-6">
            <div className="flex-1">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
                Payment
              </div>
              {hasPaymentInfo ? (
                <div className="space-y-0.5 text-sm text-ink">
                  {seller.upiId && (
                    <div>
                      <span className="text-soft">UPI:</span> {seller.upiId}
                    </div>
                  )}
                  {seller.bankName && (
                    <div>
                      <span className="text-soft">Bank:</span> {seller.bankName}
                    </div>
                  )}
                  {(seller.accountNumber || seller.ifsc) && (
                    <div>
                      {seller.accountNumber && (
                        <>
                          <span className="text-soft">A/C:</span>{' '}
                          {seller.accountNumber}
                        </>
                      )}
                      {seller.accountNumber && seller.ifsc && (
                        <span className="mx-1.5">·</span>
                      )}
                      {seller.ifsc && (
                        <>
                          <span className="text-soft">IFSC:</span> {seller.ifsc}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[13.5px] leading-[1.7] text-soft">
                  Payment details available on request.
                </p>
              )}
              {!seller.gstin && (
                <p className="mt-2 text-xs italic text-soft">
                  GST not applicable
                </p>
              )}
            </div>
            {invoice.notes && (
              <div className="flex-1">
                <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
                  Notes
                </div>
                <p className="whitespace-pre-line text-[13.5px] leading-[1.7] text-soft">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* FOOTER */}
          <div className="mt-7 text-center font-serif text-[13px] tracking-[0.02em] text-soft">
            {seller.name} — Invoice {invoice.number}
          </div>
        </div>
      </div>
    )
  },
)

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-1.5 flex justify-end gap-[18px]">
      <span className="text-soft">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

function TotalRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex justify-between py-[7px] text-sm">
      <span className="text-soft">{label}</span>
      <span className={valueClassName ?? 'text-ink'}>{value}</span>
    </div>
  )
}
