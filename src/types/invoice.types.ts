import type { Payment } from './payment.types'
import type { HistoryItem } from './common.types'

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

export type { HistoryItem }

export interface InvoiceItem {
  id: number
  package_id: number
  unit_price: number
  pax: number
  discount: number
  line_total: number
  package_name?: string
}

export interface Invoice {
  id: number
  user_id: number // Added for role-based access control
  customer_id: number
  invoice_number: string
  quote_id?: number
  issue_date: string
  due_date: string
  status: InvoiceStatus
  total: number
  tax_total: number
  customer_name?: string
  billing_address?: string
  items: InvoiceItem[]
  payments: Payment[]
  payment_terms?: string
  notes?: string
  history?: HistoryItem[]
  check_in?: string
  check_out?: string
  villa_ids?: number[]
  created_at: string
  updated_at: string
}

export interface InvoiceResponse {
  data: Invoice
}

export interface CreateInvoiceRequest {
  customer_id: number
  quote_id?: number
  issue_date: string
  due_date: string
  status: InvoiceStatus
  total: number
  tax_total: number
  payment_terms?: string
  notes?: string
  sales_person_id: number
  check_in?: string
  check_out?: string
  villa_ids?: number[]
  items: Omit<InvoiceItem, 'id'>[]
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {}

export interface InvoiceListResponse {
  data: {
    invoices: Invoice[]
    total: number
    skip: number
    limit: number
  }
}

export interface InvoiceFilters {
  skip?: number
  limit?: number
  status?: InvoiceStatus
  customer_id?: number
  overdue_only?: boolean
  from_date?: string
  to_date?: string
  // Note: user_id filtering is handled automatically by backend via JWT token
}

export interface InvoiceActionResponse {
  success: boolean
  message: string
  invoice?: Invoice
}

export interface SendInvoiceRequest {
  recipient_email?: string
  subject?: string
  message?: string
}
