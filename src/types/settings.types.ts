/**
 * Company Settings Types for XerpeX ERP System
 */

// Raw API response format (snake_case)
export interface CompanySettingsResponse {
  id: number;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  bank_account_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  bank_swift_number: string;
  created_at: string;
  updated_at: string;
}

// Frontend format (camelCase)
export interface CompanySettings {
  id?: number;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  bankAccountNumber: string;
  bankAccountHolderName: string;
  bankName: string;
  bankSwiftNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

// Request format for updating settings
export interface UpdateCompanySettingsRequest {
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  bank_account_number?: string;
  bank_account_holder_name?: string;
  bank_name?: string;
  bank_swift_number?: string;
}

// Frontend update format (camelCase)
export interface UpdateCompanySettings {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  bankAccountNumber?: string;
  bankAccountHolderName?: string;
  bankName?: string;
  bankSwiftNumber?: string;
}

// API response wrapper
export interface CompanySettingsApiResponse {
  data: CompanySettingsResponse;
}

// Default fallback values
export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'Your Company Name',
  companyAddress: '123 Business St, City, State, ZIP',
  companyPhone: '(123) 456-7890',
  companyEmail: 'info@company.com',
  bankAccountNumber: '',
  bankAccountHolderName: '',
  bankName: '',
  bankSwiftNumber: ''
};
