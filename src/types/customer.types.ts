export interface Customer {
  id: number
  user_id: number // Added for role-based access control
  name: string
  email?: string
  phone_number?: string
  phone?: string // Added for component compatibility
  address?: string
  billing_address?: string
  city?: string // Added for CustomerDetailsModal
  country?: string // Added for CustomerDetailsModal
  status: number // 0 = inactive, 1 = active
  is_active?: boolean // Added for CustomerDetailsModal status display
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  phone_number?: string
  phone?: string // Added for CustomerFormModal form
  address?: string
  billing_address?: string
  city?: string // Added for CustomerFormModal form
  country?: string // Added for CustomerFormModal form
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CustomerListResponse {
  customers: Customer[]
  total: number
  skip: number
  limit: number
}

export interface CustomerFilters {
  skip?: number
  limit?: number
  search?: string
  active_only?: boolean
  // Note: user_id filtering is handled automatically by backend via JWT token
}
