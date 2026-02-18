/**
 * Sales Report Types
 */

export interface SalesReportItem {
  invoice_id: number
  invoice_number: string
  booking_id: number
  booking_code: string
  customer_name: string
  sales_person_name: string
  check_in: string
  check_out: string
  total: string
  amount_paid: string
  amount_due: string
  payment_status: string
}

export interface SalesReportFilters {
  start_date: string
  end_date: string
  sales_person_ids: number[] | null
  payment_status: string | null
}

export interface SalesReportSummary {
  total_sales_amount: string
  total_paid_amount: string
  total_difference: string
}

export interface SalesPerson {
  id: number
  full_name: string
  email?: string
  role?: string
}

export interface SalesReportApiResponse {
  start_date: string
  end_date: string
  items: SalesReportItem[]
  total_sales_amount: string
  total_paid_amount: string
  total_difference: string
}

/**
 * Report Module Types
 * For extensibility - add more report types here
 */
export type ReportType = 'sales' | 'inventory' | 'customer' | 'financial'

export interface ReportConfig {
  id: string
  name: string
  description: string
  type: ReportType
  route: string
  icon: string
}
