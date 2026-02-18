<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Sales Report" />
    </div>

    <div
      class="bg-white max-w-full md:max-w-[1085px] px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
    >
      <!-- Filters Section -->
      <div
        class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Filters</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Date From -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Date From
            </label>
            <div class="relative">
              <input
                type="date"
                ref="dateFromInput"
                v-model="filters.start_date"
                class="w-full rounded-md border border-stroke bg-transparent py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <button
                @click="triggerDatePicker('dateFromInput')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <CalenderIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Date To -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Date To
            </label>
            <div class="relative">
              <input
                type="date"
                ref="dateToInput"
                v-model="filters.end_date"
                class="w-full rounded-md border border-stroke bg-transparent py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <button
                @click="triggerDatePicker('dateToInput')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <CalenderIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Payment Status -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Payment Status
            </label>
            <select
              v-model="filters.payment_status"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option :value="null">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Sales Person -->
          <div class="relative">
            <label
              class="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Sales Person
            </label>
            <button
              type="button"
              @click="toggleSalesPersonDropdown"
              class="relative z-20 w-full cursor-pointer rounded border border-stroke bg-transparent py-2 px-4 text-left outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <span v-if="!selectedSalesPersons || selectedSalesPersons.length === 0">
                All Sales Persons
              </span>
              <span v-else-if="selectedSalesPersons.length === 1">
                {{ getSalesPersonName(selectedSalesPersons[0]) }}
              </span>
              <span v-else>
                {{ selectedSalesPersons.length }} Sales Persons Selected
              </span>
              <ChevronDownIcon
                class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                :class="{ 'rotate-180': isSalesPersonDropdownOpen }"
              />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isSalesPersonDropdownOpen"
              class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded border border-stroke bg-white py-1 shadow-lg dark:border-strokedark dark:bg-boxdark"
            >
              <!-- Select All Option -->
              <label
                class="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4"
              >
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span class="font-medium text-black dark:text-white">Select All</span>
              </label>

              <hr class="my-1 border-stroke dark:border-strokedark" />

              <!-- Individual Sales Persons -->
              <label
                v-for="person in salesPersons"
                :key="person.id"
                class="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4"
              >
                <input
                  type="checkbox"
                  :value="person.id"
                  v-model="filters.sales_person_ids"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span class="text-black dark:text-white">{{ person.full_name }}</span>
              </label>
            </div>

            <!-- Backdrop to close dropdown -->
            <div
              v-if="isSalesPersonDropdownOpen"
              class="fixed inset-0 z-20"
              @click="closeSalesPersonDropdown"
            ></div>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex gap-2">
          <button
            @click="applyFilters"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Apply Filters
          </button>
          <button
            @click="resetFilters"
            class="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <data-table
          :data="reportData"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          :show-edit-button="false"
          :show-delete-button="false"
          :show-view-button="false"
        />
      </div>

      <!-- Summary Section -->
      <div
        v-if="summary"
        class="mt-6 border-t border-stroke p-6 dark:border-strokedark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Summary</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Total Sales Amount -->
          <div class="rounded-sm border border-stroke p-4 dark:border-strokedark">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Sales Amount</p>
            <p class="text-xl font-bold text-black dark:text-white">
              IDR {{ formatPrice(summary.total_sales_amount) }}
            </p>
          </div>

          <!-- Total Paid Amount -->
          <div class="rounded-sm border border-stroke p-4 dark:border-strokedark">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Paid Amount</p>
            <p class="text-xl font-bold text-success">
              IDR {{ formatPrice(summary.total_paid_amount) }}
            </p>
          </div>

          <!-- Difference -->
          <div class="rounded-sm border border-stroke p-4 dark:border-strokedark">
            <p class="text-sm text-gray-600 dark:text-gray-400">Difference</p>
            <p
              class="text-xl font-bold"
              :class="parseFloat(summary.total_difference) > 0 ? 'text-warning' : 'text-success'"
            >
              IDR {{ formatPrice(summary.total_difference) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import DataTable from '../../components/common/DataTable.vue'
import CalenderIcon from '../../icons/CalenderIcon.vue'
import ChevronDownIcon from '../../icons/ChevronDownIcon.vue'
import reportService from '../../services/report.service'
import type { SalesPerson, SalesReportFilters } from '../../types/report.types'

export default defineComponent({
  name: 'SalesReport',
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable,
    CalenderIcon,
    ChevronDownIcon,
  },
  setup() {
    const loading = ref(false)
    const reportData = ref<any[]>([])
    const salesPersons = ref<SalesPerson[]>([])

    const summary = ref<{
      total_sales_amount: string
      total_paid_amount: string
      total_difference: string
    } | null>(null)

    // Date input refs
    const dateFromInput = ref<HTMLInputElement | null>(null)
    const dateToInput = ref<HTMLInputElement | null>(null)

    // Sales Person Dropdown state
    const isSalesPersonDropdownOpen = ref(false)

    const filters = reactive<SalesReportFilters>({
      start_date: '',
      end_date: '',
      sales_person_ids: null,
      payment_status: null,
    })

    // Table columns
    const columns = ref([
      { key: 'invoice_number', label: 'Invoice', span: 1 },
      { key: 'booking_code', label: 'Booking Code', span: 1 },
      { key: 'customer_name', label: 'Customer', span: 2 },
      { key: 'sales_person_name', label: 'Sales Person', span: 1 },
      { key: 'check_in', label: 'Checkin', span: 1, type: 'date' },
      { key: 'check_out', label: 'Checkout', span: 1, type: 'date' },
      { key: 'total', label: 'Total Amount', span: 1, type: 'currency' },
      { key: 'amount_paid', label: 'Amount Paid', span: 1, type: 'currency' },
      { key: 'amount_due', label: 'Amount Due', span: 1, type: 'currency' },
      { key: 'payment_status', label: 'Payment Status', span: 1, type: 'status' },
    ])

    // Get default date range (this month)
    const getDefaultDateRange = () => {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      return {
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0],
      }
    }

    // Trigger date picker
    const triggerDatePicker = (inputRef: string) => {
      const input = inputRef === 'dateFromInput' ? dateFromInput.value : dateToInput.value
      if (input) {
        if (input.showPicker) {
          try {
            input.showPicker()
          } catch {
            input.focus()
          }
        } else {
          input.focus()
        }
      }
    }

    const formatPrice = (price: string | number): string => {
      const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : price
      return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    // Sales Person Dropdown methods
    const toggleSalesPersonDropdown = () => {
      isSalesPersonDropdownOpen.value = !isSalesPersonDropdownOpen.value
      // Initialize as empty array if null to enable checkbox binding
      if (isSalesPersonDropdownOpen.value && filters.sales_person_ids === null) {
        filters.sales_person_ids = []
      }
    }

    const closeSalesPersonDropdown = () => {
      isSalesPersonDropdownOpen.value = false
      // Convert empty array back to null if nothing selected
      if (filters.sales_person_ids && filters.sales_person_ids.length === 0) {
        filters.sales_person_ids = null
      }
    }

    const getSalesPersonName = (id: number): string => {
      const person = salesPersons.value.find(p => p.id === id)
      return person ? person.full_name : ''
    }

    const isAllSelected = computed(() => {
      if (!filters.sales_person_ids || filters.sales_person_ids.length === 0) {
        return false
      }
      return filters.sales_person_ids.length === salesPersons.value.length
    })

    const selectedSalesPersons = computed(() => {
      if (!filters.sales_person_ids || filters.sales_person_ids.length === 0) {
        return []
      }
      return filters.sales_person_ids
    })

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        // Deselect all - set to null
        filters.sales_person_ids = null
      } else {
        // Select all
        filters.sales_person_ids = salesPersons.value.map(p => p.id)
      }
    }

    const loadData = async () => {
      loading.value = true
      try {
        const [reportResponse, personsResponse] = await Promise.all([
          reportService.getSalesReport(filters),
          reportService.getSalesPersons(),
        ])

        reportData.value = reportResponse.items || []
        salesPersons.value = personsResponse || []

        summary.value = {
          total_sales_amount: reportResponse.total_sales_amount || '0',
          total_paid_amount: reportResponse.total_paid_amount || '0',
          total_difference: reportResponse.total_difference || '0',
        }
      } catch (error) {
        console.error('Error loading sales report:', error)
        reportData.value = []
        summary.value = null
      } finally {
        loading.value = false
      }
    }

    const applyFilters = async () => {
      await loadData()
    }

    const resetFilters = async () => {
      const defaultRange = getDefaultDateRange()
      filters.start_date = defaultRange.start_date
      filters.end_date = defaultRange.end_date
      filters.sales_person_ids = null
      filters.payment_status = null
      await loadData()
    }

    onMounted(() => {
      // Set default date range (this month)
      const defaultRange = getDefaultDateRange()
      filters.start_date = defaultRange.start_date
      filters.end_date = defaultRange.end_date

      loadData()
    })

    return {
      loading,
      reportData,
      salesPersons,
      summary,
      filters,
      columns,
      dateFromInput,
      dateToInput,
      applyFilters,
      resetFilters,
      formatPrice,
      triggerDatePicker,
      // Sales Person Dropdown
      isSalesPersonDropdownOpen,
      selectedSalesPersons,
      isAllSelected,
      toggleSalesPersonDropdown,
      closeSalesPersonDropdown,
      toggleSelectAll,
      getSalesPersonName,
    }
  },
})
</script>
