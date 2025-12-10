import type { InvoiceStatus } from './invoice.types'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partial' | 'full'
export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'digital_wallet'
  | 'check'
  | 'other'
export type PaymentType = 'down-payment' | 'installment' | 'paid-off'

export interface PaymentCustomer {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface PaymentInvoice {
  invoice_number: string
  total: number
  status: InvoiceStatus
  due_date: string
}

export interface Payment {
  id: number
  user_id: number // Added for role-based access control
  invoice_id: number
  amount: number
  payment_method: PaymentMethod
  payment_date: string
  reference_number?: string
  status: PaymentStatus
  notes?: string
  created_at: string
  updated_at: string
  // Nested properties from backend response
  customer?: PaymentCustomer
  invoice?: PaymentInvoice
}

export interface CreatePaymentRequest {
  invoice_id: number
  amount: number
  payment_method: PaymentMethod
  payment_date: string
  payment_type: PaymentType
  reference_number: string
  notes: string
  status: PaymentStatus
}

export interface UpdatePaymentRequest extends Partial<CreatePaymentRequest> {}

export interface PaymentListResponse {
  payments: Payment[]
  total: number
  skip: number
  limit: number
}

export interface PaymentFilters {
  skip?: number
  limit?: number
  status?: PaymentStatus
  payment_method?: PaymentMethod
  invoice_id?: number
  from_date?: string
  to_date?: string
  // Note: user_id filtering is handled automatically by backend via JWT token
}

export interface PaymentActionResponse {
  success: boolean
  message: string
  payment?: Payment
}

export interface PaymentSummary {
  total_payments: number
  total_amount: number
  pending_amount: number
  completed_amount: number
  failed_amount: number
  refunded_amount: number
}
