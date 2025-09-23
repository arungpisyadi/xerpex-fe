import apiClient from './api.service';
import type { User } from './auth.service';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  is_active?: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'finance' | 'manager' | 'survey-admin' | 'staff' | 'sales';
  is_active?: boolean;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

export interface UserListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

class UserService {
  /**
   * Get all users with optional pagination
   */
  async getUsers(params: UserFilters = {}): Promise<User[] | UserListResponse> {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string | number): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string | number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string | number): Promise<void> {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user activities
   */
  async getUserActivities(id: string | number, params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await apiClient.get(`/users/${id}/activities`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
