import apiClient from './api.service'

// TypeScript interfaces for KPI API responses
export interface KpiMetrics {
  count: number
  growth: number
}

export interface MonthlyRevenueData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }[]
}

export interface CurrentMonthPerformance {
  target: number
  current_achievement: number
  achievement_percentage: number
  today_sales: number
  growth: number
}

export interface CurrentYearPerformance {
  target: number
  current_achievement: number
  achievement_percentage: number
  today_sales: number
  growth: number
}

export class KpiService {
  /**
   * Get customers KPI data
   * @returns Promise<KpiMetrics>
   */
  static async getCustomersKpi(): Promise<KpiMetrics> {
    const response = await apiClient.get('/kpi/customers')
    return response.data
  }

  /**
   * Get bookings KPI data
   * @returns Promise<KpiMetrics>
   */
  static async getBookingsKpi(): Promise<KpiMetrics> {
    const response = await apiClient.get('/kpi/bookings')
    return response.data
  }

  /**
   * Get surveys KPI data
   * @returns Promise<KpiMetrics>
   */
  static async getSurveysKpi(): Promise<KpiMetrics> {
    const response = await apiClient.get('/kpi/surveys')
    return response.data
  }

  /**
   * Get quotes KPI data
   * @returns Promise<KpiMetrics>
   */
  static async getQuotesKpi(): Promise<KpiMetrics> {
    const response = await apiClient.get('/kpi/quotes')
    return response.data
  }

  /**
   * Get monthly revenue data for chart
   * @param year - Year to fetch data for (optional, defaults to current year)
   * @returns Promise<MonthlyRevenueData>
   */
  static async getMonthlyRevenue(year?: number): Promise<MonthlyRevenueData> {
    const params = year ? `?year=${year}` : ''
    const response = await apiClient.get(`/kpi/monthly_revenue${params}`)
    return response.data
  }

  /**
   * Get current month performance data
   * @returns Promise<CurrentMonthPerformance>
   */
  static async getCurrentMonthPerformance(): Promise<CurrentMonthPerformance> {
    const response = await apiClient.get('/kpi/current_month_performance')
    return response.data
  }

  /**
   * Get current year performance data
   * @returns Promise<CurrentYearPerformance>
   */
  static async getCurrentYearPerformance(): Promise<CurrentYearPerformance> {
    const response = await apiClient.get('/kpi/current_year_performance')
    return response.data
  }
}
