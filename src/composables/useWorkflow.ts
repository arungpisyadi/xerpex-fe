import { ref, reactive, computed, readonly } from 'vue';
import type { WorkflowState } from '../types/api.types';
import type { Customer } from '../types/customer.types';
import type { Package } from '../types/package.types';
import type { Tax } from '../types/tax.types';
import type { Quote, CreateQuoteRequest } from '../types/quote.types';
import type { Invoice } from '../types/invoice.types';
import type { Payment } from '../types/payment.types';

import customerService from '../services/customer.service';
// @ts-ignore
import packageService from '../services/package.service';
import taxService from '../services/tax.service';
import quoteService from '../services/quote.service';
import { ErrorHandler } from '../utils/error-handler';

export interface QuoteWorkflowData {
  customer: Customer | null;
  packages: Package[];
  selectedPackages: Array<{
    package: Package;
    quantity: number;
    unit_price: number;
    discount: number;
  }>;
  taxes: Tax[];
  selectedTaxes: number[];
  subtotal: number;
  tax_total: number;
  total: number;
  quote: Quote | null;
}

/**
 * Composable for managing the quote creation workflow
 */
export function useQuoteWorkflow() {
  const currentStep = ref<string>('customer-selection');
  const loading = ref(false);
  const errors = ref<Record<string, string>>({});

  const workflowData = reactive<QuoteWorkflowData>({
    customer: null,
    packages: [],
    selectedPackages: [],
    taxes: [],
    selectedTaxes: [],
    subtotal: 0,
    tax_total: 0,
    total: 0,
    quote: null
  });

  const steps = [
    { key: 'customer-selection', title: 'Select Customer', completed: false },
    { key: 'package-selection', title: 'Select Packages', completed: false },
    { key: 'tax-calculation', title: 'Apply Taxes', completed: false },
    { key: 'review-quote', title: 'Review Quote', completed: false },
    { key: 'quote-created', title: 'Quote Created', completed: false }
  ];

  const currentStepIndex = computed(() =>
    steps.findIndex(step => step.key === currentStep.value)
  );

  const canProceed = computed(() => {
    switch (currentStep.value) {
      case 'customer-selection':
        return workflowData.customer !== null;
      case 'package-selection':
        return workflowData.selectedPackages.length > 0;
      case 'tax-calculation':
        return true; // Tax selection is optional
      case 'review-quote':
        return workflowData.total > 0;
      default:
        return false;
    }
  });

  const canGoBack = computed(() => currentStepIndex.value > 0);

  // Load initial data
  const loadCustomers = async () => {
    try {
      loading.value = true;
      const response = await customerService.getCustomers({ active_only: true });
      return response.customers;
    } catch (error) {
      ErrorHandler.logError(error, 'useQuoteWorkflow.loadCustomers');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const loadPackages = async () => {
    try {
      loading.value = true;
      const response = await packageService.getPackages({ active_only: true });
      workflowData.packages = response.packages || [];
    } catch (error) {
      ErrorHandler.logError(error, 'useQuoteWorkflow.loadPackages');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const loadTaxes = async () => {
    try {
      loading.value = true;
      const response = await taxService.getTaxes({ active_only: true });
      workflowData.taxes = response.taxes;
    } catch (error) {
      ErrorHandler.logError(error, 'useQuoteWorkflow.loadTaxes');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Step navigation
  const nextStep = () => {
    if (canProceed.value && currentStepIndex.value < steps.length - 1) {
      steps[currentStepIndex.value].completed = true;
      currentStep.value = steps[currentStepIndex.value + 1].key;
    }
  };

  const previousStep = () => {
    if (canGoBack.value) {
      currentStep.value = steps[currentStepIndex.value - 1].key;
    }
  };

  const goToStep = (stepKey: string) => {
    const stepIndex = steps.findIndex(step => step.key === stepKey);
    if (stepIndex !== -1) {
      currentStep.value = stepKey;
    }
  };

  // Customer selection
  const selectCustomer = (customer: Customer) => {
    workflowData.customer = customer;
    errors.value = {};
  };

  // Package management
  const addPackage = (pkg: Package, quantity: number = 1, discount: number = 0) => {
    const existingIndex = workflowData.selectedPackages.findIndex(
      item => item.package.id === pkg.id
    );

    if (existingIndex !== -1) {
      workflowData.selectedPackages[existingIndex].quantity += quantity;
    } else {
      workflowData.selectedPackages.push({
        package: pkg,
        quantity,
        unit_price: pkg.cost_per_pax,
        discount
      });
    }

    calculateSubtotal();
  };

  const removePackage = (packageId: number) => {
    const index = workflowData.selectedPackages.findIndex(
      item => item.package.id === packageId
    );
    if (index !== -1) {
      workflowData.selectedPackages.splice(index, 1);
      calculateSubtotal();
    }
  };

  const updatePackageQuantity = (packageId: number, quantity: number) => {
    const item = workflowData.selectedPackages.find(
      item => item.package.id === packageId
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
      calculateSubtotal();
    }
  };

  const updatePackageDiscount = (packageId: number, discount: number) => {
    const item = workflowData.selectedPackages.find(
      item => item.package.id === packageId
    );
    if (item) {
      item.discount = Math.max(0, discount);
      calculateSubtotal();
    }
  };

  // Tax management
  const toggleTax = (taxId: number) => {
    const index = workflowData.selectedTaxes.indexOf(taxId);
    if (index !== -1) {
      workflowData.selectedTaxes.splice(index, 1);
    } else {
      workflowData.selectedTaxes.push(taxId);
    }
    calculateTaxes();
  };

  // Calculations
  const calculateSubtotal = () => {
    workflowData.subtotal = workflowData.selectedPackages.reduce((total, item) => {
      const lineTotal = (item.unit_price * item.quantity) - item.discount;
      return total + Math.max(0, lineTotal);
    }, 0);
    calculateTaxes();
  };

  const calculateTaxes = async () => {
    if (workflowData.selectedTaxes.length === 0 || workflowData.subtotal === 0) {
      workflowData.tax_total = 0;
      workflowData.total = workflowData.subtotal;
      return;
    }

    try {
      const calculation = await taxService.calculateTaxes({
        amount: workflowData.subtotal,
        tax_ids: workflowData.selectedTaxes
      });

      workflowData.tax_total = calculation.tax_total;
      workflowData.total = calculation.total;
    } catch (error) {
      ErrorHandler.logError(error, 'useQuoteWorkflow.calculateTaxes');
      workflowData.tax_total = 0;
      workflowData.total = workflowData.subtotal;
    }
  };

  // Quote creation
  const createQuote = async (additionalData: Partial<CreateQuoteRequest> = {}) => {
    if (!workflowData.customer) {
      throw new Error('Customer is required');
    }

    if (workflowData.selectedPackages.length === 0) {
      throw new Error('At least one package is required');
    }

    try {
      loading.value = true;

      const quoteData: CreateQuoteRequest = {
        customer_id: workflowData.customer.id,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        total: workflowData.total,
        tax_total: workflowData.tax_total,
        items: workflowData.selectedPackages.map(item => ({
          package_id: item.package.id,
          unit_price: item.unit_price,
          discount: item.discount,
          line_total: (item.unit_price * item.quantity) - item.discount
        })),
        ...additionalData
      };

      workflowData.quote = await quoteService.createQuote(quoteData);
      currentStep.value = 'quote-created';
      steps[steps.length - 1].completed = true;

      return workflowData.quote;
    } catch (error) {
      ErrorHandler.logError(error, 'useQuoteWorkflow.createQuote');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Reset workflow
  const resetWorkflow = () => {
    currentStep.value = 'customer-selection';
    Object.assign(workflowData, {
      customer: null,
      packages: [],
      selectedPackages: [],
      taxes: [],
      selectedTaxes: [],
      subtotal: 0,
      tax_total: 0,
      total: 0,
      quote: null
    });
    steps.forEach(step => step.completed = false);
    errors.value = {};
  };

  return {
    // State
    currentStep: readonly(currentStep),
    loading: readonly(loading),
    errors: readonly(errors),
    workflowData: readonly(workflowData),
    steps,
    currentStepIndex,
    canProceed,
    canGoBack,

    // Methods
    loadCustomers,
    loadPackages,
    loadTaxes,
    nextStep,
    previousStep,
    goToStep,
    selectCustomer,
    addPackage,
    removePackage,
    updatePackageQuantity,
    updatePackageDiscount,
    toggleTax,
    calculateSubtotal,
    calculateTaxes,
    createQuote,
    resetWorkflow
  };
}

/**
 * Composable for managing invoice workflow states
 */
export function useInvoiceWorkflow() {
  const currentStatus = ref<string>('draft');
  const loading = ref(false);

  const statusFlow: Record<string, string[]> = {
    draft: ['sent'],
    sent: ['paid', 'overdue', 'cancelled'],
    paid: [],
    overdue: ['paid', 'cancelled'],
    cancelled: ['draft']
  };

  const canTransitionTo = (targetStatus: string): boolean => {
    const allowedTransitions = statusFlow[currentStatus.value] || [];
    return allowedTransitions.includes(targetStatus);
  };

  const getAvailableActions = (): string[] => {
    return statusFlow[currentStatus.value] || [];
  };

  return {
    currentStatus: readonly(currentStatus),
    loading: readonly(loading),
    canTransitionTo,
    getAvailableActions
  };
}
