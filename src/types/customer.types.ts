export interface Customer {
  id: number;
  user_id: number;  // Added for role-based access control
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  billing_address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  billing_address?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  skip: number;
  limit: number;
}

export interface CustomerFilters {
  skip?: number;
  limit?: number;
  search?: string;
  active_only?: boolean;
  // Note: user_id filtering is handled automatically by backend via JWT token
}
