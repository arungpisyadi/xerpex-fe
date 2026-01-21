<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Create Invoice" />
    </div>

    <div
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-[700] text-black dark:text-white">Create New Invoice</h2>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push('/invoices')"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#374151] bg-[#ffffff] border border-[#d1d5db] rounded-[0.5rem] hover:bg-[#f9fafb] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:border-[#4b5563] dark:hover:bg-[#374151]"
          >
            Cancel
          </button>
        </div>
      </div>

      <FormKit
        type="form"
        :actions="false"
        @submit="submitInvoice"
        v-model="invoiceForm"
        :disabled="loading"
      >
        <!-- Customer Selection and Check-in/Check-out Dates -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <FormKit
              type="select"
              name="customer_id"
              label="Select Customer"
              :options="customerOptions"
              placeholder="Choose a customer"
              validation="required"
              help="Select the customer for this invoice"
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
              help="Select the sales person responsible for this invoice"
            />
          </div>
          <div>
            <FormKit
              type="date"
              name="check_in"
              label="Check-In Date"
              validation="required"
              help="Guest check-in date"
            >
              <template #suffixIcon>
                <div @click="triggerDatePicker($event)" class="cursor-pointer">
                  <CalenderIcon />
                </div>
              </template>
            </FormKit>
          </div>
          <div>
            <FormKit
              type="date"
              name="check_out"
              label="Check-Out Date"
              validation="required"
              help="Guest check-out date"
            >
              <template #suffixIcon>
                <div @click="triggerDatePicker($event)" class="cursor-pointer">
                  <CalenderIcon />
                </div>
              </template>
            </FormKit>
          </div>
        </div>

        <!-- Villa Selection and Invoice Details -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div class="col-span-2">
            <FormKit
              type="taglist"
              name="villa_ids"
              label="Select Villas"
              :options="villaOptions"
              placeholder="Choose villas for this invoice"
              help="Select one or more villas"
              select-icon="down"
              :classes="{
                selectIcon: '!opacity-100 !block',
              }"
            />
          </div>
          <div>
            <FormKit
              type="select"
              name="payment_terms"
              label="Payment Terms"
              :options="paymentTermsOptions"
              placeholder="Select payment terms"
              validation="required"
              help="Payment terms for this invoice"
              @input="calculateDueDate"
            />
          </div>
          <div>
            <FormKit
              type="select"
              name="status"
              label="Status"
              :options="statusOptions"
              placeholder="Select status"
              validation="required"
              help="Payment status for this invoice"
            />
          </div>
        </div>

        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <FormKit
              type="date"
              name="due_date"
              label="Due Date"
              help="When payment is due"
              validation="required"
            >
             <template #suffixIcon>
                <div @click="triggerDatePicker($event)" class="cursor-pointer">
                  <CalenderIcon />
                </div>
              </template>
            </FormKit>
          </div>
          <div class="flex items-center">
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
            placeholder="Add any additional notes for this invoice"
            help="Optional notes that will appear on the invoice"
          />
        </div>

        <!-- Items Section -->
        <div class="mb-[1.5rem]">
          <h3 class="text-lg font-[600] text-black dark:text-white mb-[1rem]">Invoice Items</h3>

          <FormKit
            type="repeater"
            name="items"
            :min="1"
            add-label="Add Item"
            remove-label="Remove Item"
            up-label="Move Up"
            down-label="Move Down"
            help="Add items to this invoice. At least one item is required."
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
                  @input="calculateItemAmount"
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
                  value="0"
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
                  help="Automatically calculated"
                />
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Calculations Summary -->
        <div
          class="mb-[1.5rem] rounded-[0.5rem] border border-[#e5e7eb] bg-[#f9fafb] p-[1rem] dark:border-[#374151] dark:bg-[#1f2937]"
        >
          <h4 class="text-md font-[600] text-black dark:text-white mb-[0.75rem]">
            Invoice Summary
          </h4>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Subtotal:</span>
              <span class="font-[500] text-black dark:text-white"
                >Rp {{ formatPrice(calculations.subtotal) }}</span
              >
            </div>

            <hr class="border-[#d1d5db] dark:border-gray-600" />

            <div class="flex justify-between text-lg font-[700]">
              <span class="text-black dark:text-white">Total:</span>
              <span class="text-black dark:text-white"
                >Rp {{ formatPrice(calculations.total) }}</span
              >
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]">
          <FormKit type="button" @click="$router.push('/invoices')" :disabled="loading">
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

          <FormKit type="submit" :disabled="loading || !isFormValid">
            {{ loading ? 'Creating...' : 'Create Invoice' }}
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
import CalenderIcon from '../../icons/CalenderIcon.vue'
import { useInvoicing } from '../../composables/useInvoicing'
import invoiceService from '../../services/invoice.service.ts'
import packageService from '../../services/package.service.ts'
import userService from '../../services/user.service'
import villaService from '../../services/villa.service'
import type { Customer } from '../../types/customer.types'
import type { CreateInvoiceRequest, InvoiceItem, InvoiceStatus } from '../../types/invoice.types'
import type { Package } from '../../types/package.types'
import type { User } from '../../services/auth.service'
import { handleError } from '../../utils/errorHandler'

