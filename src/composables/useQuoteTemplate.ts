import { computed } from 'vue';
import type { Quote } from '../types/quote.types';
import { useGlobalCompanySettings } from './useCompanySettings';
import { formatIDR } from '../utils/number-formatter';

/**
 * Centralized Quotation Template Service
 * Provides consistent HTML generation for Quotations across all components
 */
export function useQuoteTemplate() {
  const { getInvoiceDisplaySettings, getInvoiceDisplaySettingsSync } = useGlobalCompanySettings();

  /**
   * Generate consistent Quotation HTML for preview display
   * @param quoteData - Quotation data object
   * @param companyData - Optional company data (if already loaded)
   * @returns HTML string for Quotation display
   */
  const generatePreviewHTML = (quoteData: Quote, companyData?: any): string => {
    console.log('[useQuoteTemplate] Generating preview HTML for Quotation:', quoteData?.quote_number);

    if (!quoteData) {
      console.error('[useQuoteTemplate] Quotation data is null or undefined:', quoteData);
      return `
        <div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #dc3545;">Quotation data is incomplete</h3>
          <p>Please check if the Quotation data was loaded correctly.</p>
        </div>
      `;
    }

    // Use provided company data or get sync version with fallbacks
    const settings = companyData || getInvoiceDisplaySettingsSync();
    console.log('[useQuoteTemplate] Using company settings:', settings);

    // Add robust data handling with fallbacks
    const items = Array.isArray(quoteData.items) ? quoteData.items : [];
    const total = Number(quoteData.total || 0);
    const taxTotal = Number((quoteData as any).tax_total || 0);
    const customer = quoteData.customer || {} as any;
    const villas = Array.isArray((quoteData as any).villas) ? (quoteData as any).villas : [];

    // Calculate total discount
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(item.discount as any) || 0), 0);

    // Calculate validity period
    const validityText = quoteData.expiry_date ?
      `Valid until ${quoteData.expiry_date}` :
      'No expiry date set';

    console.log('[useQuoteTemplate] Processing Quotation data:', {
      quote_number: quoteData.quote_number,
      items_count: items.length,
      total,
      status: quoteData.status,
      expiry_date: quoteData.expiry_date
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation ${quoteData.quote_number}</title>
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

        .quote-container {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .quote-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
        }

        .company-logo-section {
            display: flex;
            align-items: flex-start;
            gap: 20px;
        }

        .company-logo {
            max-height: 80px;
            width: auto;
        }

        .company-info h1 {
            font-size: 28px;
            color: #28a745;
            margin-bottom: 10px;
        }

        .company-info p {
            margin: 3px 0;
            color: #666;
        }

        .quote-title {
            text-align: right;
        }

        .quote-title h2 {
            font-size: 42px;
            color: #28a745;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .quote-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
        }

        .quote-details div {
            display: flex;
            flex-direction: column;
        }

        .quote-details strong {
            color: #28a745;
            margin-bottom: 5px;
        }

        .customer-villa-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .customer-details, .villa-details {
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
        }

        .customer-details h3, .villa-details h3 {
            color: #28a745;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .customer-details p, .villa-details p {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
        }

        .villa-item {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .villa-item:last-child {
            border-bottom: none;
        }

        .quote-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .quote-status.draft {
            background-color: #6c757d;
            color: white;
        }

        .quote-status.sent {
            background-color: #17a2b8;
            color: white;
        }

        .quote-status.accepted {
            background-color: #28a745;
            color: white;
        }

        .quote-status.declined {
            background-color: #dc3545;
            color: white;
        }

        .quote-status.expired {
            background-color: #ffc107;
            color: #212529;
        }

        .validity-notice {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 30px;
            color: #0c5460;
            font-weight: 500;
            text-align: center;
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
            background-color: #28a745;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }

        .items-table th.col-description {
            width: 35%;
        }

        .items-table th.col-pax {
            width: 10%;
            text-align: center;
        }

        .items-table th.col-price {
            width: 18%;
            text-align: right;
        }

        .items-table td.align-center {
            text-align: center;
        }

        .items-table td.align-right {
            text-align: right;
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
            background-color: #e8f5e8;
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
            background-color: #28a745;
            color: white;
            font-weight: 700;
            font-size: 16px;
        }

        .conversion-note {
            margin-bottom: 25px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-left: 4px solid #f39c12;
            padding: 20px;
            border-radius: 6px;
        }

        .conversion-note h4 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .conversion-note p {
            color: #856404;
            margin: 0;
            font-style: italic;
        }

        .footer {
            text-align: center;
            border-top: 2px solid #e9ecef;
            padding-top: 20px;
            color: #666;
            font-style: italic;
            font-size: 16px;
        }

        .rules-page {
            page-break-before: always;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .rules-page img {
            max-width: 100%;
            height: auto;
        }

        @media print {
            body {
                padding: 0;
                background-color: white;
            }

            .quote-container {
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
    <div class="quote-container">
        <div class="quote-header">
            <div class="company-logo-section">
                <img src="/images/logo/company.png" alt="Company Logo" class="company-logo" />
                <div class="company-info">
                    <h1>${settings.companyName || 'Company Name Not Set'}</h1>
                    <p>${settings.companyAddress || 'Address Not Set'}</p>
                    <p>Phone: ${settings.companyPhone || 'Phone Not Set'}</p>
                    <p>Email: ${settings.companyEmail || 'Email Not Set'}</p>
                </div>
            </div>
            <div class="quote-title">
                <h2>Quotation</h2>
            </div>
        </div>

        <div class="quote-status ${quoteData.status}">
            Status: ${quoteData.status.charAt(0).toUpperCase() + quoteData.status.slice(1)}
        </div>

        <div class="quote-details">
            <div>
                <strong>Quote #:</strong>
                <span>${quoteData.quote_number || 'N/A'}</span>
            </div>
            <div>
                <strong>Issue Date:</strong>
                <span>${quoteData.issue_date || 'N/A'}</span>
            </div>
            <div>
                <strong>Expiry Date:</strong>
                <span>${quoteData.expiry_date || 'Not Set'}</span>
            </div>
        </div>

        <div class="validity-notice">
            📅 ${validityText}
        </div>

        <div class="customer-villa-section">
            <div class="customer-details">
                <h3>Customer Details:</h3>
                <p><strong>${customer.name || 'N/A'}</strong></p>
                <p>${customer.address || customer.billing_address || 'Address is not available'}</p>
                <p>Phone: ${customer.phone_number || customer.phone || 'N/A'}</p>
                <p>Email: ${customer.email || 'N/A'}</p>
            </div>
            <div class="villa-details">
                <h3>Villas:</h3>
                ${villas.length > 0 ? villas.map((v: any) => `
                    <div class="villa-item">
                        <p><strong>${v.villa?.name || 'N/A'}</strong> - ${v.villa?.capacity || 'N/A'}</p>
                    </div>
                `).join('') : '<p>No villas assigned</p>'}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Package Name</th>
                    <th class="col-description">Description</th>
                    <th class="col-pax">PAX</th>
                    <th class="col-price">Unit Price</th>
                    <th class="col-price" style="width: 15%;">Discount</th>
                    <th class="col-price">Line Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.length > 0 ? items.map((item: any) => `
                    <tr>
                        <td>${item.package?.name || item.package_name || 'N/A'}</td>
                        <td>${item.package?.description || 'No description available'}</td>
                        <td class="align-center">${item.pax || 'N/A'}</td>
                        <td class="align-right">${formatIDR(item.unit_price)}</td>
                        <td class="align-right">${formatIDR(item.discount || 0)}</td>
                        <td class="align-right">${formatIDR(item.line_total)}</td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="6" style="text-align: center; color: #666; font-style: italic;">No items found</td>
                    </tr>
                `}
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label" style="background-color: #f8f9fa;">Total Discount:</td>
                    <td style="font-style: italic;">${formatIDR(totalDiscount)}</td>
                </tr>
                ${taxTotal > 0 ? `
                <tr>
                    <td class="label" style="background-color: #f8f9fa;">Tax:</td>
                    <td>${formatIDR(taxTotal)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td>${formatIDR(total)}</td>
                </tr>
            </table>
        </div>

        <div class="conversion-note">
            <h4>📋 Next Steps:</h4>
            <p>This Quotation can be converted to an invoice once accepted. All pricing and terms will be transferred automatically.</p>
        </div>

        <div class="footer">
            <p>Thank you for considering our services!</p>
        </div>
    </div>

    <div class="rules-page">
        <img src="/images/statics/rules.jpg" alt="Rules and Regulations" />
    </div>
</body>
</html>
    `;
  };

  /**
   * Generate print-optimized Quotation HTML
   * @param quoteData - Quote data object
   * @param companyData - Optional company data (if already loaded)
   * @returns HTML string optimized for printing
   */
  const generatePrintHTML = (quoteData: Quote, companyData?: any): string => {
    console.log('[useQuoteTemplate] Generating print HTML for quote:', quoteData?.quote_number);

    if (!quoteData) {
      console.error('[useQuoteTemplate] Quote data is null or undefined:', quoteData);
      return '<div style="padding: 20px; text-align: center;"><h3>Quote data is incomplete</h3></div>';
    }

    // Use provided company data or get sync version with fallbacks
    const settings = companyData || getInvoiceDisplaySettingsSync();
    console.log('[useQuoteTemplate] Using company settings for print:', settings);

    // Add robust data handling with fallbacks
    const items = Array.isArray(quoteData.items) ? quoteData.items : [];
    const total = Number(quoteData.total || 0);
    const taxTotal = Number((quoteData as any).tax_total || 0);
    const customer = quoteData.customer || {} as any;
    const villas = Array.isArray((quoteData as any).villas) ? (quoteData as any).villas : [];

    // Calculate total discount
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(item.discount as any) || 0), 0);

    // Calculate validity period
    const validityText = quoteData.expiry_date ?
      `Valid until ${quoteData.expiry_date}` :
      'No expiry date set';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation ${quoteData.quote_number} - Print</title>
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

        .quote-container {
            width: 100%;
            max-width: none;
            padding: 20px;
            background-color: #fff;
        }

        .quote-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }

        .company-logo-section {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }

        .company-logo {
            max-height: 70px;
            width: auto;
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

        .quote-title {
            text-align: right;
        }

        .quote-title h2 {
            font-size: 36px;
            color: #000;
            margin: 0;
            font-weight: bold;
        }

        .quote-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
            background-color: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
        }

        .quote-details div {
            display: flex;
            flex-direction: column;
        }

        .quote-details strong {
            color: #000;
            margin-bottom: 3px;
            font-size: 11px;
        }

        .quote-details span {
            font-size: 12px;
            color: #333;
        }

        .quote-status {
            display: inline-block;
            padding: 6px 12px;
            border: 2px solid #000;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 20px;
            background-color: #f8f9fa;
        }

        .validity-notice {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 12px;
            margin-bottom: 25px;
            color: #000;
            font-weight: 500;
            text-align: center;
            font-size: 11px;
        }

        .customer-villa-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
        }

        .customer-details, .villa-details {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
        }

        .customer-details h3, .villa-details h3 {
            color: #000;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .customer-details p, .villa-details p {
            font-size: 11px;
            color: #333;
            margin-bottom: 4px;
        }

        .villa-item {
            padding: 6px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .villa-item:last-child {
            border-bottom: none;
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
            font-size: 10px;
            border: 1px solid #000;
        }

        .items-table th.col-description {
            width: 35%;
        }

        .items-table th.col-pax {
            width: 10%;
            text-align: center;
        }

        .items-table th.col-price {
            width: 18%;
            text-align: right;
        }

        .items-table td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            vertical-align: top;
            font-size: 11px;
        }

        .items-table td.align-center {
            text-align: center;
        }

        .items-table td.align-right {
            text-align: right;
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

        .conversion-note {
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
            border-left: 3px solid #000;
        }

        .conversion-note h4 {
            color: #000;
            margin-bottom: 8px;
            font-size: 12px;
        }

        .conversion-note p {
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

        .rules-page {
            page-break-before: always;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .rules-page img {
            max-width: 100%;
            height: auto;
        }

        /* Print-specific styles */
        @media print {
            body {
                padding: 0;
                margin: 0;
                background-color: white !important;
                font-size: 11px;
            }

            .quote-container {
                padding: 15px;
                box-shadow: none;
                border: none;
            }

            .quote-header {
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
    <div class="quote-container">
        <div class="quote-header">
            <div class="company-logo-section">
                <img src="/images/logo/company.png" alt="Company Logo" class="company-logo" />
                <div class="company-info">
                    <h1>${settings.companyName || 'Company Name Not Set'}</h1>
                    <p>${settings.companyAddress || 'Address Not Set'}</p>
                    <p>Phone: ${settings.companyPhone || 'Phone Not Set'}</p>
                    <p>Email: ${settings.companyEmail || 'Email Not Set'}</p>
                </div>
            </div>
            <div class="quote-title">
                <h2>Quotation</h2>
            </div>
        </div>

        <div class="quote-status">
            Status: ${quoteData.status.charAt(0).toUpperCase() + quoteData.status.slice(1)}
        </div>

        <div class="quote-details">
            <div>
                <strong>Quotation #:</strong>
                <span>${quoteData.quote_number || 'N/A'}</span>
            </div>
            <div>
                <strong>Issue Date:</strong>
                <span>${quoteData.issue_date || 'N/A'}</span>
            </div>
            <div>
                <strong>Expiry Date:</strong>
                <span>${quoteData.expiry_date || 'Not Set'}</span>
            </div>
        </div>

        <div class="validity-notice">
            ${validityText}
        </div>

        <div class="customer-villa-section">
            <div class="customer-details">
                <h3>Customer Details:</h3>
                <p><strong>${customer.name || 'N/A'}</strong></p>
                <p>${customer.address || customer.billing_address || 'Address is not available'}</p>
                <p>Phone: ${customer.phone_number || customer.phone || 'N/A'}</p>
                <p>Email: ${customer.email || 'N/A'}</p>
            </div>
            <div class="villa-details">
                <h3>Villas:</h3>
                ${villas.length > 0 ? villas.map((v: any) => `
                    <div class="villa-item">
                        <p><strong>${v.villa?.name || 'N/A'}</strong> - ${v.villa?.capacity || 'N/A'}</p>
                    </div>
                `).join('') : '<p>No villas assigned</p>'}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Package Name</th>
                    <th class="col-description">Description</th>
                    <th class="col-pax">PAX</th>
                    <th class="col-price">Unit Price</th>
                    <th class="col-price" style="width: 15%;">Discount</th>
                    <th class="col-price">Line Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.length > 0 ? items.map((item: any) => `
                    <tr>
                        <td>${item.package?.name || item.package_name || 'N/A'}</td>
                        <td>${item.package?.description || 'No description available'}</td>
                        <td class="align-center">${item.pax || 'N/A'}</td>
                        <td class="align-right">${formatIDR(item.unit_price)}</td>
                        <td class="align-right">${formatIDR(item.discount || 0)}</td>
                        <td class="align-right">${formatIDR(item.line_total)}</td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="6" style="text-align: center; color: #666; font-style: italic;">No items found</td>
                    </tr>
                `}
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">Total Discount:</td>
                    <td style="font-style: italic;">${formatIDR(totalDiscount)}</td>
                </tr>
                ${taxTotal > 0 ? `
                <tr>
                    <td class="label">Tax:</td>
                    <td>${formatIDR(taxTotal)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td>${formatIDR(total)}</td>
                </tr>
            </table>
        </div>

        <div class="conversion-note">
            <h4>Next Steps:</h4>
            <p>This Quotation can be converted to an invoice once accepted. All pricing and terms will be transferred automatically.</p>
        </div>

        <div class="footer">
            <p>Thank you for considering our services!</p>
        </div>
    </div>

    <div class="rules-page">
        <img src="/images/statics/rules.jpg" alt="Rules and Regulations" />
    </div>
</body>
</html>
    `;
  };

  /**
   * Validate Quotation data before template generation
   * @param quoteData - Quote data to validate
   * @returns boolean indicating if data is valid
   */
  const validateQuoteData = (quoteData: any): quoteData is Quote => {
    if (!quoteData) {
      console.error('Quote data is null or undefined');
      return false;
    }

    if (!quoteData.quote_number) {
      console.error('Quote number is missing');
      return false;
    }

    return true;
  };

  /**
   * Create blob URL for quote preview
   * @param quoteData - Quote data
   * @param companyData - Optional company data (if already loaded)
   * @returns Blob URL string
   */
  const createPreviewBlobUrl = async (quoteData: Quote, companyData?: any): Promise<string> => {
    console.log('[useQuoteTemplate] Creating preview blob URL for quote:', quoteData?.quote_number);

    if (!validateQuoteData(quoteData)) {
      console.error('[useQuoteTemplate] Invalid quote data, cannot create blob URL');
      return '';
    }

    try {
      // Get company data if not provided
      const settings = companyData || await getInvoiceDisplaySettings();
      const htmlContent = generatePreviewHTML(quoteData, settings);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      console.log('[useQuoteTemplate] Successfully created blob URL:', url.substring(0, 50) + '...');
      return url;
    } catch (error) {
      console.error('[useQuoteTemplate] Failed to create blob URL:', error);
      // Fallback to sync version if async fails
      const htmlContent = generatePreviewHTML(quoteData);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }
  };

  return {
    // Template generation methods
    generatePreviewHTML,
    generatePrintHTML,

    // Utility methods
    validateQuoteData,
    createPreviewBlobUrl,

    // Company settings access
    getInvoiceDisplaySettings,
    getInvoiceDisplaySettingsSync
  };
}
