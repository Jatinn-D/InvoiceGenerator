export type Seller = {
  name: string
  tagline?: string
  address: string
  email: string
  phone: string
  gstin?: string
  pan?: string
  logoUrl?: string
  upiId?: string
  bankName?: string
  accountNumber?: string
  ifsc?: string
}

export type Client = {
  id: string
  name: string
  company?: string
  address: string
  email?: string
  phone?: string
  gstin?: string
}

export type ItemCategory = 'one-time' | 'monthly' | 'yearly' | 'custom'

export type LineItem = {
  id: string
  description: string
  detail?: string
  category?: ItemCategory
  rate: number
  quantity: number
}

export type GstMode = 'none' | 'intra' | 'inter'

export type Discount = {
  type: 'flat' | 'percent'
  value: number
}

export type Gst = {
  mode: GstMode
  rate: number
}

export type Invoice = {
  number: string
  issueDate: string
  dueDate: string
  billingPeriod?: string
  seller: Seller
  client: Client
  items: LineItem[]
  discount: Discount
  gst: Gst
  notes?: string
  terms?: string
}

export type Totals = {
  subtotal: number
  discountAmount: number
  taxable: number
  cgst: number
  sgst: number
  igst: number
  total: number
}
