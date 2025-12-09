<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Edit Invoice" />
    </div>

    <!-- Loading State -->
    <div
      v-if="loadingInvoice"
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-3 text-[#4b5563] dark:text-gray-400">Loading invoice...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-[#ef4444] text-lg font-[600] mb-2">{{ error }}</div>
          <button
            @click="$router.push('/invoices')"
            class="px-[1rem] py-[0.5rem] bg-primary text-white rounded-[0.5rem] hover:bg-primary-dark"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div
      v-else
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-title-md2 font-[700] text-black dark:text-white">
            Edit Invoice #{{ invoice?.invoice_number }}
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">Status:</span>
            <span
              :class="getStatusClass(invoice?.status)"
              class="px-2 py-1 text-xs font-[500] rounded-full"
            >
              {{ invoice?.status?.toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push('/invoices')"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#374151] bg-[#ffffff] border border-[#d1d5db] rounded-[0.5rem] hover:bg-[#f9fafb] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:border-[#4b5563] dark:hover:bg-[#374151]"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Non-editable Invoice Warning -->
      <div
        v-if="!isEditable"
        class="mb-[1.5rem] p-[1rem] bg-[#fffbeb] border border-[#fde68a] rounded-[0.5rem] dark:bg-yellow-900/20 dark:border-yellow-800"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-[#d97706] dark:text-yellow-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-[#92400e] dark:text-yellow-200 font-[500]">
            This invoice cannot be edited because its status is "{{ invoice?.status }}". Only draft
            invoices can be modified.
          </span>
        </div>
      </div>

      <FormKit
        type="form"
        :actions="false"
        @submit="submitInvoice"
        v-model="invoiceForm"
        :disabled="loading || !isEditable"
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
              :disabled="!isEditable"
            />
          </div>
          <div>
            <FormKit
              type="select"
              name="sales_person_id"
              id="sales_person_id"
              label="Sales In Charge"
              placeholder="Select sales person"
              validation="required"
              :options="salesUserOptions"
              :disabled="!isEditable"
            />
          </div>
          <div>
            <FormKit
              type="date"
              name="check_in"
              label="Check-In Date"
              validation="required"
              help="Guest check-in date"
              :disabled="!isEditable"
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
              :disabled="!isEditable"
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
              :disabled="!isEditable"
            />
          </div>
          <div>
            <FormKit
              type="date"
              name="due_date"
              label="Due Date"
              help="When this invoice is due for payment"
              validation="required"
              :disabled="!isEditable"
            />
          </div>
          <div>
            <FormKit
              type="text"
              name="payment_terms"
              label="Payment Terms"
              placeholder="e.g., Net 30 days"
              help="Payment terms for this invoice"
              :disabled="!isEditable"
            />
          </div>
        </div>

        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div class="flex items-center">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">
              Issue Date: {{ formatDate(new Date(invoice?.issue_date || new Date())) }}
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
            :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-if="isEditable">
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
            {{ loading ? 'Updating...' : 'Update Invoice' }}
          </FormKit>
        </div>

        <!-- Read-only actions -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-else>
          <!-- <FormKit
            type="button"
            @click="$router.push('/invoices')"
          >
            Back to Invoices!
          </FormKit> -->
        </div>
      </FormKit>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import CalenderIcon from '../../icons/CalenderIcon.vue'
import { useInvoicing } from '../../composables/useInvoicing'
import invoiceService from '../../services/invoice.service.ts'
import packageService from '../../services/package.service.ts'
import userService from '../../services/user.service'
import villaService from '../../services/villa.service'
import type { Customer } from '../../types/customer.types'
import type { Invoice, UpdateInvoiceRequest, InvoiceItem } from '../../types/invoice.types'
import type { Package } from '../../types/package.types'
import type { User } from '../../services/auth.service'
import { handleError } from '../../utils/errorHandler'

// Router
const router = useRouter()
const route = useRoute()

// Get invoice ID from route params
console.log(route.params)

const invoiceId = computed(() => route.params.invoiceId as string)

// Composables
const { customers, loading: invoicingLoading, fetchCustomers } = useInvoicing()

// Reactive state
const loading = ref(false)
const loadingInvoice = ref(true)
const error = ref<string | null>(null)
const invoice = ref<Invoice | null>(null)
const packages = ref<Package[]>([])
const salesUsers = ref<User[]>([])
const villas = ref<any[]>([])

// Form data structure
const invoiceForm = ref({
  customer_id: '',
  sales_person_id: '',
  check_in: '',
  check_out: '',
  villa_ids: [] as number[],
  due_date: '',
  payment_terms: '',
  notes: '',
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

  // Check if due_date is provided
  if (!form.due_date) return false

  // Check if at least one item exists and is valid
  if (!form.items || form.items.length === 0) return false

  // Check if all items have required fields
  return form.items.every(
    (item) =>
      item.package_id &&
      Number(item.unit_price) >= 0 &&
      Number(item.pax) >= 1 &&
      Number(item.discount) >= 0,
  )
})

const isEditable = computed(() => {
  return invoice.value?.status === 'draft'
})

// Methods
const getStatusClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'bg-[#f3f4f6] text-[#1f2937] dark:bg-[#1f2937] dark:text-gray-300'
    case 'sent':
      return 'bg-[#dbeafe] text-[#1e40af] dark:bg-blue-900 dark:text-blue-300'
    case 'paid':
      return 'bg-[#dcfce7] text-[#166534] dark:bg-green-900 dark:text-green-300'
    case 'overdue':
      return 'bg-[#fee2e2] text-[#991b1b] dark:bg-red-900 dark:text-red-300'
    case 'cancelled':
      return 'bg-[#fef3c7] text-[#92400e] dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-[#f3f4f6] text-[#1f2937] dark:bg-[#1f2937] dark:text-gray-300'
  }
}

const onPackageSelect = (value: number | undefined, node: any) => {
  if (!value) return

  const selectedPackage = packages.value.find((pkg) => pkg.id === value)
  if (selectedPackage && node?.parent?.value) {
    // Auto-populate unit_price from package cost_per_pax
    node.parent.value.unit_price = selectedPackage.cost_per_pax
    node.parent.value.discount = 0
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
    day: 'numeric',
  })
}

const loadInvoiceData = async () => {
  console.log(invoiceId)

  if (!invoiceId.value) {
    error.value = 'Invoice ID is required'
    loadingInvoice.value = false
    return
  }

  try {
    loadingInvoice.value = true
    error.value = null

    // Fetch invoice data
    const response = await invoiceService.getInvoice(Number(invoiceId.value))
    // console.log(response);

    invoice.value = response as unknown as Invoice

    // Convert status to string if it's an array
    if (invoice.value && invoice.value.status) {
      invoice.value.status = Array.isArray(invoice.value.status)
        ? invoice.value.status[0]
        : invoice.value.status
    }

    // Pre-populate form with invoice data
    if (invoice.value) {
      invoiceForm.value = {
        customer_id: invoice.value.customer_id?.toString() || '',
        sales_person_id: (invoice.value as any).sales_person_id?.toString() || '',
        check_in: (invoice.value as any).check_in || '',
        check_out: (invoice.value as any).check_out || '',
        villa_ids: (invoice.value as any).villa_ids || [],
        due_date: invoice.value.due_date || '',
        payment_terms: invoice.value.payment_terms || '',
        notes: invoice.value.notes || '',
        items: invoice.value.items?.map((item) => ({
          package_id: item.package_id?.toString() || '',
          unit_price: item.unit_price || 0,
          pax: item.pax || 1,
          discount: item.discount || 0,
          line_total: item.line_total || 0,
        })) || [
          {
            package_id: '',
            unit_price: 0,
            pax: 1,
            discount: 0,
            line_total: 0,
          },
        ],
      }
    }

    // Load available villas if dates are present
    if (invoiceForm.value.check_in && invoiceForm.value.check_out) {
      await loadAvailableVillas(invoiceForm.value.check_in, invoiceForm.value.check_out)
    }
  } catch (err: any) {
    console.error('Error loading invoice:', err)
    if (err.response?.status === 404) {
      error.value = 'Invoice not found'
    } else if (err.response?.status === 403) {
      error.value = 'Access denied. You do not have permission to view this invoice.'
    } else {
      error.value = 'Failed to load invoice data'
    }
  } finally {
    loadingInvoice.value = false
  }
}

const saveDraft = async () => {
  await submitInvoice('draft')
}

const submitInvoice = async (status: 'draft' | 'sent' = 'draft') => {
  if (!isFormValid.value || !isEditable.value) {
    console.error('Form is not valid or invoice is not editable')
    return
  }

  loading.value = true

  try {
    // Prepare invoice data
    const invoiceData: UpdateInvoiceRequest = {
      customer_id: Number(invoiceForm.value.customer_id),
      sales_person_id: Number(invoiceForm.value.sales_person_id),
      due_date: invoiceForm.value.due_date || undefined,
      payment_terms: invoiceForm.value.payment_terms || undefined,
      notes: invoiceForm.value.notes || undefined,
      status: invoice.value?.status,
      total: calculations.value.total,
      tax_total: 0, // No tax calculation as per requirements
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

    // Update the invoice
    await invoiceService.updateInvoice(Number(invoiceId.value), invoiceData)

    console.log(`Invoice ${status === 'draft' ? 'saved as draft' : 'updated'} successfully`)

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

// Watch for date changes to load available villas
watch(
  [() => invoiceForm.value.check_in, () => invoiceForm.value.check_out],
  async ([checkIn, checkOut]) => {
    if (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
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
    // Load customers, packages, sales users, and invoice data in parallel
    await Promise.all([
      fetchCustomers({ active_only: true }),
      loadPackages(),
      fetchSalesUsers(),
      loadInvoiceData(),
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
