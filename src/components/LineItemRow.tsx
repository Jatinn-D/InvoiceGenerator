import { Trash2 } from 'lucide-react'
import type { ItemCategory, LineItem } from '../types/invoice'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'
import { formatINR, lineAmount } from '../lib/calculations'
import { CATEGORY_LABEL } from '../data/suvarnaDefaults'

type Props = {
  item: LineItem
  onChange: (item: LineItem) => void
  onRemove: () => void
}

const CATEGORY_OPTIONS: ItemCategory[] = [
  'one-time',
  'monthly',
  'yearly',
  'custom',
]

export function LineItemRow({ item, onChange, onRemove }: Props) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3 space-y-2">
      {/* Row 1: Title + Category */}
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Item title"
            value={item.description}
            onChange={(e) => onChange({ ...item, description: e.target.value })}
          />
        </div>
        <div className="w-[132px] shrink-0">
          <Select
            value={item.category ?? ''}
            onChange={(e) =>
              onChange({
                ...item,
                category: (e.target.value || undefined) as
                  | ItemCategory
                  | undefined,
              })
            }
          >
            <option value="">— No badge —</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Row 2: Qty + Rate + Amount display + Delete */}
      <div className="flex items-center gap-2">
        <div className="w-[72px] shrink-0">
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) =>
              onChange({ ...item, quantity: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            type="number"
            min={0}
            step={0.01}
            placeholder="Rate (₹)"
            value={item.rate}
            onChange={(e) =>
              onChange({ ...item, rate: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="w-[108px] shrink-0 text-right text-sm font-medium text-ink whitespace-nowrap">
          {formatINR(lineAmount(item))}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-md p-2 text-soft hover:bg-dangerL hover:text-danger"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Textarea
        placeholder="Detail (longer description shown under the title — optional)"
        rows={2}
        value={item.detail ?? ''}
        onChange={(e) => onChange({ ...item, detail: e.target.value })}
        className="min-h-[60px]"
      />
    </div>
  )
}
