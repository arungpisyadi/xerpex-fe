<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Create Quote" />
    </div>

    <div class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]">
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-[700] text-black dark:text-white">
          Create New Quote
        </h2>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push('/quotes')"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#374151] bg-[#ffffff] border border-[#d1d5db] rounded-[0.5rem] hover:bg-[#f9fafb] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:border-[#4b5563] dark:hover:bg-[#374151]"
          >
            Cancel
          </button>
        </div>
      </div>

      <FormKit
        type="form"
        :actions="false"
        @submit="submitQuote"
        v-model="quoteForm"
        :disabled="loading"
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
          />
        </div>

        <!-- Quote Details -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-[1rem] sm:grid-cols-2">
          <FormKit
            type="date"
            name="expiry_date"
            label="Expiry Date"
            help="When this quote expires"
          />
          <div class="flex items-end">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">
              Issue Date: {{ formatDate(new Date()) }}
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
          >
            <div class="grid grid-cols-1 gap-[1rem] sm:grid-cols-12 items-center">
              <!-- Description -->
              <div class="sm:col-span-5">
                <FormKit
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="Item description"
                  validation="required"
                  help="-"
                />
              </div>

              <!-- Quantity -->
              <div class="sm:col-span-2">
                <FormKit
                  type="number"
                  name="quantity"
                  label="Quantity"
                  placeholder="1"
                  value="1"
                  :min="1"
                  :step="1"
                  validation="required|min:1"
                  @input="calculateItemAmount"
                  help="-"
                />
              </div>

              <!-- Unit Price -->
              <div class="sm:col-span-2">
                <FormKit
                  type="number"
                  name="unit_price"
                  label="Unit Price"
                  placeholder="0.00"
                  :step="0.01"
                  :min="0"
                  validation="required|min:0"
                  @input="calculateItemAmount"
                  help="-"
                />
              </div>

              <!-- Amount (calculated) -->
              <div class="sm:col-span-3">
                <FormKit
                  type="number"
                  name="amount"
                  label="Amount"
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

            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Tax ({{ taxRate }}%):</span>
              <span class="font-[500] text-black dark:text-white">${{ formatPrice(calculations.tax_total) }}</span>
            </div>

            <hr class="border-[#d1d5db] dark:border-gray-600">

            <div class="flex justify-between text-lg font-[700]">
              <span class="text-black dark:text-white">Total:</span>
              <span class="text-black dark:text-white">${{ formatPrice(calculations.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]">
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
            {{ loading ? 'Creating...' : 'Create Quote' }}
          </FormKit>
        </div>
      </FormKit>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import { useInvoicing } from '../../composables/useInvoicing'
import quoteService from '../../services/quote.service'
import type { Customer } from '../../types/customer.types'
import type { CreateQuoteRequest, QuoteItem } from '../../types/quote.types'
import { handleError } from '../../utils/errorHandler'

// Router
const router = useRouter()

// Composables
const {
  customers,
  loading: invoicingLoading,
  fetchCustomers,
  createQuote
} = useInvoicing()

// Reactive state
const loading = ref(false)
const taxRate = ref(10) // Default 10% tax rate

// Form data structure
const quoteForm = ref({
  customer_id: '',
  expiry_date: '',
  notes: '',
  items: [
    {
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0
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

const calculations = computed(() => {
  const items = quoteForm.value.items || []

  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.unit_price) || 0
    return sum + (quantity * unitPrice)
  }, 0)

  const tax_total = subtotal * (taxRate.value / 100)
  const total = subtotal + tax_total

  return {
    subtotal,
    tax_total,
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
    item.description &&
    item.description.trim() !== '' &&
    Number(item.quantity) > 0 &&
    Number(item.unit_price) >= 0
  )
})

// Methods
const calculateItemAmount = () => {
  // This will be triggered by FormKit's reactivity
  // The amount calculation is handled in the watcher below
}

const formatPrice = (price: number): string => {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const saveDraft = async () => {
  await submitQuote('draft')
}

const submitQuote = async (status: 'draft' | 'sent' = 'draft') => {
  if (!isFormValid.value) {
    console.error('Form is not valid')
    return
  }

  loading.value = true

  try {
    // Prepare quote data
    const quoteData: CreateQuoteRequest = {
      customer_id: Number(quoteForm.value.customer_id),
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: quoteForm.value.expiry_date || undefined,
      status: status,
      total: calculations.value.total,
      tax_total: calculations.value.tax_total,
      items: quoteForm.value.items.map(item => ({
        package_id: 0, // Using 0 for custom items without package
        unit_price: Number(item.unit_price),
        discount: 0,
        line_total: Number(item.quantity) * Number(item.unit_price),
        package_name: item.description // Store description as package_name
      }))
    }

    // Create the quote
    await createQuote(quoteData)

    console.log(`Quote ${status === 'draft' ? 'saved as draft' : 'created'} successfully`)

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
  // Update amount for each item when quantity or unit_price changes
  newItems.forEach(item => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.unit_price) || 0
    item.amount = quantity * unitPrice
  })
}, { deep: true })

// Lifecycle
onMounted(async () => {
  try {
    // Load customers for the dropdown
    await fetchCustomers({ active_only: true })
  } catch (error) {
    handleError(error, 'loadData')
  }
})
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
