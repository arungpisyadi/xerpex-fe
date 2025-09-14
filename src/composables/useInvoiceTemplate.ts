import { computed } from 'vue';
import type { Invoice } from '../types/invoice.types';
import { useGlobalCompanySettings } from './useCompanySettings';

/**
 * Centralized Invoice Template Service
 * Provides consistent HTML generation for invoices across all components
 */
export function useInvoiceTemplate() {
  const { getInvoiceDisplaySettings, getInvoiceDisplaySettingsSync } = useGlobalCompanySettings();

  /**
   * Generate consistent invoice HTML for preview display
   * @param invoiceData - Invoice data object
   * @param companyData - Optional company data (if already loaded)
   * @returns HTML string for invoice display
   */
  const generatePreviewHTML = (invoiceData: Invoice, companyData?: any): string => {
    console.log('[useInvoiceTemplate] Generating preview HTML for invoice:', invoiceData?.invoice_number);

    if (!invoiceData) {
      console.error('[useInvoiceTemplate] Invoice data is null or undefined:', invoiceData);
      return `
        <div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #dc3545;">Invoice data is incomplete</h3>
          <p>Please check if the invoice data was loaded correctly.</p>
        </div>
      `;
    }

    // Use provided company data or get sync version with fallbacks
    const settings = companyData || getInvoiceDisplaySettingsSync();
    console.log('[useInvoiceTemplate] Using company settings:', settings);
    // Add robust data handling with fallbacks
    const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
    const total = Number(invoiceData.total || 0);
    const taxTotal = Number(invoiceData.tax_total || 0);
    const subtotal = Math.max(0, total - taxTotal).toFixed(2);

    console.log('[useInvoiceTemplate] Processing invoice data:', {
      invoice_number: invoiceData.invoice_number,
      items_count: items.length,
      total,
      taxTotal,
      subtotal
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceData.invoice_number}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background-color: #ffffff;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
        }

        .invoice-container {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
        }

        .company-info h1 {
            font-size: 28px;
            color: #007bff;
            margin-bottom: 10px;
        }

        .company-info p {
            margin: 3px 0;
            color: #666;
        }

        .invoice-title {
            text-align: right;
        }

        .invoice-title h2 {
            font-size: 42px;
            color: #007bff;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
        }

        .invoice-details div {
            display: flex;
            flex-direction: column;
        }

        .invoice-details strong {
            color: #007bff;
            margin-bottom: 5px;
        }

        .customer-details {
            margin-bottom: 30px;
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
        }

        .customer-details h3 {
            color: #007bff;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .customer-details p {
            font-size: 16px;
            color: #333;
        }

        .customer-details .customer-address {
            font-size: 13px;
            font-style: italic;
            color: #666;
            margin-top: 8px;
            line-height: 1.4;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: #fff;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .items-table th {
            background-color: #007bff;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }

        .items-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
        }

        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .items-table tr:hover {
            background-color: #e3f2fd;
        }

        .totals {
            text-align: right;
            margin-bottom: 30px;
        }

        .totals-table {
            margin-left: auto;
            border-collapse: collapse;
            min-width: 300px;
        }

        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #e9ecef;
        }

        .totals-table .label {
            font-weight: 600;
            color: #666;
        }

        .totals-table .total-row {
            background-color: #007bff;
            color: white;
            font-weight: 700;
            font-size: 16px;
        }

        .payment-terms, .notes {
            margin-bottom: 25px;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }

        .payment-terms h4, .notes h4 {
            color: #007bff;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .footer {
            text-align: center;
            border-top: 2px solid #e9ecef;
            padding-top: 20px;
            color: #666;
            font-style: italic;
            font-size: 16px;
        }

        @media print {
            body {
                padding: 0;
                background-color: white;
            }

            .invoice-container {
                border: none;
                box-shadow: none;
                padding: 20px;
            }

            .items-table tr:hover {
                background-color: transparent;
            }
        }

        @page {
            size: A4;
            margin: 1cm;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="company-info">
                <h1>${settings.companyName || 'Company Name Not Set'}</h1>
                <p>${settings.companyAddress || 'Address Not Set'}</p>
                <p>Phone: ${settings.companyPhone || 'Phone Not Set'}</p>
                <p>Email: ${settings.companyEmail || 'Email Not Set'}</p>
            </div>
            <div class="invoice-title">
                <h2>INVOICE</h2>
            </div>
        </div>

        <div class="invoice-details">
            <div>
                <strong>Invoice #:</strong>
                <span>${invoiceData.invoice_number || 'N/A'}</span>
            </div>
            <div>
                <strong>Issue Date:</strong>
                <span>${invoiceData.issue_date || 'N/A'}</span>
            </div>
            <div>
                <strong>Due Date:</strong>
                <span>${invoiceData.due_date || 'N/A'}</span>
            </div>
        </div>

        <div class="customer-details">
            <h3>Bill To:</h3>
            <p>${invoiceData.customer_name || 'N/A'}</p>
            ${invoiceData.billing_address ?
                `<div class="customer-address">${invoiceData.billing_address}</div>` :
                ''
            }
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Package</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Line Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.length > 0 ? items.map(item => `
                    <tr>
                        <td>${item.package_name || 'N/A'}</td>
                        <td>$${Number(item.unit_price || 0).toFixed(2)}</td>
                        <td>$${Number(item.discount || 0).toFixed(2)}</td>
                        <td>$${Number(item.line_total || 0).toFixed(2)}</td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #666; font-style: italic;">No items found</td>
                    </tr>
                `}
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal:</td>
                    <td>$${subtotal}</td>
                </tr>
                <tr>
                    <td class="label">Tax:</td>
                    <td>$${taxTotal.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td>$${total.toFixed(2)}</td>
                </tr>
            </table>
        </div>

        ${invoiceData.payment_terms ? `
            <div class="payment-terms">
                <h4>Payment Terms:</h4>
                <p>${invoiceData.payment_terms}</p>
            </div>
        ` : ''}

        ${invoiceData.notes ? `
            <div class="notes">
                <h4>Notes:</h4>
                <p>${invoiceData.notes}</p>
            </div>
        ` : ''}

        <div class="payment-info" style="margin-bottom: 25px; background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff;">
            <p style="font-style: italic; color: #333; margin: 0; line-height: 1.6;">
                Pembayaran sah hanya pembayaran yang dilakukan melalui rekening di bawah sebagai rekening resmi <strong>${settings.companyName || 'Company Name Not Set'}</strong><br>
                Bank: <strong>${settings.bankName || 'Bank Name Not Set'}</strong><br>
                Nomor Rekening: <strong>${settings.bankAccountNumber || 'Account Number Not Set'}</strong><br>
                Nama Pemilik Rekening: <strong>${settings.bankAccountHolderName || 'Account Holder Name Not Set'}</strong>
            </p>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  /**
   * Generate print-optimized invoice HTML
   * @param invoiceData - Invoice data object
   * @param companyData - Optional company data (if already loaded)
   * @returns HTML string optimized for printing
   */
  const generatePrintHTML = (invoiceData: Invoice, companyData?: any): string => {
    console.log('[useInvoiceTemplate] Generating print HTML for invoice:', invoiceData?.invoice_number);

    if (!invoiceData) {
      console.error('[useInvoiceTemplate] Invoice data is null or undefined:', invoiceData);
      return '<div style="padding: 20px; text-align: center;"><h3>Invoice data is incomplete</h3></div>';
    }

    // Use provided company data or get sync version with fallbacks
    const settings = companyData || getInvoiceDisplaySettingsSync();
    console.log('[useInvoiceTemplate] Using company settings for print:', settings);
    // Add robust data handling with fallbacks
    const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
    const total = Number(invoiceData.total || 0);
    const taxTotal = Number(invoiceData.tax_total || 0);
    const subtotal = Math.max(0, total - taxTotal).toFixed(2);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceData.invoice_number} - Print</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background-color: #ffffff;
            padding: 0;
            margin: 0;
        }

        .invoice-container {
            width: 100%;
            max-width: none;
            padding: 20px;
            background-color: #fff;
        }

        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }

        .company-info h1 {
            font-size: 24px;
            color: #000;
            margin-bottom: 8px;
            font-weight: bold;
        }

        .company-info p {
            margin: 2px 0;
            color: #333;
            font-size: 11px;
        }

        .invoice-title {
            text-align: right;
        }

        .invoice-title h2 {
            font-size: 36px;
            color: #000;
            margin: 0;
            font-weight: bold;
        }

        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
            background-color: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
        }

        .invoice-details div {
            display: flex;
            flex-direction: column;
        }

        .invoice-details strong {
            color: #000;
            margin-bottom: 3px;
            font-size: 11px;
        }

        .invoice-details span {
            font-size: 12px;
            color: #333;
        }

        .customer-details {
            margin-bottom: 25px;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
        }

        .customer-details h3 {
            color: #000;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .customer-details p {
            font-size: 12px;
            color: #333;
        }

        .customer-details .customer-address {
            font-size: 10px;
            font-style: italic;
            color: #666;
            margin-top: 6px;
            line-height: 1.4;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            border: 1px solid #000;
        }

        .items-table th {
            background-color: #000;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #000;
        }

        .items-table td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            vertical-align: top;
            font-size: 11px;
        }

        .items-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .totals {
            text-align: right;
            margin-bottom: 25px;
        }

        .totals-table {
            margin-left: auto;
            border-collapse: collapse;
            min-width: 250px;
            border: 1px solid #000;
        }

        .totals-table td {
            padding: 8px 12px;
            border: 1px solid #ddd;
            font-size: 12px;
        }

        .totals-table .label {
            font-weight: bold;
            color: #000;
            background-color: #f8f9fa;
        }

        .totals-table .total-row {
            background-color: #000;
            color: white;
            font-weight: bold;
            font-size: 13px;
        }

        .payment-terms, .notes {
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
            border-left: 3px solid #000;
        }

        .payment-terms h4, .notes h4 {
            color: #000;
            margin-bottom: 8px;
            font-size: 12px;
        }

        .payment-terms p, .notes p {
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }

        .footer {
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 15px;
            color: #666;
            font-style: italic;
            font-size: 12px;
            margin-top: 30px;
        }

        /* Print-specific styles */
        @media print {
            body {
                padding: 0;
                margin: 0;
                background-color: white !important;
                font-size: 11px;
            }

            .invoice-container {
                padding: 15px;
                box-shadow: none;
                border: none;
            }

            .invoice-header {
                page-break-inside: avoid;
            }

            .items-table {
                page-break-inside: auto;
            }

            .items-table thead {
                display: table-header-group;
            }

            .items-table tbody {
                page-break-inside: auto;
            }

            .items-table tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }

            .totals {
                page-break-inside: avoid;
            }

            .footer {
                page-break-inside: avoid;
            }
        }

        @page {
            size: A4;
            margin: 0.5cm;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="company-info">
                <h1>${settings.companyName || 'Company Name Not Set'}</h1>
                <p>${settings.companyAddress || 'Address Not Set'}</p>
                <p>Phone: ${settings.companyPhone || 'Phone Not Set'}</p>
                <p>Email: ${settings.companyEmail || 'Email Not Set'}</p>
            </div>
            <div class="invoice-title">
                <h2>INVOICE</h2>
            </div>
        </div>

        <div class="invoice-details">
            <div>
                <strong>Invoice #:</strong>
                <span>${invoiceData.invoice_number || 'N/A'}</span>
            </div>
            <div>
                <strong>Issue Date:</strong>
                <span>${invoiceData.issue_date || 'N/A'}</span>
            </div>
            <div>
                <strong>Due Date:</strong>
                <span>${invoiceData.due_date || 'N/A'}</span>
            </div>
        </div>

        <div class="customer-details">
            <h3>Bill To:</h3>
            <p>${invoiceData.customer_name || 'N/A'}</p>
            ${invoiceData.billing_address ?
                `<div class="customer-address">${invoiceData.billing_address}</div>` :
                ''
            }
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Package</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Line Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.length > 0 ? items.map(item => `
                    <tr>
                        <td>${item.package_name || 'N/A'}</td>
                        <td>$${Number(item.unit_price || 0).toFixed(2)}</td>
                        <td>$${Number(item.discount || 0).toFixed(2)}</td>
                        <td>$${Number(item.line_total || 0).toFixed(2)}</td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #666; font-style: italic;">No items found</td>
                    </tr>
                `}
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal:</td>
                    <td>$${subtotal}</td>
                </tr>
                <tr>
                    <td class="label">Tax:</td>
                    <td>$${taxTotal.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td>$${total.toFixed(2)}</td>
                </tr>
            </table>
        </div>

        ${invoiceData.payment_terms ? `
            <div class="payment-terms">
                <h4>Payment Terms:</h4>
                <p>${invoiceData.payment_terms}</p>
            </div>
        ` : ''}

        ${invoiceData.notes ? `
            <div class="notes">
                <h4>Notes:</h4>
                <p>${invoiceData.notes}</p>
            </div>
        ` : ''}

        <div class="payment-info" style="margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border: 1px solid #ddd; border-left: 3px solid #000;">
            <p style="font-style: italic; color: #333; margin: 0; line-height: 1.4; font-size: 11px;">
                Pembayaran sah hanya pembayaran yang dilakukan melalui rekening di bawah sebagai rekening resmi <strong>${settings.companyName || 'Company Name Not Set'}</strong><br>
                Bank: <strong>${settings.bankName || 'Bank Name Not Set'}</strong><br>
                Nomor Rekening: <strong>${settings.bankAccountNumber || 'Account Number Not Set'}</strong><br>
                Nama Pemilik Rekening: <strong>${settings.bankAccountHolderName || 'Account Holder Name Not Set'}</strong>
            </p>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  /**
   * Validate invoice data before template generation
   * @param invoiceData - Invoice data to validate
   * @returns boolean indicating if data is valid
   */
  const validateInvoiceData = (invoiceData: any): invoiceData is Invoice => {
    if (!invoiceData) {
      console.error('Invoice data is null or undefined');
      return false;
    }

    if (!invoiceData.invoice_number) {
      console.error('Invoice number is missing');
      return false;
    }

    return true;
  };

  /**
   * Create blob URL for invoice preview
   * @param invoiceData - Invoice data
   * @param companyData - Optional company data (if already loaded)
   * @returns Blob URL string
   */
  const createPreviewBlobUrl = async (invoiceData: Invoice, companyData?: any): Promise<string> => {
    console.log('[useInvoiceTemplate] Creating preview blob URL for invoice:', invoiceData?.invoice_number);

    if (!validateInvoiceData(invoiceData)) {
      console.error('[useInvoiceTemplate] Invalid invoice data, cannot create blob URL');
      return '';
    }

    try {
      // Get company data if not provided
      const settings = companyData || await getInvoiceDisplaySettings();
      const htmlContent = generatePreviewHTML(invoiceData, settings);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      console.log('[useInvoiceTemplate] Successfully created blob URL:', url.substring(0, 50) + '...');
      return url;
    } catch (error) {
      console.error('[useInvoiceTemplate] Failed to create blob URL:', error);
      // Fallback to sync version if async fails
      const htmlContent = generatePreviewHTML(invoiceData);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }
  };

  return {
    // Template generation methods
    generatePreviewHTML,
    generatePrintHTML,

    // Utility methods
    validateInvoiceData,
    createPreviewBlobUrl,

    // Company settings access
    getInvoiceDisplaySettings,
    getInvoiceDisplaySettingsSync
  };
}
