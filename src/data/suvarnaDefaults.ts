import type { ItemCategory, Seller } from '../types/invoice'

export const SUVARNA_SELLER: Seller = {
  name: 'Suvarna',
  tagline: 'Pawn Shop Management System',
  address: '',
  email: '',
  phone: '',
  gstin: '',
  pan: '',
  logoUrl: '/logo.png',
  upiId: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
}

export const DEFAULT_NOTES =
  'The monthly subscription auto-renews and covers all hosting, support and future upgrades. Setup fee is charged once. Thank you for your business.'

export const DEFAULT_TERMS =
  'Payment due within 30 days of invoice date. Late payments may incur additional charges.'

export type QuickAddItem = {
  description: string
  detail: string
  category: ItemCategory
  rate: number
}

export const QUICK_ADD_ITEMS: QuickAddItem[] = [
  {
    description: 'Setup & Onboarding',
    detail:
      'Account provisioning, data migration, shop configuration, staff training and first-month support.',
    category: 'one-time',
    rate: 15000,
  },
  {
    description: 'Software Subscription',
    detail:
      'Hosting, automatic backups, support, bug fixes, and all updates & new features.',
    category: 'monthly',
    rate: 800,
  },
  {
    description: 'Annual Maintenance Contract (AMC)',
    detail:
      'Priority support, monthly health checks, and quarterly performance reviews.',
    category: 'yearly',
    rate: 12000,
  },
  {
    description: 'Annual Renewal',
    detail: 'Renewal of the Suvarna software license for one year.',
    category: 'yearly',
    rate: 8000,
  },
]

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
  'one-time': 'One-time',
  monthly: 'Monthly',
  yearly: 'Yearly',
  custom: 'Custom',
}
