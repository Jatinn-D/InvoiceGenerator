import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Seller } from '../types/invoice'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'

type Props = {
  open: boolean
  seller: Seller
  onClose: () => void
  onSave: (seller: Seller) => void
}

export function SellerSettingsDrawer({ open, seller, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Seller>(seller)

  useEffect(() => {
    if (open) setDraft(seller)
  }, [open, seller])

  if (!open) return null

  function update<K extends keyof Seller>(key: K, value: Seller[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside className="flex h-full w-full max-w-md flex-col bg-bg shadow-xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-xl text-ink">Your business details</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-soft hover:bg-line"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="space-y-3">
            <div>
              <Label htmlFor="s-name">Business name</Label>
              <Input
                id="s-name"
                value={draft.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="s-tag">Tagline</Label>
              <Input
                id="s-tag"
                value={draft.tagline ?? ''}
                onChange={(e) => update('tagline', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="s-addr">Address</Label>
              <Textarea
                id="s-addr"
                rows={3}
                value={draft.address}
                onChange={(e) => update('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="s-email">Email</Label>
                <Input
                  id="s-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="s-phone">Phone</Label>
                <Input
                  id="s-phone"
                  value={draft.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="s-gstin">GSTIN (optional)</Label>
                <Input
                  id="s-gstin"
                  value={draft.gstin ?? ''}
                  onChange={(e) => update('gstin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="s-pan">PAN (optional)</Label>
                <Input
                  id="s-pan"
                  value={draft.pan ?? ''}
                  onChange={(e) => update('pan', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-line pt-5">
            <h3 className="font-serif text-base text-ink">Payment details</h3>
            <div>
              <Label htmlFor="s-upi">UPI ID</Label>
              <Input
                id="s-upi"
                placeholder="you@bank"
                value={draft.upiId ?? ''}
                onChange={(e) => update('upiId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="s-bank">Bank name</Label>
              <Input
                id="s-bank"
                value={draft.bankName ?? ''}
                onChange={(e) => update('bankName', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="s-acc">Account number</Label>
                <Input
                  id="s-acc"
                  value={draft.accountNumber ?? ''}
                  onChange={(e) => update('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="s-ifsc">IFSC</Label>
                <Input
                  id="s-ifsc"
                  value={draft.ifsc ?? ''}
                  onChange={(e) => update('ifsc', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(draft)
              onClose()
            }}
          >
            Save
          </Button>
        </footer>
      </aside>
    </div>
  )
}
