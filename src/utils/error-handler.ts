import type { ApiError, ValidationError } from '../types/api.types';

export class ErrorHandler {
  /**
   * Handle API errors and return user-friendly messages
   * @param error - The error object from API
   * @returns Formatted error message
   */
  static handleApiError(error: any): string {
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return this.handleValidationErrors(data);
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return this.handleValidationErrors(data);
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return data?.detail || 'An unexpected error occurred.';
    }
  }

  /**
   * Handle validation errors from API
   * @param data - Error response data
   * @returns Formatted validation error message
   */
  static handleValidationErrors(data: ApiError): string {
    if (typeof data.detail === 'string') {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      const errors = data.detail as ValidationError[];
      const messages = errors.map(err => {
        const field = err.loc.length > 1 ? err.loc[1] : 'field';
        return `${field}: ${err.msg}`;
      });
      return messages.join(', ');
    }

    return 'Validation error occurred.';
  }

  /**
   * Extract field-specific validation errors
   * @param data - Error response data
   * @returns Object with field names as keys and error messages as values
   */
  static extractFieldErrors(data: ApiError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    if (Array.isArray(data.detail)) {
      const errors = data.detail as ValidationError[];
      errors.forEach(err => {
        if (err.loc && err.loc.length > 1) {
          const field = err.loc[1] as string;
          fieldErrors[field] = err.msg;
        }
      });
    }

    return fieldErrors;
  }

  /**
   * Show error notification (to be implemented with your notification system)
   * @param message - Error message to display
   */
  static showError(message: string): void {
    // TODO: Implement with your notification system
    console.error('Error:', message);
    // Example: toast.error(message);
  }

  /**
   * Show success notification (to be implemented with your notification system)
   * @param message - Success message to display
   */
  static showSuccess(message: string): void {
    // TODO: Implement with your notification system
    console.log('Success:', message);
    // Example: toast.success(message);
  }

  /**
   * Log error for debugging
   * @param error - Error object
   * @param context - Additional context information
   */
  static logError(error: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${context ? `${context}: ` : ''}${error.message || error}`;

    console.error(logMessage);

    if (error.stack) {
      console.error(error.stack);
    }

    // TODO: Send to error tracking service in production
    // Example: Sentry.captureException(error, { extra: { context } });
  }
}

/**
 * Async error wrapper for handling promises
 * @param promise - Promise to wrap
 * @returns Tuple of [error, data]
 */
export async function handleAsync<T>(
  promise: Promise<T>
): Promise<[any, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise that resolves with the function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
