import type { Customer, CreateCustomerRequest } from '../types/customer.types'
import type { Tax, CreateTaxRequest } from '../types/tax.types'
import type { Quote, CreateQuoteRequest } from '../types/quote.types'
import type { Invoice, CreateInvoiceRequest } from '../types/invoice.types'
import type { Payment, CreatePaymentRequest } from '../types/payment.types'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  custom?: (value: any) => string | null
}

export interface ValidationErrors {
  [key: string]: string
}

export class FormValidator {
  /**
   * Validate a single field
   * @param value - Field value
   * @param rules - Validation rules
   * @param fieldName - Field name for error messages
   * @returns Error message or null if valid
   */
  static validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${fieldName} is required`
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (value === null || value === undefined || value === '')) {
      return null
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${fieldName} must not exceed ${rules.maxLength} characters`
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return `${fieldName} format is invalid`
      }

      if (rules.email && !this.isValidEmail(value)) {
        return `${fieldName} must be a valid email address`
      }

      if (rules.phone && !this.isValidPhone(value)) {
        return `${fieldName} must be a valid phone number`
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${fieldName} must be at least ${rules.min}`
      }

      if (rules.max !== undefined && value > rules.max) {
        return `${fieldName} must not exceed ${rules.max}`
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        return customError
      }
    }

    return null
  }

  /**
   * Validate an object against a set of rules
   * @param data - Data to validate
   * @param rules - Validation rules object
   * @returns Validation errors object
   */
  static validateObject(data: any, rules: Record<string, ValidationRule>): ValidationErrors {
    const errors: ValidationErrors = {}

    Object.keys(rules).forEach((field) => {
      const error = this.validateField(data[field], rules[field], field)
      if (error) {
        errors[field] = error
      }
    })

    return errors
  }

  /**
   * Check if email is valid
   * @param email - Email to validate
   * @returns True if valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Check if phone number is valid
   * @param phone - Phone number to validate
   * @returns True if valid
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  /**
   * Validate customer data
   * @param data - Customer data to validate
   * @returns Validation errors
   */
  static validateCustomer(data: CreateCustomerRequest): ValidationErrors {
    const rules: Record<string, ValidationRule> = {
      name: { required: true, minLength: 2, maxLength: 100 },
      email: { email: true, maxLength: 255 },
      phone: { phone: true, maxLength: 20 },
      address: { maxLength: 500 },
      city: { maxLength: 100 },
      country: { maxLength: 100 },
      billing_address: { maxLength: 500 },
    }

    return this.validateObject(data, rules)
  }

  /**
   * Validate tax data
   * @param data - Tax data to validate
   * @returns Validation errors
   */
  static validateTax(data: CreateTaxRequest): ValidationErrors {
    const rules: Record<string, ValidationRule> = {
      name: { required: true, minLength: 2, maxLength: 100 },
      percentage: {
        required: true,
        min: 0,
        max: 100,
        custom: (value) => {
          if (typeof value !== 'number' || isNaN(value)) {
            return 'Percentage must be a valid number'
          }
          return null
        },
      },
    }

    return this.validateObject(data, rules)
  }

  /**
   * Validate quote data
   * @param data - Quote data to validate
   * @returns Validation errors
   */
  static validateQuote(data: CreateQuoteRequest): ValidationErrors {
    const rules: Record<string, ValidationRule> = {
      customer_id: { required: true },
      issue_date: { required: true },
      total: { required: true, min: 0 },
      tax_total: { required: true, min: 0 },
      items: {
        required: true,
        custom: (items) => {
          if (!Array.isArray(items) || items.length === 0) {
            return 'At least one item is required'
          }
          return null
        },
      },
    }

    const errors = this.validateObject(data, rules)

    // Validate quote items
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item, index) => {
        if (!item.package_id) {
          errors[`items.${index}.package_id`] = 'Package is required'
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors[`items.${index}.unit_price`] = 'Unit price must be greater than 0'
        }
        if (item.discount < 0) {
          errors[`items.${index}.discount`] = 'Discount cannot be negative'
        }
      })
    }

    return errors
  }

  /**
   * Validate invoice data
   * @param data - Invoice data to validate
   * @returns Validation errors
   */
  static validateInvoice(data: CreateInvoiceRequest): ValidationErrors {
    const rules: Record<string, ValidationRule> = {
      customer_id: { required: true },
      issue_date: { required: true },
      due_date: { required: true },
      total: { required: true, min: 0 },
      tax_total: { required: true, min: 0 },
      items: {
        required: true,
        custom: (items) => {
          if (!Array.isArray(items) || items.length === 0) {
            return 'At least one item is required'
          }
          return null
        },
      },
    }

    const errors = this.validateObject(data, rules)

    // Validate due date is after issue date
    if (data.issue_date && data.due_date) {
      const issueDate = new Date(data.issue_date)
      const dueDate = new Date(data.due_date)
      if (dueDate <= issueDate) {
        errors.due_date = 'Due date must be after issue date'
      }
    }

    // Validate invoice items
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item, index) => {
        if (!item.package_id) {
          errors[`items.${index}.package_id`] = 'Package is required'
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors[`items.${index}.unit_price`] = 'Unit price must be greater than 0'
        }
        if (item.discount < 0) {
          errors[`items.${index}.discount`] = 'Discount cannot be negative'
        }
      })
    }

    return errors
  }

  /**
   * Validate payment data
   * @param data - Payment data to validate
   * @returns Validation errors
   */
  static validatePayment(data: CreatePaymentRequest): ValidationErrors {
    const rules: Record<string, ValidationRule> = {
      invoice_id: { required: true },
      amount: { required: true, min: 0.01 },
      payment_method: { required: true },
      payment_date: { required: true },
      reference_number: { maxLength: 100 },
      notes: { maxLength: 500 },
    }

    const errors = this.validateObject(data, rules)

    // Validate payment date is not in the future
    if (data.payment_date) {
      const paymentDate = new Date(data.payment_date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today

      if (paymentDate > today) {
        errors.payment_date = 'Payment date cannot be in the future'
      }
    }

    return errors
  }

  /**
   * Check if validation errors object is empty
   * @param errors - Validation errors object
   * @returns True if no errors
   */
  static isValid(errors: ValidationErrors): boolean {
    return Object.keys(errors).length === 0
  }

  /**
   * Get first error message from errors object
   * @param errors - Validation errors object
   * @returns First error message or null
   */
  static getFirstError(errors: ValidationErrors): string | null {
    const keys = Object.keys(errors)
    return keys.length > 0 ? errors[keys[0]] : null
  }
}

/**
 * Debounce function for real-time validation
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: number

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait) as any
  }
}
