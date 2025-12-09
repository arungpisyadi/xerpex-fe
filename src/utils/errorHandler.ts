/**
 * Error handling utilities for the XerpeX ERP system
 * Based on the frontend development guide specifications
 */

export interface ApiError {
  status: number
  message: string
  detail?: any
}

export class ErrorHandler {
  /**
   * Handle API errors according to the guide specifications
   * @param error - The error object from axios
   * @returns Formatted error object
   */
  static handleApiError(error: any): ApiError {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          return {
            status,
            message: 'Bad Request - Validation errors',
            detail: data.detail,
          }
        case 401:
          return {
            status,
            message: 'Unauthorized - Invalid token',
            detail: data.detail,
          }
        case 403:
          return {
            status,
            message: 'Forbidden - Insufficient permissions',
            detail: data.detail,
          }
        case 404:
          return {
            status,
            message: 'Resource not found',
            detail: data.detail,
          }
        case 422:
          return {
            status,
            message: 'Unprocessable Entity - Business logic errors',
            detail: data.detail,
          }
        case 500:
          return {
            status,
            message: 'Internal Server Error',
            detail: data.detail,
          }
        default:
          return {
            status,
            message: `API Error ${status}`,
            detail: data.detail || 'Unknown error',
          }
      }
    } else if (error.request) {
      return {
        status: 0,
        message: 'Network error - please check your connection',
        detail: error.request,
      }
    } else {
      return {
        status: -1,
        message: 'Request error',
        detail: error.message,
      }
    }
  }

  /**
   * Show validation errors in a user-friendly format
   * @param errors - Validation error array from API
   * @returns Formatted error messages
   */
  static formatValidationErrors(errors: any): string[] {
    if (!Array.isArray(errors)) {
      return [(errors as any)?.msg || 'Validation error']
    }

    return errors.map((error: any) => {
      const field = error.loc?.join('.') || 'field'
      const message = error.msg || 'Invalid value'
      return `${field}: ${message}`
    })
  }

  /**
   * Check if error is a validation error (422)
   * @param error - Error object
   * @returns True if validation error
   */
  static isValidationError(error: ApiError): boolean {
    return error.status === 422
  }

  /**
   * Check if error is an authentication error (401)
   * @param error - Error object
   * @returns True if authentication error
   */
  static isAuthError(error: ApiError): boolean {
    return error.status === 401
  }

  /**
   * Check if error is a permission error (403)
   * @param error - Error object
   * @returns True if permission error
   */
  static isPermissionError(error: ApiError): boolean {
    return error.status === 403
  }

  /**
   * Check if error is a not found error (404)
   * @param error - Error object
   * @returns True if not found error
   */
  static isNotFoundError(error: ApiError): boolean {
    return error.status === 404
  }
}

/**
 * Generic error handler for Vue components
 * @param error - The error to handle
 * @param context - Optional context for logging
 */
export const handleError = (error: any, context?: string) => {
  const apiError = ErrorHandler.handleApiError(error)

  if (context) {
    console.error(`Error in ${context}:`, apiError)
  } else {
    console.error('API Error:', apiError)
  }

  // You can extend this to show toast notifications, etc.
  return apiError
}
