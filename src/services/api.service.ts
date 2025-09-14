import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance with base URL and default headers
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://kebunsu-api.tugugroup.co.id/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Handle different HTTP status codes as per the guide
    if (error.response) {
      const { status, data } = error.response;

      // Skip error handling for blob responses to prevent corruption
      if (error.config?.responseType === 'blob') {
        return Promise.reject(error);
      }

      switch (status) {
        case 401:
          // Unauthorized (invalid token)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin';
          }
          break;
        case 403:
          // Forbidden (insufficient permissions)
          console.error('Access forbidden - insufficient permissions');
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 422:
          // Unprocessable Entity (business logic errors)
          console.error('Validation error:', data?.detail || 'Validation failed');
          break;
        case 500:
          // Internal Server Error
          console.error('Internal server error');
          break;
        default:
          console.error(`API Error ${status}:`, data?.detail || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection');
    } else {
      // Other errors
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Create a separate API client for PDF/binary requests to avoid header conflicts
const pdfApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://kebunsu-api.tugugroup.co.id/api/v1',
  headers: {
    // No Content-Type header to avoid corrupting binary data
    'Accept': 'application/pdf'
  }
});

// Add auth interceptor for PDF client
pdfApiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for PDF client - simpler error handling for binary responses
pdfApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // For PDF requests, just log errors and reject without complex handling
    // to avoid interfering with binary data
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin';
          }
          break;
        default:
          console.error(`PDF API Error ${status}`);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { pdfApiClient };
