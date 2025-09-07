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
    console.log('Auth service login called with:', credentials);

    try {
      // Use the login-json endpoint which accepts JSON data
      console.log('Making API request to /auth/login/json');
      const response = await apiClient.post('/auth/login/json', {
        email: credentials.username, // API expects 'email' field, not 'username'
        password: credentials.password
      });

      console.log('Login API response:', response);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        try {
          // Get user info but don't let it fail the whole login process
          await this.getCurrentUser();
        } catch (userError) {
          console.error('Error fetching user data, but login succeeded:', userError);
        }

        // Return success result
        return {
          success: true,
          data: response.data,
          error: null
        };
      } else {
        // No token in response - throw error
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error in auth service:', error);

      let errorMessage = 'Authentication failed';
      let detailMessage = '';

      if (error.response) {
        // Extract the error message from the response
        if (error.response.data) {
          // Check for msg field first (as per API docs)
          if (error.response.data.msg) {
            detailMessage = error.response.data.msg;
            errorMessage = 'Authentication failed';
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = `Authentication failed (${error.response.status})`;
          }
        }
      } else if (error.request) {
        errorMessage = 'Server not responding. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Return error result with the backend error message and details
      return {
        success: false,
        data: null,
        error: errorMessage,
        details: detailMessage,
        status: error.response?.status
      };
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

  /**
   * Check if user is admin
   * @returns {boolean} - True if user is admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
}

export default new AuthService();
