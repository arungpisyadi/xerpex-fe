import apiClient from './api.service';

class AuthService {
  /**
   * Login user and store token
   * @param {Object} credentials - User credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise} - Response from API
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        await this.getCurrentUser(); // Get and store user info
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response from API
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user and clear storage
   * @returns {Promise} - Response from API
   */
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      // Clear storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  /**
   * Get current user information
   * @returns {Promise} - Response from API
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Get stored user data
   * @returns {Object|null} - User data or null
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
