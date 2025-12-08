export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'completed'
  | 'cancelled';

export interface HistoryItem {
  id: number;
  quote_id: number;
  user_id: number;
  event_type: string;
  event_category: string;
  description: string;
  event_metadata: {
    status?: string;
    quote_number?: string;
    total_amount?: string;
    customer_name?: string;
    [key: string]: any;
  };
  created_at: string;
}

// Package interface for booking packages (similar to invoice items)
export interface BookingPackage {
  id?: number;
  package_id: number;
  package_name?: string;
  unit_price: number;
  pax: number;
  discount: number;
  line_total: number;
}

// Legacy villa interface kept for backward compatibility
export interface BookingVilla {
  id?: number;
  villa_id: number;
  villa_name?: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  num_nights: number;
  nightly_rate: number;
  subtotal: number;
  cleaning_fee: number;
  discount: number;
  line_total: number;
  special_requests?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  booking_number: string;
  customer_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  booking_date: string;

  // New structure with packages
  packages: BookingPackage[];
  villa_ids: number[]; // Simplified villa selection - just IDs

  // Date ranges for the booking
  check_in: string;
  check_out: string;
  num_nights: number;

  // Salesperson assignment
  salesmen_id?: number;
  salesperson_name?: string; // For display purposes

  // Legacy fields kept for backward compatibility
  earliest_check_in?: string;
  latest_check_out?: string;
  villas?: BookingVilla[];

  status: BookingStatus;
  payment_status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  customer_notes?: string;
  internal_notes?: string;
  history?: HistoryItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  customer_id: number;
  booking_date: string;
  check_in: string;
  check_out: string;
  items: Omit<BookingPackage, 'id' | 'package_name'>[];
  villas: number[]; // Array of selected villa IDs
  sales_person_id?: number; // Salesperson assignment
  subtotal: number;
  tax_total: number;
  total_amount: number;
  notes?: string;
  customer_notes?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  status?: BookingStatus;
  payment_status?: string;
  internal_notes?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  skip: number;
  limit: number;
}

export interface BookingFilters {
  skip?: number;
  limit?: number;
  status?: BookingStatus;
  payment_status?: string;
  customer_id?: number;
  from_date?: string;
  to_date?: string;
  villa_id?: number;
  search?: string;
}

export interface BookingActionResponse {
  success: boolean;
  message: string;
  booking?: Booking;
}

export interface ExportToInvoiceRequest {
  payment_terms?: string;
  due_date: string;
  notes?: string;
}

export interface ExportToInvoiceResponse {
  success: boolean;
  message: string;
  invoice_id: number;
  invoice_number: string;
}

// API Response structure for booking detail
export interface BookingDetailCustomer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  billing_address: string;
}

export interface BookingDetailSalesPerson {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface BookingDetailPackage {
  id: number;
  name: string;
  category: string;
  type: string;
  description: string;
}

export interface BookingDetailItem {
  id: number;
  package_id: number;
  unit_price: string;
  discount: string;
  pax: number;
  line_total: string;
  package: BookingDetailPackage;
}

export interface BookingDetailVillaInfo {
  id: number;
  name: string;
  description: string;
  capacity: string;
  room_type: string;
}

export interface BookingDetailVilla {
  id: number;
  villa_id: number;
  villa: BookingDetailVillaInfo;
}

export interface BookingDetail {
  id: number;
  booking_code: string;
  customer_id: number;
  check_in: string;
  check_out: string;
  total_pax: number;
  status: BookingStatus;
  notes: string;
  sales_person_id: number;
  total: string;
  tax_total: string;
  amount_paid: string;
  amount_due: string;
  created_at: string;
  updated_at: string;
  customer: BookingDetailCustomer;
  sales_person: BookingDetailSalesPerson;
  items: BookingDetailItem[];
  villas: BookingDetailVilla[];
  history?: HistoryItem[];
}
