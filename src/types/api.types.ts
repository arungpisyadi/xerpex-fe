// Common API response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface ApiError {
  detail: string | ValidationError[]
  status?: number
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

// Common query parameters
export interface PaginationParams {
  skip?: number
  limit?: number
}

export interface SearchParams {
  search?: string
}

export interface DateRangeParams {
  from_date?: string
  to_date?: string
}

// HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// API endpoints base paths
export const API_ENDPOINTS = {
  CUSTOMERS: '/customers',
  TAXES: '/taxes',
  PACKAGES: '/packages',
  QUOTES: '/quotes',
  INVOICES: '/invoices',
  PAYMENTS: '/payments',
} as const

// Workflow states
export interface WorkflowState {
  currentStep: string
  data: Record<string, any>
  errors: Record<string, string>
  loading: boolean
}
