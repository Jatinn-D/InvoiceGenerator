import { Trash2 } from 'lucide-react'
import type { Client } from '../types/invoice'
import { Select } from './ui/Select'

type Props = {
  clients: Client[]
  currentId: string | null
  onSelect: (client: Client | null) => void
  onDelete: (id: string) => void
}

export function ClientPicker({ clients, currentId, onSelect, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentId ?? ''}
        onChange={(e) => {
          const id = e.target.value
          if (!id) {
            onSelect(null)
            return
          }
          const c = clients.find((x) => x.id === id)
          if (c) onSelect(c)
        }}
      >
        <option value="">— New client —</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {c.company ? ` · ${c.company}` : ''}
          </option>
        ))}
      </Select>
      {currentId && (
        <button
          type="button"
          onClick={() => {
            if (confirm('Delete this saved client?')) onDelete(currentId)
          }}
          className="rounded-md p-2 text-warmgray hover:bg-dangerL hover:text-danger"
          aria-label="Delete saved client"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
