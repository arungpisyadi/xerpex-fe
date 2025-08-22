export interface Tax {
  id: number;
  name: string;
  percentage: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaxRequest {
  name: string;
  percentage: number;
}

export interface UpdateTaxRequest extends Partial<CreateTaxRequest> {}

export interface TaxListResponse {
  taxes: Tax[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaxFilters {
  skip?: number;
  limit?: number;
  active_only?: boolean;
}

export interface TaxCalculationRequest {
  amount: number;
  tax_ids: number[];
}

export interface TaxBreakdown {
  name: string;
  percentage: number;
  amount: number;
}

export interface TaxCalculationResponse {
  subtotal: number;
  tax_total: number;
  total: number;
  tax_breakdown: TaxBreakdown[];
}
