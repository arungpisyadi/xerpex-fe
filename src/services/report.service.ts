import type {
  SalesReportFilters,
  SalesReportApiResponse,
  SalesPerson,
} from '../types/report.types'
import apiService from './api.service'

/**
 * Report Service
 * Handles all report-related API calls
 */
class ReportService {
  private baseUrl = '/reports'

  /**
   * Get sales report data with filters
   * Endpoint: POST /api/v1/reports/sales
   * Body: { start_date, end_date, sales_person_ids, payment_status }
   */
  async getSalesReport(filters?: SalesReportFilters): Promise<SalesReportApiResponse> {
    try {
      const response = await apiService.post<SalesReportApiResponse>(
        `${this.baseUrl}/sales`,
        filters
      )
      return response.data
    } catch (error) {
      console.error('Error fetching sales report:', error)
      // Return empty response on error
      return {
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
        items: [],
        total_sales_amount: '0',
        total_paid_amount: '0',
        total_difference: '0',
      }
    }
  }

  /**
   * Get list of sales persons for filter
   * Endpoint: GET /api/v1/get-sales
   * Returns: { id: number, full_name: string }[]
   */
  async getSalesPersons(): Promise<SalesPerson[]> {
    try {
      const response = await apiService.get<SalesPerson[]>('/get-sales')
      return response.data
    } catch (error) {
      console.error('Error fetching sales persons:', error)
      return []
    }
  }

  /**
   * Export sales report to CSV
   * Endpoint: POST /api/v1/reports/sales/export
   */
  async exportSalesReport(filters?: SalesReportFilters): Promise<Blob> {
    try {
      const response = await apiService.post<Blob>(
        `${this.baseUrl}/sales/export`,
        filters,
        { responseType: 'blob' }
      )
      return response.data
    } catch (error) {
      console.error('Error exporting sales report:', error)
      // Return empty blob on error
      return new Blob([''], { type: 'text/csv' })
    }
  }
}

export default new ReportService()
