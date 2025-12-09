import axios from 'axios'

// Create axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Only redirect to signin if we're not already on the signin page
      // This prevents page reloads during signin debugging
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  },
)

// Create a separate API client for PDF/binary requests to avoid header conflicts
const pdfApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // No Content-Type header to avoid corrupting binary data
    Accept: 'application/pdf',
  },
})

// Add auth interceptor for PDF client
pdfApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for PDF client - simpler error handling for binary responses
pdfApiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // For PDF requests, just log errors and reject without complex handling
    // to avoid interfering with binary data
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin'
          }
          break
        default:
          console.error(`PDF API Error ${status}`)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
export { pdfApiClient }
