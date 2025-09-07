import apiClient from './api.service';

// TypeScript interfaces based on API schemas

export interface MonthlyTarget {
  month: number;
  target_amount: number;
  carried_over: number;
  adjusted_target: number;
}

export interface MonthlyAchievement {
  month: number;
  achieved_amount: number;
  target_amount: number;
  percentage: number;
}

export interface MyPerformance {
  user_id: number;
  year: number;
  monthly_targets: MonthlyTarget[];
  monthly_achievements: MonthlyAchievement[];
  total_achievement: number;
  achievement_percentage: number;
}

export interface CompanyPerformance {
  year: number;
  total_yearly_target: number;
  total_achievement: number;
  achievement_percentage: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface UserPerformance {
  user_id: number;
  username: string;
  full_name: string | null;
  target_amount: number;
  achieved_amount: number;
  achievement_percentage: number;
  months_with_data: number;
}

export interface UserPerformances {
  year: number;
  chart_data: ChartData;
  users: UserPerformance[];
  total_users: number;
  generated_at: string;
}

export interface MonthlyData {
  month: number;
  month_name: string;
  target_amount: number;
  achieved_amount: number;
  achievement_percentage: number;
  carried_over_amount: number;
}

export interface ChartDataPoint {
  month: number;
  month_name: string;
  target: number;
  achievement: number;
}

export interface YtdMetrics {
  ytd_target: number;
  ytd_achievement: number;
  ytd_percentage: number;
}

export interface TopPerformer {
  user_id: number;
  username: string;
  full_name: string | null;
  total_achievement: number;
  achievement_percentage: number;
}

export interface TargetsOverview {
  total_yearly_target: number;
  current_month_achievement: number;
  achievement_percentage: number;
  monthly_data: MonthlyData[];
  chart_data: ChartDataPoint[];
  ytd_metrics: YtdMetrics;
  active_users_count: number;
  top_performers: TopPerformer[];
}

export class TargetsService {
  /**
   * Get current user's sales performance data for the specified year
   * @param year - Year to fetch data for (optional, defaults to current year)
   * @returns Promise<MyPerformance>
   */
  static async getMyPerformance(year?: number): Promise<MyPerformance> {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/targets/my-performance${params}`);
    return response.data;
  }

  /**
   * Get company-wide performance data
   * @param year - Year to fetch data for (optional, defaults to current year)
   * @returns Promise<CompanyPerformance>
   */
  static async getCompanyPerformance(year?: number): Promise<CompanyPerformance> {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/targets/company-performance${params}`);
    return response.data;
  }

  /**
   * Get user performance data formatted for chart visualization
   * @param year - Year for performance data (required)
   * @param userId - Specific user ID filter, returns all users if not provided
   * @returns Promise<UserPerformances>
   */
  static async getUserPerformances(year: number, userId?: number): Promise<UserPerformances> {
    let params = `?year=${year}`;
    if (userId) {
      params += `&user_id=${userId}`;
    }
    const response = await apiClient.get(`/targets/user-performances${params}`);
    return response.data;
  }

  /**
   * Get comprehensive targets overview with charts and metrics (Admin only)
   * @returns Promise<TargetsOverview>
   */
  static async getTargetsOverview(): Promise<TargetsOverview> {
    const response = await apiClient.get('/admin/targets/overview');
    return response.data;
  }
}