// Router
const router = useRouter()

// Composables
const { customers, loading: invoicingLoading, fetchCustomers, createInvoice } = useInvoicing()

// Reactive state
const loading = ref(false)
const packages = ref<Package[]>([])
const salesUsers = ref<User[]>([])
const villas = ref<any[]>([])

// Payment terms options
const paymentTermsOptions = [
  { label: 'Net 15 days', value: 'Net 15' },
  { label: 'Net 30 days', value: 'Net 30' },
  { label: 'Net 45 days', value: 'Net 45' },
  { label: 'Net 60 days', value: 'Net 60' },
  { label: 'Due on receipt', value: 'Due on receipt' },
  { label: 'Cash on delivery', value: 'COD' },
]

// Status options
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Cancelled', value: 'cancelled' },
]

// Form data structure
const invoiceForm = ref({
  customer_id: '',
  check_in: '',
  check_out: '',
  villa_ids: [] as number[],
  payment_terms: 'Net 30',
  status: 'draft',
  due_date: '',
  notes: '',
  sales_person_id: '',
  items: [
    {
      package_id: '',
      unit_price: 0,
      pax: 1,
      discount: 0,
      line_total: 0,
    },
  ],
})

// Computed properties
const customerOptions = computed(() => {
  if (!customers.value || !Array.isArray(customers.value)) {
    return []
  }

  return customers.value.map((customer: Customer) => ({
    label: `${customer.name} - ${customer.email || 'No email'}`,
    value: customer.id,
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
    cost_per_pax: pkg.cost_per_pax,
  }))
})

const salesUserOptions = computed(() => {
  if (!salesUsers.value || !Array.isArray(salesUsers.value)) {
    return []
  }

  return salesUsers.value.map((user: User) => ({
    label: user.full_name,
    value: user.id,
  }))
})

const villaOptions = computed(() => {
  if (!villas.value || !Array.isArray(villas.value)) {
    return []
  }

  return villas.value.map((villa: any) => ({
    label: villa.name,
    value: villa.id,
  }))
})

const calculations = computed(() => {
  const items = invoiceForm.value.items || []

  const subtotal = items.reduce((sum, item) => {
    const lineTotal = Number(item.line_total) || 0
    return sum + lineTotal
  }, 0)

  const total = subtotal

  return {
    subtotal,
    total,
  }
})

const isFormValid = computed(() => {
  const form = invoiceForm.value

  // Check if customer is selected
  if (!form.customer_id) return false

  // Check if payment terms, status and due date are set
  if (!form.payment_terms || !form.status || !form.due_date) return false

  // Check if sales person is selected
  if (!form.sales_person_id) return false

  // Check if at least one item exists and is valid
  if (!form.items || form.items.length === 0) return false

  // Check if all items have required fields
  return form.items.every(
    (item) => item.package_id && Number(item.unit_price) >= 0 && Number(item.discount) >= 0,
  )
})

// Methods
const onPackageSelect = (value: number | undefined, node: any) => {
  if (!value) return

  const selectedPackage = packages.value.find((pkg) => pkg.id === value)
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

const calculateDueDate = () => {
  const paymentTerms = invoiceForm.value.payment_terms
  const issueDate = new Date()

  let daysToAdd = 30 // Default to 30 days

  if (paymentTerms === 'Net 15') daysToAdd = 15
  else if (paymentTerms === 'Net 30') daysToAdd = 30
  else if (paymentTerms === 'Net 45') daysToAdd = 45
  else if (paymentTerms === 'Net 60') daysToAdd = 60
  else if (paymentTerms === 'Due on receipt' || paymentTerms === 'COD') daysToAdd = 0

  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + daysToAdd)

  invoiceForm.value.due_date = dueDate.toISOString().split('T')[0]
}

const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = Number(price) || 0
  return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const saveDraft = async () => {
  await submitInvoice('draft')
}

