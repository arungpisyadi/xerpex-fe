export interface Package {
  id: number
  user_id: number
  name: string
  category: string
  type: string
  description: string
  days: number
  cost_per_pax: number
  min_pax: number
  created_at: string
  updated_at: string
}

export interface CreatePackageRequest {
  name: string
  category: string
  type: string
  description: string
  days: number
  cost_per_pax: number
  min_pax: number
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {}

export interface PackageListResponse {
  packages: Package[]
  total: number
  skip: number
  limit: number
}

export interface PackageFilters {
  skip?: number
  limit?: number
  category?: string
  type?: string
  search?: string
  min_cost?: number
  max_cost?: number
  active_only?: boolean
}

export type PackageCategory = 'tour' | 'accommodation' | 'transport' | 'activity' | 'other'
export type PackageType = 'adventure' | 'cultural' | 'relaxation' | 'business' | 'family' | 'other'
