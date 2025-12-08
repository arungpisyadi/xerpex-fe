<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb
        pageTitle="Taxes"
        :items="[{ text: 'Home', link: '/' }, { text: 'Taxes' }]"
      />
    </div>

    <div class=" bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-0 xl:pb-0">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Tax Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="createNewTax">
            <span class="mr-2">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
              </svg>
            </span>
            Add Tax
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          title="Taxes"
          :data="taxes"
          :columns="columns"
          :loading="loading"
          @edit="editTax"
          @delete="deleteTax"
          @add="createNewTax"
        />
      </div>
    </div>

    <!-- Tax Calculator -->
    <div class="mt-6  bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-0 xl:pb-0">
      <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Tax Calculator</h3>

      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="mb-2.5 block text-black dark:text-white">Amount</label>
          <input
            type="number"
            v-model="calculator.amount"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label class="mb-2.5 block text-black dark:text-white">Select Taxes</label>
          <select
            multiple
            v-model="calculator.selectedTaxes"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            size="3"
          >
            <option v-for="tax in taxes" :key="tax.id" :value="tax.id">
              {{ tax.name }} ({{ tax.percentage }}%)
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="calculateTaxes"
            class="w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            :disabled="!calculator.amount || calculator.selectedTaxes.length === 0"
          >
            Calculate
          </button>
        </div>
      </div>

      <div v-if="calculator.result" class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h4 class="mb-2 font-medium text-black dark:text-white">Calculation Result</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Subtotal:</span>
            <span class="ml-2 font-medium text-black dark:text-white">IDR {{ calculator.result.subtotal.toFixed(2) }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Tax Total:</span>
            <span class="ml-2 font-medium text-black dark:text-white">IDR {{ calculator.result.tax_total.toFixed(2) }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Total:</span>
            <span class="ml-2 font-medium text-black dark:text-white">IDR {{ calculator.result.total.toFixed(2) }}</span>
          </div>
        </div>
        <div v-if="calculator.result.tax_breakdown.length > 0" class="mt-3">
          <h5 class="mb-2 text-sm font-medium text-black dark:text-white">Tax Breakdown:</h5>
          <div class="space-y-1">
            <div v-for="breakdown in calculator.result.tax_breakdown" :key="breakdown.name" class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ breakdown.name }} ({{ breakdown.percentage }}%):</span>
              <span class="font-medium text-black dark:text-white">IDR {{ breakdown.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tax Form Modal -->
    <tax-form-modal
      v-if="showFormModal"
      :tax="editingTax"
      :is-editing="isEditing"
      @close="closeFormModal"
      @saved="handleTaxSaved"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import TaxFormModal from '../components/taxes/TaxFormModal.vue';
import taxService from '../services/tax.service';
import type { Tax, TaxCalculationResponse } from '../types/tax.types';

// Reactive data
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const taxes = ref<Tax[]>([]);
const showFormModal = ref(false);
const editingTax = ref<Tax | null>(null);
const isEditing = ref(false);

// Tax calculator
const calculator = reactive({
  amount: 0,
  selectedTaxes: [] as number[],
  result: null as TaxCalculationResponse | null
});

// Table columns
const columns = [
  { label: 'Name', key: 'name' },
  { label: 'Percentage', key: 'percentage' },
  { label: 'Created', key: 'created_at', type: 'date' }
];

// Methods
const fetchTaxes = async () => {
  try {
    loading.value = true;
    const response = await taxService.getTaxes({
      skip: (currentPage.value - 1) * itemsPerPage.value,
      limit: itemsPerPage.value,
      active_only: true
    });

    taxes.value = response.taxes;
    totalItems.value = response.total;
  } catch (error) {
    console.error('Error fetching taxes:', error);
    // Show error notification
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await fetchTaxes();
};

const createNewTax = () => {
  editingTax.value = null;
  isEditing.value = false;
  showFormModal.value = true;
};

const editTax = (tax: Tax) => {
  editingTax.value = tax;
  isEditing.value = true;
  showFormModal.value = true;
};

const deleteTax = async (tax: Tax) => {
  if (confirm(`Are you sure you want to delete the tax "${tax.name}"?`)) {
    try {
      await taxService.deleteTax(tax.id);
      await fetchTaxes();
      // Show success notification
    } catch (error) {
      console.error('Error deleting tax:', error);
      // Show error notification
    }
  }
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingTax.value = null;
  isEditing.value = false;
};

const handleTaxSaved = () => {
  closeFormModal();
  fetchTaxes();
};

const calculateTaxes = async () => {
  try {
    calculator.result = await taxService.calculateTaxes({
      amount: calculator.amount,
      tax_ids: calculator.selectedTaxes
    });
  } catch (error) {
    console.error('Error calculating taxes:', error);
    // Show error notification
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Lifecycle
onMounted(() => {
  fetchTaxes();
});
</script>