const submitInvoice = async (status: 'draft' | 'sent' = 'draft') => {
  if (!isFormValid.value) {
    console.error('Form is not valid')
    return
  }

  loading.value = true

  try {
    // Prepare invoice data
    const invoiceData: CreateInvoiceRequest = {
      customer_id: Number(invoiceForm.value.customer_id),
      issue_date: new Date().toISOString().split('T')[0],
      due_date: invoiceForm.value.due_date,
      status: invoiceForm.value.status as InvoiceStatus,
      total: calculations.value.total,
      tax_total: 0, // No tax calculation as per requirements
      payment_terms: invoiceForm.value.payment_terms,
      notes: invoiceForm.value.notes || undefined,
      sales_person_id: Number(invoiceForm.value.sales_person_id),
      check_in: invoiceForm.value.check_in || undefined,
      check_out: invoiceForm.value.check_out || undefined,
      villa_ids:
        invoiceForm.value.villa_ids.length > 0
          ? invoiceForm.value.villa_ids.map((id) => Number(id))
          : undefined,
      items: invoiceForm.value.items.map((item) => ({
        package_id: Number(item.package_id),
        unit_price: Number(item.unit_price),
        pax: Number(item.pax) || 1,
        discount: Number(item.discount),
        line_total: Number(item.line_total),
      })),
    }

    // Create the invoice
    await createInvoice(invoiceData)

    console.log(`Invoice ${status === 'draft' ? 'saved as draft' : 'created'} successfully`)

    // Redirect to invoices list
    router.push('/invoices')
  } catch (error) {
    handleError(error, 'submitInvoice')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(
  () => invoiceForm.value.items,
  (newItems) => {
    // Update line_total for each item when unit_price, pax, or discount changes
    newItems.forEach((item) => {
      const unitPrice = Number(item.unit_price) || 0
      const pax = Number(item.pax) || 1
      const discount = Number(item.discount) || 0
      item.line_total = Math.max(0, unitPrice * pax - discount)
    })
  },
  { deep: true },
)

// Auto-calculate due date when payment terms change
watch(
  () => invoiceForm.value.payment_terms,
  () => {
    if (invoiceForm.value.payment_terms) {
      calculateDueDate()
    }
  },
)

// Watch for date changes to load available villas (allows same-day bookings)
watch(
  [() => invoiceForm.value.check_in, () => invoiceForm.value.check_out],
  async ([checkIn, checkOut]) => {
    if (checkIn && checkOut && new Date(checkOut) >= new Date(checkIn)) {
      await loadAvailableVillas(checkIn, checkOut)
    }
  },
)

const loadAvailableVillas = async (checkIn: string, checkOut: string) => {
  try {
    const response = await villaService.getAvailableVillas(checkIn, checkOut)
    villas.value = response.villas || response || []
  } catch (error) {
    console.error('Error loading available villas:', error)
    villas.value = []
  }
}

const triggerDatePicker = (event: Event) => {
  // Find the closest date input element from the clicked calendar icon
  const target = event.target as HTMLElement
  const wrapper = target.closest('.formkit-outer')
  if (wrapper) {
    const input = wrapper.querySelector('input[type="date"]') as HTMLInputElement
    if (input) {
      // Focus the input first
      input.focus()
      // Use showPicker API if available (modern browsers)
      if (input.showPicker) {
        try {
          input.showPicker()
        } catch (e) {
          // Fallback: trigger click on the input
          input.click()
        }
      } else {
        // Fallback for browsers without showPicker
        input.click()
      }
    }
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Load customers, packages, and sales users for the dropdowns
    await Promise.all([fetchCustomers({ active_only: true }), loadPackages(), fetchSalesUsers()])

    // Set default due date
    calculateDueDate()
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
    packages.value = Array.isArray(response) ? response : response.packages || []
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
    salesUsers.value = allUsers.filter(
      (user: User) => user.role === 'sales' && user.is_active !== false,
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
</script>

<style scoped>
/* Additional custom styles if needed */
.formkit-outer[data-type='repeater'] {
  @apply max-w-none;
}

.formkit-item {
  @apply border border-[#e5e7eb] rounded-[0.5rem] p-[1rem] mb-[1rem] bg-[#ffffff] dark:border-[#374151] dark:bg-[#1f2937];
}

.formkit-controls {
  @apply bg-[#f9fafb] dark:bg-[#1f2937];
}

/* Ensure consistent height and alignment for repeater form fields */
.formkit-outer[data-type='repeater'] .formkit-item .formkit-outer {
  @apply flex flex-col justify-center;
}

.formkit-outer[data-type='repeater'] .formkit-item .formkit-input {
  @apply min-h-[2.75rem] flex items-center;
}

.formkit-outer[data-type='repeater'] .formkit-item .formkit-wrapper {
  @apply flex items-center;
}

/* Align labels consistently */
.formkit-outer[data-type='repeater'] .formkit-item .formkit-label {
  @apply mb-[0.5rem] block text-[0.875rem] font-[500];
}

/* Ensure help text doesn't affect alignment */
.formkit-outer[data-type='repeater'] .formkit-item .formkit-help {
  @apply mt-[0.25rem] text-[0.75rem];
}
</style>
