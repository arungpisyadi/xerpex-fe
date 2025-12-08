import type { HistoryItem } from './common.types';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export type { HistoryItem };

export interface QuoteItem {
  id: number;
  package_id: number;
  unit_price: number;
  discount: number;
  line_total: number;
  package_name?: string;
}

export interface Quote {
  id: number;
  user_id: number;  // Added for role-based access control
  customer_id: number;
  sales_person_id?: number;  // Sales person in charge of the quote
  quote_number: string;
  issue_date: string;
  expiry_date?: string;
  status: QuoteStatus;
  total: number;
  check_in?: string;  // Check-in date for villa booking
  check_out?: string;  // Check-out date for villa booking
  villa_ids?: number[];  // Array of villa IDs
  customer_name?: string;
  items: QuoteItem[];
  notes?: string;  // Added notes field
  history?: HistoryItem[];
  customer?: {
    id?: number;
    name?: string;
    email?: string;
    billing_address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateQuoteRequest {
  customer_id: number;
  sales_person_id: number;
  issue_date: string;
  expiry_date?: string;
  status: QuoteStatus;
  total: number;
  check_in?: string;  // Check-in date for villa booking
  check_out?: string;  // Check-out date for villa booking
  villa_ids?: number[];  // Array of villa IDs
  items: Omit<QuoteItem, 'id'>[];
}

export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {}

export interface QuoteListResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

export interface QuoteFilters {
  skip?: number;
  limit?: number;
  status?: QuoteStatus;
  customer_id?: number;
  from_date?: string;
  to_date?: string;
  // Note: user_id filtering is handled automatically by backend via JWT token
}

export interface ConvertToInvoiceRequest {
  payment_terms: string;
  due_date: string;
  notes?: string;
}

export interface QuoteActionResponse {
  success: boolean;
  message: string;
  quote?: Quote;
}

export interface UpdateQuoteNotesRequest {
  notes: string;
}

export interface UpdateQuoteNotesResponse {
  success: boolean;
  message: string;
  quote: Quote;
}
