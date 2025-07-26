import apiClient from './api.service';

class UserService {
  /**
   * Get all users with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} - Response from API
   */
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} - Response from API
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise} - Response from API
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response from API
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} - Response from API
   */
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user activities
   * @param {string} id - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response from API
   */
  async getUserActivities(id, params = {}) {
    try {
      const response = await apiClient.get(`/users/${id}/activities`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
