import { ref, computed } from 'vue';
import customerService from '../services/customer.service';
import quoteService from '../services/quote.service';
import invoiceService from '../services/invoice.service';
import paymentService from '../services/payment.service';
import taxService from '../services/tax.service';
import type { Customer } from '../types/customer.types';
import type { Quote } from '../types/quote.types';
import type { Invoice } from '../types/invoice.types';
import type { Payment } from '../types/payment.types';
import type { TaxCalculationResponse } from '../types/tax.types';
import { handleError } from '../utils/errorHandler';

/**
 * Vue.js Composition API for XerpeX ERP Invoicing System
 * Implements the complete quote-to-payment workflow
 */
export function useInvoicing() {
  const invoices = ref<Invoice[]>([]);
  const quotes = ref<Quote[]>([]);
  const customers = ref<Customer[]>([]);
  const payments = ref<Payment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const overdueInvoices = computed(() =>
    invoices.value.filter(invoice => invoice.status === 'overdue')
  );

  const draftQuotes = computed(() =>
    quotes.value.filter(quote => quote.status === 'draft')
  );

  const sentQuotes = computed(() =>
    quotes.value.filter(quote => quote.status === 'sent')
  );

  const acceptedQuotes = computed(() =>
    quotes.value.filter(quote => quote.status === 'accepted')
  );

  const pendingPayments = computed(() =>
    payments.value.filter(payment => payment.status === 'pending')
  );

  // Customer management
  const fetchCustomers = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await customerService.getCustomers(filters);
      customers.value = response.customers;
      return response;
    } catch (err) {
      error.value = handleError(err, 'fetchCustomers').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCustomer = async (customerData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const customer = await customerService.createCustomer(customerData);
      customers.value.push(customer);
      return customer;
    } catch (err) {
      error.value = handleError(err, 'createCustomer').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const activateCustomer = async (customerId: number) => {
    try {
      const customer = await customerService.activateCustomer(customerId);
      const index = customers.value.findIndex(c => c.id === customerId);
      if (index !== -1) {
        customers.value[index] = customer;
      }
      return customer;
    } catch (err) {
      error.value = handleError(err, 'activateCustomer').message;
      throw err;
    }
  };

  // Quote management
  const fetchQuotes = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await quoteService.getQuotes(filters);
      quotes.value = response.quotes;
      return response;
    } catch (err) {
      error.value = handleError(err, 'fetchQuotes').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createQuote = async (quoteData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const quote = await quoteService.createQuote(quoteData);
      quotes.value.push(quote);
      return quote;
    } catch (err) {
      error.value = handleError(err, 'createQuote').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateQuote = async (quoteId: number, quoteData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const quote = await quoteService.updateQuote(quoteId, quoteData);
      // Update local quote in the array
      const index = quotes.value.findIndex(q => q.id === quoteId);
      if (index !== -1) {
        quotes.value[index] = quote;
      }
      return quote;
    } catch (err) {
      error.value = handleError(err, 'updateQuote').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const sendQuote = async (quoteId: number) => {
    try {
      const result = await quoteService.sendQuote(quoteId);
      // Update local quote status
      const index = quotes.value.findIndex(q => q.id === quoteId);
      if (index !== -1 && result.quote) {
        quotes.value[index] = result.quote;
      }
      return result;
    } catch (err) {
      error.value = handleError(err, 'sendQuote').message;
      throw err;
    }
  };

  const acceptQuote = async (quoteId: number) => {
    try {
      const result = await quoteService.acceptQuote(quoteId);
      // Update local quote status
      const index = quotes.value.findIndex(q => q.id === quoteId);
      if (index !== -1 && result.quote) {
        quotes.value[index] = result.quote;
      }
      return result;
    } catch (err) {
      error.value = handleError(err, 'acceptQuote').message;
      throw err;
    }
  };

  const convertQuoteToInvoice = async (quoteId: number, conversionData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const invoice = await quoteService.convertToInvoice(quoteId, conversionData);
      invoices.value.push(invoice);
      return invoice;
    } catch (err) {
      error.value = handleError(err, 'convertQuoteToInvoice').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Invoice management
  const fetchInvoices = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await invoiceService.getInvoices(filters);
      invoices.value = response.invoices;
      return response;
    } catch (err) {
      error.value = handleError(err, 'fetchInvoices').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createInvoice = async (invoiceData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const invoice = await invoiceService.createInvoice(invoiceData);
      invoices.value.push(invoice);
      return invoice;
    } catch (err) {
      error.value = handleError(err, 'createInvoice').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const sendInvoice = async (invoiceId: number, emailData?: any) => {
    try {
      const result = await invoiceService.sendInvoice(invoiceId, emailData);
      // Update local invoice status
      const index = invoices.value.findIndex(i => i.id === invoiceId);
      if (index !== -1 && result.invoice) {
        invoices.value[index] = result.invoice;
      }
      return result;
    } catch (err) {
      error.value = handleError(err, 'sendInvoice').message;
      throw err;
    }
  };

  const markInvoiceAsPaid = async (invoiceId: number, paymentData = {}) => {
    try {
      const invoice = await invoiceService.markAsPaid(invoiceId, paymentData);
      // Update local invoice
      const index = invoices.value.findIndex(i => i.id === invoiceId);
      if (index !== -1) {
        invoices.value[index] = invoice;
      }
      return invoice;
    } catch (err) {
      error.value = handleError(err, 'markInvoiceAsPaid').message;
      throw err;
    }
  };

  // Payment management
  const fetchPayments = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await paymentService.getPayments(filters);
      payments.value = response.payments;
      return response;
    } catch (err) {
      error.value = handleError(err, 'fetchPayments').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createPayment = async (paymentData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const payment = await paymentService.createPayment(paymentData);
      payments.value.push(payment);
      return payment;
    } catch (err) {
      error.value = handleError(err, 'createPayment').message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const confirmPayment = async (paymentId: number) => {
    try {
      const result = await paymentService.confirmPayment(paymentId);
      // Update local payment status
      const index = payments.value.findIndex(p => p.id === paymentId);
      if (index !== -1 && result.payment) {
        payments.value[index] = result.payment;
      }
      return result;
    } catch (err) {
      error.value = handleError(err, 'confirmPayment').message;
      throw err;
    }
  };

  // Tax calculation
  const calculateTaxes = async (amount: number, taxIds: number[]): Promise<TaxCalculationResponse> => {
    try {
      return await taxService.calculateTaxes({ amount, tax_ids: taxIds });
    } catch (err) {
      error.value = handleError(err, 'calculateTaxes').message;
      throw err;
    }
  };

  // Workflow helpers
  const getOverdueInvoices = async () => {
    return await fetchInvoices({ overdue_only: true });
  };

  const checkForOverdueInvoices = async () => {
    try {
      const response = await invoiceService.getOverdueInvoices();
      return response.invoices;
    } catch (err) {
      error.value = handleError(err, 'checkForOverdueInvoices').message;
      throw err;
    }
  };

  // Complete workflow example
  const completeQuoteToPaymentFlow = async (customerData: any, quoteData: any, paymentData: any) => {
    try {
      // Step 1: Create customer
      const customer = await createCustomer(customerData);

      // Step 2: Create quote
      const quote = await createQuote({ ...quoteData, customer_id: customer.id });

      // Step 3: Send quote
      await sendQuote(quote.id);

      // Step 4: Accept quote (this would normally be done by customer)
      await acceptQuote(quote.id);

      // Step 5: Convert to invoice
      const invoice = await convertQuoteToInvoice(quote.id, {
        payment_terms: 'Net 30 days',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      // Step 6: Send invoice
      await sendInvoice(invoice.id);

      // Step 7: Create payment
      const payment = await createPayment({ ...paymentData, invoice_id: invoice.id });

      // Step 8: Confirm payment
      await confirmPayment(payment.id);

      return { customer, quote, invoice, payment };
    } catch (err) {
      error.value = handleError(err, 'completeQuoteToPaymentFlow').message;
      throw err;
    }
  };

  return {
    // State
    invoices,
    quotes,
    customers,
    payments,
    loading,
    error,

    // Computed
    overdueInvoices,
    draftQuotes,
    sentQuotes,
    acceptedQuotes,
    pendingPayments,

    // Customer methods
    fetchCustomers,
    createCustomer,
    activateCustomer,

    // Quote methods
    fetchQuotes,
    createQuote,
    updateQuote,
    sendQuote,
    acceptQuote,
    convertQuoteToInvoice,

    // Invoice methods
    fetchInvoices,
    createInvoice,
    sendInvoice,
    markInvoiceAsPaid,

    // Payment methods
    fetchPayments,
    createPayment,
    confirmPayment,

    // Tax methods
    calculateTaxes,

    // Workflow helpers
    getOverdueInvoices,
    checkForOverdueInvoices,
    completeQuoteToPaymentFlow
  };
}
