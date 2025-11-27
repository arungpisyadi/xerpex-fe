<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Create Quotation" />
    </div>

    <div class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]">
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-[700] text-black dark:text-white">
          Create New Quotation
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
        @submit="handleFormSubmit"
        v-model="quoteForm"
        :disabled="loading"
      >
        <!-- Customer Selection and Sales In Charge -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormKit
              type="select"
              name="customer_id"
              label="Select Customer"
              :options="customerOptions"
              placeholder="Choose a customer"
              validation="required"
              help="Select the customer for this Quotation"
            />
          </div>
          <div>
            <FormKit
              type="select"
              name="sales_person_id"
              label="Sales In Charge"
              :options="salesUserOptions"
              placeholder="Choose sales person"
              validation="required"
              help="Select the sales person responsible for this Quotation"
            />
          </div>
        </div>

        <!-- Quotation Details -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-[1rem] sm:grid-cols-2">
          <FormKit
            type="date"
            name="expiry_date"
            label="Expiry Date"
            help="When this Quotation expires"
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
            placeholder="Add any additional notes for this Quotation"
            help="Optional notes that will appear on the Quotation"
          />
        </div>

        <!-- Items Section -->
        <div class="mb-[1.5rem]">
          <h3 class="text-lg font-[600] text-black dark:text-white mb-[1rem]">Quotation Items</h3>

          <FormKit
            type="repeater"
            name="items"
            :min="1"
            add-label="Add Item"
            remove-label="Remove Item"
            up-label="Move Up"
            down-label="Move Down"
            help="Add items to this Quotation. At least one item is required."
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
                  help="Select package"
                />
              </div>

              <!-- Unit Price -->
              <div class="sm:col-span-2">
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
                  help="Price per pax"
                />
              </div>

              <!-- Pax -->
              <div class="sm:col-span-2">
                <FormKit
                  type="number"
                  name="pax"
                  label="Pax"
                  placeholder="Enter pax"
                  validation="required|min:1"
                  help="Number of pax"
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
                  help="Discount in IDR"
                />
              </div>

              <!-- Line Total (calculated) -->
              <div class="sm:col-span-2">
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
          <h4 class="text-md font-[600] text-black dark:text-white mb-[0.75rem]">Quotation Summary</h4>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Subtotal:</span>
              <span class="font-[500] text-black dark:text-white">IDR {{ formatPrice(calculations.subtotal) }}</span>
            </div>

            <hr class="border-[#d1d5db] dark:border-gray-600">

            <div class="flex justify-between text-lg font-[700]">
              <span class="text-black dark:text-white">Total:</span>
              <span class="text-black dark:text-white">IDR {{ formatPrice(calculations.total) }}</span>
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
            {{ loading ? 'Creating...' : 'Create Quotation' }}
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
import packageService from '../../services/package.service'
import userService from '../../services/user.service'
import type { Customer } from '../../types/customer.types'
import type { CreateQuoteRequest, QuoteItem, QuoteStatus } from '../../types/quote.types'
import type { Package } from '../../types/package.types'
import type { User } from '../../services/auth.service'
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
const packages = ref<Package[]>([])
const salesUsers = ref<User[]>([])

// Form data structure
const quoteForm = ref({
  customer_id: '',
  sales_person_id: null,
  expiry_date: (() => {
    const today = new Date()
    const expiryDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)
    return expiryDate.toISOString().split('T')[0]
  })(),
  notes: '',
  items: [
    {
      package_id: '',
      unit_price: 0,
      pax: 1,
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

const salesUserOptions = computed(() => {
  if (!salesUsers.value || !Array.isArray(salesUsers.value)) {
    return []
  }
  console.log(salesUsers.value);

  return salesUsers.value.map((user: User) => ({
    label: user.full_name,
    value: user.id
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

  // Check if sales person is selected
  if (!form.sales_person_id) return false

  // Check if at least one item exists and is valid
  if (!form.items || form.items.length === 0) return false

  // Check if all items have required fields
  return form.items.every(item =>
    item.package_id &&
    Number(item.unit_price) >= 0 &&
    Number(item.discount) >= 0
  )
})

// Methods
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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleFormSubmit = (data: any, node: any) => {
  submitQuote('draft')
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
    // Use the current form data from quoteForm.value (FormKit v-model)
    // formData parameter is passed by FormKit but we don't need it since we have v-model
    const quoteData: CreateQuoteRequest = {
      customer_id: Number(quoteForm.value.customer_id),
      sales_person_id: Number(quoteForm.value.sales_person_id),
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: quoteForm.value.expiry_date || undefined,
      status: String(status) as QuoteStatus, // Now correctly uses the status parameter
      total: calculations.value.total,
      items: quoteForm.value.items.map(item => ({
        package_id: Number(item.package_id),
        unit_price: Number(item.unit_price),
        discount: Number(item.discount),
        line_total: Number(item.line_total)
      }))
    }

    // Debug logging to verify status serialization
    console.log('Quote payload before API call:', JSON.stringify(quoteData, null, 2))
    console.log('Status type:', typeof quoteData.status, 'Value:', quoteData.status)

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
  // Update line_total for each item when unit_price, pax or discount changes
  newItems.forEach(item => {
    const unitPrice = Number(item.unit_price) || 0
    const pax = Number(item.pax) || 1
    const discount = Number(item.discount) || 0
    item.line_total = Math.max(0, (unitPrice * pax) - discount)
  })
}, { deep: true })

// Fetch sales users function
const fetchSalesUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      salesUsers.value = []
      return
    }

    const response = await userService.getUsers()
    console.log('Users service response:', response)

    // Filter users by sales role and active status
    const allUsers = Array.isArray(response) ? response : response.users
    salesUsers.value = allUsers.filter((user: User) =>
      user.role === 'sales' && user.is_active !== false
    )

    console.log('Sales users loaded successfully:', salesUsers.value.length, 'sales users')
  } catch (error: any) {
    console.error('Error loading sales users:', error)
    if (error.response?.status === 401) {
      console.error('Authentication failed - please log in again')
    } else if (error.response?.status === 404) {
      console.error('Users endpoint not found')
    }
    salesUsers.value = []
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Load customers, packages, and sales users for the dropdowns
    await Promise.all([
      fetchCustomers({ active_only: true }),
      loadPackages(),
      fetchSalesUsers()
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
