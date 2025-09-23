<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Edit Quote" />
    </div>

    <!-- Loading State -->
    <div v-if="loadingQuote" class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-3 text-[#4b5563] dark:text-gray-400">Loading quote...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-[#ef4444] text-lg font-[600] mb-2">{{ error }}</div>
          <button
            @click="$router.push('/quotes')"
            class="px-[1rem] py-[0.5rem] bg-primary text-white rounded-[0.5rem] hover:bg-primary-dark"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]">
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-title-md2 font-[700] text-black dark:text-white">
            Edit Quote #{{ quote?.quote_number }}
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">Status:</span>
            <span :class="getStatusClass(quote?.status)" class="px-2 py-1 text-xs font-[500] rounded-full">
              {{ quote?.status?.toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push('/quotes')"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#374151] bg-[#ffffff] border border-[#d1d5db] rounded-[0.5rem] hover:bg-[#f9fafb] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:border-[#4b5563] dark:hover:bg-[#374151]"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Non-editable Quote Warning -->
      <div v-if="!isEditable" class="mb-[1.5rem] p-[1rem] bg-[#fffbeb] border border-[#fde68a] rounded-[0.5rem] dark:bg-yellow-900/20 dark:border-yellow-800">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-[#d97706] dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-[#92400e] dark:text-yellow-200 font-[500]">
            This quote cannot be edited because its status is "{{ quote?.status }}". Only draft quotes can be modified.
          </span>
        </div>
      </div>

      <FormKit
        type="form"
        :actions="false"
        @submit="submitQuote"
        v-model="quoteForm"
        :disabled="loading || !isEditable"
      >
        <!-- Customer Selection -->
        <div class="mb-[1.5rem]">
          <FormKit
            type="select"
            name="customer_id"
            label="Select Customer"
            :options="customerOptions"
            placeholder="Choose a customer"
            validation="required"
            help="Select the customer for this quote"
            :disabled="!isEditable"
          />
        </div>

        <!-- Quote Details -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-[1rem] sm:grid-cols-2">
          <FormKit
            type="date"
            name="expiry_date"
            label="Expiry Date"
            help="When this quote expires"
            :disabled="!isEditable"
          />
          <div class="flex items-end">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">
              Issue Date: {{ formatDate(new Date(quote?.issue_date || new Date())) }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-[1.5rem]">
          <FormKit
            type="textarea"
            name="notes"
            label="Notes"
            placeholder="Add any additional notes for this quote"
            help="Optional notes that will appear on the quote"
            :disabled="!isEditable"
          />
        </div>

        <!-- Items Section -->
        <div class="mb-[1.5rem]">
          <h3 class="text-lg font-[600] text-black dark:text-white mb-[1rem]">Quote Items</h3>

          <FormKit
            type="repeater"
            name="items"
            :min="1"
            add-label="Add Item"
            remove-label="Remove Item"
            up-label="Move Up"
            down-label="Move Down"
            help="Add items to this quote. At least one item is required."
            :disabled="!isEditable"
          >
            <div class="grid grid-cols-1 gap-[1rem] sm:grid-cols-12 items-center">
              <!-- Package Selection -->
              <div class="sm:col-span-4">
                <FormKit
                  type="select"
                  name="package_id"
                  label="Package"
                  :options="packageOptions"
                  placeholder="Select a package"
                  validation="required"
                  @input="onPackageSelect"
                  :disabled="!isEditable"
                  help="Select package from available options"
                />
              </div>

              <!-- Unit Price -->
              <div class="sm:col-span-3">
                <FormKit
                  type="currency"
                  name="unit_price"
                  label="Unit Price"
                  placeholder="0.00"
                  currency="IDR"
                  :step="0.01"
                  :min="0"
                  validation="required|min:0"
                  @input="calculateItemAmount"
                  :disabled="!isEditable"
                  help="Price per person (editable)"
                />
              </div>

              <!-- Discount -->
              <div class="sm:col-span-2">
                <FormKit
                  type="currency"
                  name="discount"
                  label="Discount"
                  placeholder="0.00"
                  currency="IDR"
                  :step="0.01"
                  :min="0"
                  @input="calculateItemAmount"
                  :disabled="!isEditable"
                  help="Discount amount in Rp"
                />
              </div>

              <!-- Line Total (calculated) -->
              <div class="sm:col-span-3">
                <FormKit
                  type="currency"
                  name="line_total"
                  label="Line Total"
                  currency="IDR"
                  :step="0.01"
                  :min="0"
                  readonly
                  help="Automatically calculated"
                />
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Calculations Summary -->
        <div class="mb-[1.5rem] rounded-[0.5rem] border border-[#e5e7eb] bg-[#f9fafb] p-[1rem] dark:border-[#374151] dark:bg-[#1f2937]">
          <h4 class="text-md font-[600] text-black dark:text-white mb-[0.75rem]">Quote Summary</h4>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Subtotal:</span>
              <span class="font-[500] text-black dark:text-white">${{ formatPrice(calculations.subtotal) }}</span>
            </div>

            <hr class="border-[#d1d5db] dark:border-gray-600">

            <div class="flex justify-between text-lg font-[700]">
              <span class="text-black dark:text-white">Total:</span>
              <span class="text-black dark:text-white">${{ formatPrice(calculations.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-if="isEditable">
          <FormKit
            type="button"
            @click="$router.push('/quotes')"
            :disabled="loading"
          >
            Cancel
          </FormKit>

          <FormKit
            type="button"
            @click="saveDraft"
            :disabled="loading"
            class="bg-[#6b7280] hover:bg-[#4b5563]"
          >
            {{ loading ? 'Saving...' : 'Save as Draft' }}
          </FormKit>

          <FormKit
            type="submit"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? 'Updating...' : 'Update Quote' }}
          </FormKit>
        </div>

        <!-- Read-only actions -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-else>
          <!-- <FormKit
            type="button"
            @click="$router.push('/quotes')"
          >
            Back to Quotes
          </FormKit> -->
        </div>
      </FormKit>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import { useInvoicing } from '../../composables/useInvoicing'
import quoteService from '../../services/quote.service'
import packageService from '../../services/package.service'
import type { Customer } from '../../types/customer.types'
import type { Quote, UpdateQuoteRequest, QuoteItem } from '../../types/quote.types'
import type { Package } from '../../types/package.types'
import { handleError } from '../../utils/errorHandler'

// Router
const router = useRouter()
const route = useRoute()

// Get quote ID from route params
const quoteId = computed(() => route.params.id as string)

// Composables
const {
  customers,
  loading: invoicingLoading,
  fetchCustomers,
  updateQuote
} = useInvoicing()

// Reactive state
const loading = ref(false)
const loadingQuote = ref(true)
const error = ref<string | null>(null)
const quote = ref<Quote | null>(null)
const packages = ref<Package[]>([])

// Form data structure
const quoteForm = ref({
  customer_id: '',
  expiry_date: '',
  notes: '',
  items: [
    {
      package_id: '',
      unit_price: 0,
      discount: 0,
      line_total: 0
    }
  ]
})

// Computed properties
const customerOptions = computed(() => {
  if (!customers.value || !Array.isArray(customers.value)) {
    return []
  }

  return customers.value.map((customer: Customer) => ({
    label: `${customer.name} - ${customer.email || 'No email'}`,
    value: customer.id
  }))
})

const packageOptions = computed(() => {
  console.log('Packages for options:', packages.value)
  if (!packages.value || !Array.isArray(packages.value)) {
    return []
  }

  return packages.value.map((pkg: Package) => ({
    label: `${pkg.name} - Rp ${formatPrice(pkg.cost_per_pax)}`,
    value: pkg.id,
    cost_per_pax: pkg.cost_per_pax
  }))
})

const calculations = computed(() => {
  const items = quoteForm.value.items || []

  const subtotal = items.reduce((sum, item) => {
    const lineTotal = Number(item.line_total) || 0
    return sum + lineTotal
  }, 0)

  const total = subtotal

  return {
    subtotal,
    total
  }
})

const isFormValid = computed(() => {
  const form = quoteForm.value

  // Check if customer is selected
  if (!form.customer_id) return false

  // Check if at least one item exists and is valid
  if (!form.items || form.items.length === 0) return false

  // Check if all items have required fields
  return form.items.every(item =>
    item.package_id &&
    Number(item.unit_price) >= 0 &&
    Number(item.discount) >= 0
  )
})

const isEditable = computed(() => {
  return quote.value?.status === 'draft'
})

// Methods
const getStatusClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'bg-[#f3f4f6] text-[#1f2937] dark:bg-[#1f2937] dark:text-gray-300'
    case 'sent':
      return 'bg-[#dbeafe] text-[#1e40af] dark:bg-blue-900 dark:text-blue-300'
    case 'accepted':
      return 'bg-[#dcfce7] text-[#166534] dark:bg-green-900 dark:text-green-300'
    case 'rejected':
      return 'bg-[#fee2e2] text-[#991b1b] dark:bg-red-900 dark:text-red-300'
    case 'expired':
      return 'bg-[#fef3c7] text-[#92400e] dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-[#f3f4f6] text-[#1f2937] dark:bg-[#1f2937] dark:text-gray-300'
  }
}

const onPackageSelect = (value: number | undefined, node: any) => {
  if (!value) return

  const selectedPackage = packages.value.find(pkg => pkg.id === value)
  if (selectedPackage && node?.parent?.value) {
    // Auto-populate unit_price from package cost_per_pax
    node.parent.value.unit_price = selectedPackage.cost_per_pax
    // Trigger calculation
    calculateItemAmount()
  }
}

const calculateItemAmount = () => {
  // This will be triggered by FormKit's reactivity
  // The line_total calculation is handled in the watcher below
}

const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = Number(price) || 0
  return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadQuoteData = async () => {
  if (!quoteId.value) {
    error.value = 'Quote ID is required'
    loadingQuote.value = false
    return
  }

  try {
    loadingQuote.value = true
    error.value = null

    // Fetch quote data
    const response = await quoteService.getQuoteById(Number(quoteId.value))
    quote.value = response

    // Pre-populate form with quote data
    quoteForm.value = {
      customer_id: quote.value.customer_id?.toString() || '',
      expiry_date: quote.value.expiry_date || '',
      notes: '', // Notes field doesn't exist in Quote type, so we'll leave it empty
      items: quote.value.items?.map(item => ({
        package_id: item.package_id?.toString() || '',
        unit_price: item.unit_price || 0,
        discount: item.discount || 0,
        line_total: item.line_total || 0
      })) || [
        {
          package_id: '',
          unit_price: 0,
          discount: 0,
          line_total: 0
        }
      ]
    }

  } catch (err: any) {
    console.error('Error loading quote:', err)
    if (err.response?.status === 404) {
      error.value = 'Quote not found'
    } else if (err.response?.status === 403) {
      error.value = 'Access denied. You do not have permission to view this quote.'
    } else {
      error.value = 'Failed to load quote data'
    }
  } finally {
    loadingQuote.value = false
  }
}

const saveDraft = async () => {
  await submitQuote('draft')
}

const submitQuote = async (status: 'draft' | 'sent' = 'draft') => {
  if (!isFormValid.value || !isEditable.value) {
    console.error('Form is not valid or quote is not editable')
    return
  }

  loading.value = true

  try {
    // Prepare quote data
    const quoteData: UpdateQuoteRequest = {
      customer_id: Number(quoteForm.value.customer_id),
      expiry_date: quoteForm.value.expiry_date || undefined,
      status: status,
      total: calculations.value.total,
      items: quoteForm.value.items.map(item => ({
        package_id: Number(item.package_id),
        unit_price: Number(item.unit_price),
        discount: Number(item.discount),
        line_total: Number(item.line_total)
      }))
    }

    // Update the quote
    await updateQuote(Number(quoteId.value), quoteData)

    console.log(`Quote ${status === 'draft' ? 'saved as draft' : 'updated'} successfully`)

    // Redirect to quotes list
    router.push('/quotes')

  } catch (error) {
    handleError(error, 'submitQuote')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => quoteForm.value.items, (newItems) => {
  // Update line_total for each item when unit_price or discount changes
  newItems.forEach(item => {
    const unitPrice = Number(item.unit_price) || 0
    const discount = Number(item.discount) || 0
    item.line_total = Math.max(0, unitPrice - discount)
  })
}, { deep: true })

// Lifecycle
onMounted(async () => {
  try {
    // Load customers, packages, and quote data in parallel
    await Promise.all([
      fetchCustomers({ active_only: true }),
      loadPackages(),
      loadQuoteData()
    ])
  } catch (error) {
    handleError(error, 'loadData')
  }
})

const loadPackages = async () => {
  try {
    // Ensure we have authentication token before making the request
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      packages.value = []
      return
    }

    const response = await packageService.getPackages({ active_only: true })
    console.log('Package service response:', response)
    packages.value = Array.isArray(response) ? response : (response.packages || [])
    console.log('Packages loaded successfully:', packages.value.length, 'packages')
  } catch (error: any) {
    console.error('Error loading packages:', error)
    // Show user-friendly error message
    if (error.response?.status === 401) {
      console.error('Authentication failed - please log in again')
    } else if (error.response?.status === 404) {
      console.error('Packages endpoint not found')
    }
    packages.value = []
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.formkit-outer[data-type="repeater"] {
  @apply max-w-none;
}

.formkit-item {
  @apply border border-[#e5e7eb] rounded-[0.5rem] p-[1rem] mb-[1rem] bg-[#ffffff] dark:border-[#374151] dark:bg-[#1f2937];
}

.formkit-controls {
  @apply bg-[#f9fafb] dark:bg-[#1f2937];
}

/* Ensure consistent height and alignment for repeater form fields */
.formkit-outer[data-type="repeater"] .formkit-item .formkit-outer {
  @apply flex flex-col justify-center;
}

.formkit-outer[data-type="repeater"] .formkit-item .formkit-input {
  @apply min-h-[2.75rem] flex items-center;
}

.formkit-outer[data-type="repeater"] .formkit-item .formkit-wrapper {
  @apply flex items-center;
}

/* Align labels consistently */
.formkit-outer[data-type="repeater"] .formkit-item .formkit-label {
  @apply mb-[0.5rem] block text-[0.875rem] font-[500];
}

/* Ensure help text doesn't affect alignment */
.formkit-outer[data-type="repeater"] .formkit-item .formkit-help {
  @apply mt-[0.25rem] text-[0.75rem];
}
</style>
