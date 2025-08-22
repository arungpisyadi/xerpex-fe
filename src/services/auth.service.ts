import apiClient from './api.service';
import { handleError } from '../utils/errorHandler';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'finance' | 'manager' | 'survey-admin' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  success?: boolean;
  error?: string;
  details?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user';
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Initialize from localStorage
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Promise with login response
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { access_token, token_type, user } = response.data;

      // Store authentication data
      this.token = access_token;
      this.currentUser = user;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw handleError(error, 'login');
    }
  }

  /**
   * Register new user
   * @param userData - Registration data
   * @returns Promise with registration response
   */
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleError(error, 'register');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get current user profile
   * @returns Promise with user data
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/profile');
      this.currentUser = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw handleError(error, 'getProfile');
    }
  }

  /**
   * Update user profile
   * @param userData - Updated user data
   * @returns Promise with updated user
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      this.currentUser = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw handleError(error, 'updateProfile');
    }
  }

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with success response
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      throw handleError(error, 'changePassword');
    }
  }

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise with success response
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw handleError(error, 'requestPasswordReset');
    }
  }

  /**
   * Reset password with token
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Promise with success response
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
    } catch (error) {
      throw handleError(error, 'resetPassword');
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   * @returns True if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  /**
   * Get current user
   * @returns Current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current user role
   * @returns User role or null
   */
  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  /**
   * Check if user is admin
   * @returns True if user is admin
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Check if user is finance
   * @returns True if user is finance
   */
  isFinance(): boolean {
    return this.currentUser?.role === 'finance';
  }

  /**
   * Check if user is regular user
   * @returns True if user is regular user
   */
  isRegularUser(): boolean {
    return this.currentUser?.role === 'staff';
  }

  /**
   * Check if user can access all data (admin or finance)
   * @returns True if user can access all data
   */
  canAccessAllData(): boolean {
    return this.isAdmin() || this.isFinance();
  }

  /**
   * Check if user has permission for specific action
   * @param permission - Permission to check
   * @returns True if user has permission
   */
  hasPermission(permission: string): boolean {
    const userRole = this.getUserRole();

    switch (permission) {
      case 'view_all_customers':
      case 'view_all_quotes':
      case 'view_all_invoices':
      case 'view_all_payments':
        return this.canAccessAllData();

      case 'manage_users':
      case 'manage_system_settings':
        return this.isAdmin();

      case 'manage_finances':
      case 'view_financial_reports':
        return this.isAdmin() || this.isFinance();

      case 'create_quotes':
      case 'create_invoices':
      case 'create_customers':
        return true; // All authenticated users can create

      default:
        return false;
    }
  }

  /**
   * Get authentication token
   * @returns Current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Refresh authentication token
   * @returns Promise with new token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/auth/refresh');
      const { access_token } = response.data;

      this.token = access_token;
      localStorage.setItem('token', access_token);

      return access_token;
    } catch (error) {
      this.clearAuth();
      throw handleError(error, 'refreshToken');
    }
  }

  /**
   * Verify token validity
   * @returns Promise with verification result
   */
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/verify');
      return true;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }
}

export default new AuthService();
