import apiClient, { pdfApiClient } from './api.service'

const invoiceService = {
  /**
   * Get all invoices
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with invoices data
   */
  getInvoices(params = {}) {
    return apiClient.get('/invoices', { params })
  },

  /**
   * Get invoice by ID
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with invoice data
   */
  getInvoice(id) {
    return apiClient.get(`/invoices/${id}`)
  },

  /**
   * Create a new invoice
   * @param {Object} data - Invoice data
   * @returns {Promise} - Promise with created invoice
   */
  createInvoice(data) {
    return apiClient.post('/invoices', data)
  },

  /**
   * Update an invoice
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Invoice data to update
   * @returns {Promise} - Promise with updated invoice
   */
  updateInvoice(id, data) {
    return apiClient.put(`/invoices/${id}`, data)
  },

  /**
   * Delete an invoice
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteInvoice(id) {
    return apiClient.delete(`/invoices/${id}`)
  },

  /**
   * Generate PDF for an invoice
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with PDF data
   */
  generatePdf(id) {
    return pdfApiClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
      timeout: 30000, // 30 second timeout
    })
  },

  /**
   * Send invoice by email
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Email data (recipient, subject, message)
   * @returns {Promise} - Promise with sending result
   */
  sendByEmail(id, data) {
    return apiClient.post(`/invoices/${id}/send`, data)
  },

  /**
   * Mark invoice as paid
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Payment details
   * @returns {Promise} - Promise with updated invoice
   */
  markAsPaid(id, data) {
    return apiClient.post(`/invoices/${id}/mark-paid`, data)
  },

  /**
   * Update invoice status
   * @param {string|number} id - Invoice ID
   * @param {string} status - New status
   * @returns {Promise} - Promise with updated invoice
   */
  updateInvoiceStatus(id, status) {
    return apiClient.patch(`/invoices/${id}/status`, { status })
  },

  /**
   * Update invoice notes
   * @param {string|number} id - Invoice ID
   * @param {string} notes - Notes to update
   * @returns {Promise} - Promise with updated invoice
   */
  updateInvoiceNotes(id, notes) {
    return apiClient.patch(`/invoices/${id}/notes`, { notes })
  },

  /**
   * Validate PDF binary data by checking magic bytes
   * @param {ArrayBuffer|Uint8Array} data - Binary data to validate
   * @returns {Object} - Validation result with details
   */
  validatePdfData(data) {
    try {
      let bytes

      if (data instanceof ArrayBuffer) {
        bytes = new Uint8Array(data)
      } else if (data instanceof Uint8Array) {
        bytes = data
      } else {
        return {
          isValid: false,
          error: 'Invalid data type for PDF validation',
          details: { dataType: typeof data, constructor: data.constructor.name },
        }
      }

      // Check if we have enough bytes
      if (bytes.length < 4) {
        return {
          isValid: false,
          error: 'Insufficient data length for PDF validation',
          details: { length: bytes.length },
        }
      }

      // PDF files should start with "%PDF" (0x25, 0x50, 0x44, 0x46)
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]
      const headerBytes = Array.from(bytes.slice(0, 4))
      const isValidPdf = pdfSignature.every((byte, index) => byte === headerBytes[index])

      // Get first 20 bytes for debugging
      const first20Bytes = Array.from(bytes.slice(0, Math.min(20, bytes.length)))
      const headerString = String.fromCharCode(...first20Bytes.filter((b) => b >= 32 && b <= 126))

      return {
        isValid: isValidPdf,
        details: {
          totalSize: bytes.length,
          headerBytes: headerBytes,
          expectedBytes: pdfSignature,
          first20Bytes: first20Bytes,
          headerString: headerString,
          startsWithPDF: headerString.startsWith('%PDF'),
        },
      }
    } catch (error) {
      return {
        isValid: false,
        error: `PDF validation failed: ${error.message}`,
        details: { originalError: error },
      }
    }
  },

  /**
   * Convert blob to ArrayBuffer for inspection
   * @param {Blob} blob - Blob to convert
   * @returns {Promise<ArrayBuffer>} - Promise with ArrayBuffer
   */
  async blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read blob as ArrayBuffer'))
      reader.readAsArrayBuffer(blob)
    })
  },

  /**
   * Download invoice PDF with enhanced debugging and validation
   * @param {string|number} id - Invoice ID
   * @param {string} filename - Optional filename
   * @returns {Promise} - Promise with void
   */
  async downloadInvoice(id, filename) {
    try {
      console.log(`[PDF-DEBUG] Starting PDF download for invoice ${id}`)
      console.log('[PDF-DEBUG] pdfApiClient configuration:', {
        baseURL: pdfApiClient.defaults.baseURL,
        headers: pdfApiClient.defaults.headers,
        timeout: pdfApiClient.defaults.timeout,
      })

      const response = await pdfApiClient.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
        timeout: 30000,
      })

      console.log('[PDF-DEBUG] Raw API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers['content-type'],
          'content-length': response.headers['content-length'],
          'content-disposition': response.headers['content-disposition'],
          'transfer-encoding': response.headers['transfer-encoding'],
        },
        data: {
          type: typeof response.data,
          size: response.data.size,
          constructor: response.data.constructor.name,
          lastModified: response.data.lastModified || 'N/A',
        },
      })

      // Validate response
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF response received from server')
      }

      // Convert blob to ArrayBuffer for detailed inspection
      console.log('[PDF-DEBUG] Converting blob to ArrayBuffer for inspection...')
      const arrayBuffer = await this.blobToArrayBuffer(response.data)

      // Validate PDF binary data
      const validation = this.validatePdfData(arrayBuffer)
      console.log('[PDF-DEBUG] PDF Data Validation:', validation)

      if (!validation.isValid) {
        console.error('[PDF-DEBUG] Invalid PDF data received:', validation)

        // Log additional debugging info for corrupted data
        if (validation.details) {
          console.log('[PDF-DEBUG] Corruption details:', {
            expectedHeader: '%PDF',
            actualHeader: validation.details.headerString,
            first20Bytes: validation.details.first20Bytes,
            first20AsHex: validation.details.first20Bytes
              ?.map((b) => '0x' + b.toString(16).padStart(2, '0'))
              .join(' '),
          })
        }

        throw new Error(`Corrupted PDF data received: ${validation.error || 'Invalid PDF format'}`)
      }

      console.log('[PDF-DEBUG] PDF validation passed - creating download blob')

      // Create blob with explicit PDF MIME type (using original response data)
      const pdfBlob = new Blob([response.data], {
        type: 'application/pdf',
      })

      console.log('[PDF-DEBUG] Created PDF blob:', {
        size: pdfBlob.size,
        type: pdfBlob.type,
        originalSize: response.data.size,
        sizesMatch: pdfBlob.size === response.data.size,
      })

      // Create object URL and download link
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.download = filename || `invoice-${id}.pdf`
      link.setAttribute('download', filename || `invoice-${id}.pdf`)

      console.log('[PDF-DEBUG] Created download link:', {
        href: url.substring(0, 50) + '...',
        download: link.download,
        urlLength: url.length,
      })

      // Add to DOM and trigger download
      document.body.appendChild(link)

      // Use multiple download methods for better compatibility
      try {
        // Method 1: Standard click
        link.click()

        // Method 2: Dispatch event as fallback
        setTimeout(() => {
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false,
          })
          link.dispatchEvent(clickEvent)
        }, 50)
      } catch (clickError) {
        console.warn('[PDF-DEBUG] Click method failed, trying alternative:', clickError)

        // Method 3: Direct window.open as last resort
        window.open(url, '_blank')
      }

      // Clean up after download
      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link)
          }
          window.URL.revokeObjectURL(url)
          console.log('[PDF-DEBUG] PDF download cleanup completed')
        } catch (cleanupError) {
          console.warn('[PDF-DEBUG] Cleanup warning:', cleanupError)
        }
      }, 1000) // Increased timeout for slower systems

      console.log('[PDF-DEBUG] PDF download initiated successfully')

      // Return success details for caller
      return {
        success: true,
        filename: link.download,
        size: pdfBlob.size,
        validation: validation,
      }
    } catch (error) {
      console.error('[PDF-DEBUG] PDF download failed:', {
        error: error.message,
        stack: error.stack,
        invoiceId: id,
        timestamp: new Date().toISOString(),
      })

      // Enhanced error handling with specific scenarios
      let userMessage = 'PDF download failed'

      if (error.message?.includes('timeout')) {
        userMessage = 'PDF download timed out. The server may be slow - please try again.'
      } else if (error.message?.includes('404')) {
        userMessage = 'Invoice PDF not found. Please ensure the invoice exists and try again.'
      } else if (error.message?.includes('403')) {
        userMessage = 'Access denied. You may not have permission to download this invoice.'
      } else if (error.message?.includes('401')) {
        userMessage = 'Authentication required. Please sign in again and try downloading.'
      } else if (error.message?.includes('500')) {
        userMessage = 'Server error while generating PDF. Please try again or contact support.'
      } else if (error.message?.includes('Corrupted PDF')) {
        userMessage =
          'The PDF file appears to be corrupted. Please contact support with invoice ID: ' + id
      } else if (error.message?.includes('Empty PDF')) {
        userMessage = 'No PDF data received from server. Please try again or contact support.'
      } else if (error.message?.includes('network')) {
        userMessage = 'Network error occurred. Please check your connection and try again.'
      }

      throw new Error(userMessage)
    }
  },

  /**
   * Test PDF download with alternative approach using arraybuffer
   * @param {string|number} id - Invoice ID
   * @param {string} filename - Optional filename
   * @returns {Promise} - Promise with void
   */
  async downloadInvoiceAlternative(id, filename) {
    try {
      console.log(`[PDF-ALT] Starting alternative PDF download for invoice ${id}`)

      const response = await pdfApiClient.get(`/invoices/${id}/pdf`, {
        responseType: 'arraybuffer', // Use arraybuffer instead of blob
        timeout: 30000,
      })

      console.log('[PDF-ALT] ArrayBuffer Response:', {
        status: response.status,
        contentType: response.headers['content-type'],
        dataType: typeof response.data,
        dataSize: response.data.byteLength,
        constructor: response.data.constructor.name,
      })

      if (!response.data || response.data.byteLength === 0) {
        throw new Error('Empty PDF response received')
      }

      // Validate PDF data directly
      const validation = this.validatePdfData(response.data)
      console.log('[PDF-ALT] PDF Validation:', validation)

      if (!validation.isValid) {
        throw new Error(`Corrupted PDF data: ${validation.error}`)
      }

      // Create blob from arraybuffer
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })

      console.log('[PDF-ALT] Created blob from ArrayBuffer:', {
        blobSize: pdfBlob.size,
        arrayBufferSize: response.data.byteLength,
        sizesMatch: pdfBlob.size === response.data.byteLength,
      })

      // Use the same download logic
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.download = filename || `invoice-${id}.pdf`

      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)

      console.log('[PDF-ALT] Alternative PDF download completed successfully')
    } catch (error) {
      console.error('[PDF-ALT] Alternative PDF download failed:', error)
      throw error
    }
  },

  /**
   * Send invoice by email
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Email data (optional)
   * @returns {Promise} - Promise with sending result
   */
  sendInvoice(id, data) {
    return apiClient.post(`/invoices/${id}/send`, data || {})
  },

  /**
   * Get invoice history/activity log
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with invoice history data
   */
  async getInvoiceHistory(id) {
    try {
      const response = await apiClient.get(`/invoices/${id}/history`)
      return response.data
    } catch (error) {
      // If endpoint doesn't exist, return empty history
      console.warn('Invoice history endpoint not available:', error)
      return { items: [] }
    }
  },
}

export default invoiceService
