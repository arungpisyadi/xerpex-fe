<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Create Booking" />
    </div>

    <div
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="mb-[1.5rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-[700] text-black dark:text-white">Create New Booking</h2>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push('/bookings')"
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
        v-model="bookingForm"
        :disabled="loading"
      >
        <!-- Customer Selection and Booking Date -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormKit
              type="select"
              name="customer_id"
              label="Select Customer"
              :options="customerOptions"
              placeholder="Choose a customer"
              validation="required"
              help="Select the customer for this booking"
            />
          </div>
          <div>
            <FormKit
              type="date"
              name="booking_date"
              label="Booking Date"
              validation="required"
              help="Date of booking creation"
            >
              <template #suffixIcon>
                <div @click="triggerDatePicker($event)" class="cursor-pointer">
                  <CalenderIcon />
                </div>
              </template>
            </FormKit>
          </div>
        </div>

        <!-- Check-in and Check-out Dates -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormKit
            type="date"
            name="check_in"
            label="Check-in Date"
            validation="required"
            help="Guest check-in date"
            @input="calculateNights"
          >
            <template #suffixIcon>
              <div @click="triggerDatePicker($event)" class="cursor-pointer">
                <CalenderIcon />
              </div>
            </template>
          </FormKit>
          <FormKit
            type="date"
            name="check_out"
            label="Check-out Date"
            validation="required"
            help="Guest check-out date"
            @input="calculateNights"
          >
            <template #suffixIcon>
              <div @click="triggerDatePicker($event)" class="cursor-pointer">
                <CalenderIcon />
              </div>
            </template>
          </FormKit>
        </div>

        <!-- Villa Selection (Taglist/Multi-select) -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormKit
            type="taglist"
            name="villa_ids"
            label="Select Villas"
            :options="villaOptions"
            placeholder="Choose villas for this booking"
            help="Select one or more villas for this booking"
            select-icon="down"
            :classes="{
              selectIcon: '!opacity-100 !block',
            }"
          />

          <!-- Salesperson Selection -->
          <FormKit
            type="select"
            name="salesmen_id"
            label="Salesperson"
            :options="salespersonOptions"
            placeholder="Select salesperson"
            help="Assign a salesperson to this booking"
            validation="required"
          />
        </div>

        <!-- Package Repeater (Like Quotations/Invoice Module) -->
        <div class="mb-[1.5rem]">
          <h3 class="text-lg font-[600] text-black dark:text-white mb-[1rem]">Packages</h3>

          <FormKit
            type="repeater"
            name="packages"
            :min="1"
            add-label="+ Add Package"
            remove-label="Remove"
            up-label="Move Up"
            down-label="Move Down"
            help="Add packages to this booking. At least one package is required."
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
                  @input="calculatePackageTotal"
                  help="Price per pax"
                />
              </div>

              <!-- PAX -->
              <div class="sm:col-span-2">
                <FormKit
                  type="number"
                  name="pax"
                  label="PAX"
                  placeholder="1"
                  validation="required|min:1"
                  @input="calculatePackageTotal"
                  help="Number of people"
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
                  validation="min:0"
                  @input="calculatePackageTotal"
                  help="Discount in IDR"
                />
              </div>

              <!-- Line Total (Read-only) -->
              <div class="sm:col-span-2">
                <FormKit
                  type="currency"
                  name="line_total"
                  label="Line Total"
                  currency="IDR"
                  :step="0.01"
                  :min="0"
                  disabled
                  help="Auto-calculated"
                />
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Notes -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-[1rem] sm:grid-cols-2">
          <FormKit
            type="textarea"
            name="notes"
            label="Internal Notes"
            placeholder="Add any internal notes for this booking"
            help="Internal notes (not visible to customer)"
            rows="3"
          />
          <FormKit
            type="textarea"
            name="customer_notes"
            label="Customer Notes"
            placeholder="Add any notes for the customer"
            help="Notes visible to the customer"
            rows="3"
          />
        </div>

        <!-- Calculations Summary -->
        <div
          class="mb-[1.5rem] rounded-[0.5rem] border border-[#e5e7eb] bg-[#f9fafb] p-[1rem] dark:border-[#374151] dark:bg-[#1f2937]"
        >
          <h4 class="text-md font-[600] text-black dark:text-white mb-[0.75rem]">
            Booking Summary
          </h4>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Number of Nights:</span>
              <span class="font-[500] text-black dark:text-white"
                >{{ calculations.numNights }} nights</span
              >
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Subtotal:</span>
              <span class="font-[500] text-black dark:text-white"
                >Rp {{ formatPrice(calculations.subtotal) }}</span
              >
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Tax (10%):</span>
              <span class="font-[500] text-black dark:text-white"
                >Rp {{ formatPrice(calculations.tax_amount) }}</span
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
          <FormKit type="button" @click="$router.push('/bookings')" :disabled="loading">
            Cancel
          </FormKit>

          <FormKit type="submit" :disabled="loading || !isFormValid">
            {{ loading ? 'Creating...' : 'Save Booking' }}
          </FormKit>
        </div>
      </FormKit>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import CalenderIcon from '../icons/CalenderIcon.vue'
import { useInvoicing } from '../composables/useInvoicing'
import bookingService from '../services/booking.service'
import villaService from '../services/villa.service.ts'
import packageService from '../services/package.service.ts'
import userService from '../services/user.service.ts'
import type { Customer } from '../types/customer.types'
import type { CreateBookingRequest, BookingPackage } from '../types/booking.types'
import type { Package } from '../types/package.types'
import type { User } from '../services/auth.service'
import { handleError } from '../utils/errorHandler'

// Router
const router = useRouter()

// Composables
const { customers, loading: invoicingLoading, fetchCustomers } = useInvoicing()

// Reactive state
const loading = ref(false)
const villas = ref<any[]>([])
const packages = ref<Package[]>([])
const salespeople = ref<User[]>([])
const currentUser = ref<User | null>(null)

// Form data structure
const bookingForm = ref({
  customer_id: '',
  booking_date: new Date().toISOString().split('T')[0],
  check_in: '',
  check_out: '',
  villa_ids: [] as number[],
  salesmen_id: '', // Add salesperson field
  packages: [
    {
      package_id: '',
      unit_price: 0,
      pax: 1,
      discount: 0,
      line_total: 0,
    },
  ],
  subtotal: 0,
  tax_amount: 0,
  total_amount: 0,
  notes: '',
  customer_notes: '',
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

const villaOptions = computed(() => {
  if (!villas.value || !Array.isArray(villas.value)) {
    return []
  }

  return villas.value.map((villa: any) => ({
    label: villa.name,
    value: villa.id,
  }))
})

const packageOptions = computed(() => {
  if (!packages.value || !Array.isArray(packages.value)) {
    return []
  }

  return packages.value.map((pkg: Package) => ({
    label: `${pkg.name} - Rp ${formatPrice(pkg.cost_per_pax)}`,
    value: pkg.id,
    cost_per_pax: pkg.cost_per_pax,
  }))
})

const salespersonOptions = computed(() => {
  if (!salespeople.value || !Array.isArray(salespeople.value)) {
    return [{ label: 'Select a salesperson', value: '', attrs: { disabled: true } }]
  }

  return [
    { label: 'Select a salesperson', value: '', attrs: { disabled: true } },
    ...salespeople.value.map((sp: User) => ({
      label: sp.full_name || `User #${sp.id}`,
      value: sp.id,
    })),
  ]
})

const calculations = computed(() => {
  const packagesData = bookingForm.value.packages || []

  const subtotal = packagesData.reduce((sum, pkg) => {
    const lineTotal = Number(pkg.line_total) || 0
    return sum + lineTotal
  }, 0)

  const taxRate = 0.1 // 10% tax rate
  const tax_amount = subtotal * taxRate
  const total = subtotal + tax_amount

  // Calculate number of nights
  const numNights = calculateNumNights(bookingForm.value.check_in, bookingForm.value.check_out)

  return {
    subtotal,
    tax_amount,
    total,
    numNights,
  }
})

const isFormValid = computed(() => {
  const form = bookingForm.value

  // Check if customer is selected
  if (!form.customer_id) return false

  // Check if dates are set and valid
  if (!form.check_in || !form.check_out) return false
  if (new Date(form.check_out) <= new Date(form.check_in)) return false

  // Check if at least one package exists and is valid
  if (!form.packages || form.packages.length === 0) return false

  // Check if all packages have required fields
  return form.packages.every(
    (pkg) => pkg.package_id && Number(pkg.unit_price) >= 0 && Number(pkg.pax) > 0,
  )
})

// Methods
const onPackageSelect = (value: number | undefined, node: any) => {
  if (!value) return

  const selectedPackage = packages.value.find((p) => p.id === value)
  if (selectedPackage && node?.parent?.value) {
    // Auto-populate unit_price from package cost_per_pax
    node.parent.value.unit_price = selectedPackage.cost_per_pax || 0
    // Trigger calculation
    calculatePackageTotal()
  }
}

const calculatePackageTotal = () => {
  // This will be triggered by FormKit's reactivity
  // The actual calculation is handled in the watcher below
}

const calculateNumNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (checkOutDate <= checkInDate) return 0

  const diffTime = checkOutDate.getTime() - checkInDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

const calculateNights = () => {
  // Trigger recalculation of nights in computed property
}

const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = Number(price) || 0
  return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const handleFormSubmit = async () => {
  if (!isFormValid.value) {
    console.error('Form is not valid')
    return
  }

  loading.value = true

  try {
    const numNights = calculateNumNights(bookingForm.value.check_in, bookingForm.value.check_out)

    // Prepare booking data
    const bookingData: CreateBookingRequest = {
      customer_id: Number(bookingForm.value.customer_id),
      booking_date: bookingForm.value.booking_date,
      check_in: bookingForm.value.check_in,
      check_out: bookingForm.value.check_out,
      villas: bookingForm.value.villa_ids.map((id) => Number(id)),
      sales_person_id: bookingForm.value.salesmen_id
        ? Number(bookingForm.value.salesmen_id)
        : undefined,
      items: bookingForm.value.packages.map((pkg) => ({
        package_id: Number(pkg.package_id),
        unit_price: Number(pkg.unit_price),
        pax: Number(pkg.pax),
        discount: Number(pkg.discount),
        line_total: Number(pkg.line_total) || 0,
      })),
      subtotal: calculations.value.subtotal,
      tax_total: 0.0,
      total_amount: calculations.value.total,
      notes: bookingForm.value.notes || undefined,
      customer_notes: bookingForm.value.customer_notes || undefined,
    }

    console.log('Booking payload before API call:', JSON.stringify(bookingData, null, 2))

    // Create the booking
    const booking = await bookingService.createBooking(bookingData)

    console.log('Booking created successfully:', booking)

    // Redirect to booking detail
    router.push(`/bookings/${booking.id}`)
  } catch (error) {
    handleError(error, 'createBooking')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(
  () => bookingForm.value.packages,
  (newPackages) => {
    // Update line_total for each package when values change
    newPackages.forEach((pkg) => {
      const unitPrice = Number(pkg.unit_price) || 0
      const pax = Number(pkg.pax) || 1
      const discount = Number(pkg.discount) || 0
      pkg.line_total = Math.max(0, unitPrice * pax - discount)
    })

    // Update overall totals
    bookingForm.value.subtotal = calculations.value.subtotal
    bookingForm.value.tax_amount = calculations.value.tax_amount
    bookingForm.value.total_amount = calculations.value.total
  },
  { deep: true },
)

// Lifecycle
onMounted(async () => {
  try {
    // Get current user and auto-select if sales role
    getCurrentUser()

    // Load customers, villas, packages, and salespeople for the dropdowns
    await Promise.all([
      fetchCustomers({ active_only: true }),
      loadVillas(),
      loadPackages(),
      loadSalespeople(),
    ])
  } catch (error) {
    handleError(error, 'loadData')
  }
})

const getCurrentUser = () => {
  // Get current user from localStorage
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)

      // Auto-select if user is sales
      if (currentUser.value?.role === 'sales') {
        bookingForm.value.salesmen_id = String(currentUser.value.id)
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
    }
  }
}

const loadSalespeople = async () => {
  try {
    const response = await userService.getUsers({ role: 'sales' })

    // Handle both array and object response formats
    if (Array.isArray(response)) {
      salespeople.value = response
    } else if (response && 'users' in response) {
      salespeople.value = response.users || []
    } else {
      salespeople.value = []
    }

    console.log('Salespeople loaded successfully:', salespeople.value.length, 'salespeople')
  } catch (error: any) {
    console.error('Error loading salespeople:', error)
    salespeople.value = []
  }
}

const loadVillas = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      villas.value = []
      return
    }

    const response = await villaService.getVillas({ active_only: true })
    console.log('Villa service response:', response)
    villas.value = Array.isArray(response) ? response : response.villas || []
    console.log('Villas loaded successfully:', villas.value.length, 'villas')
  } catch (error: any) {
    console.error('Error loading villas:', error)
    if (error.response?.status === 401) {
      console.error('Authentication failed - please log in again')
    } else if (error.response?.status === 404) {
      console.error('Villas endpoint not found')
    }
    villas.value = []
  }
}

const loadPackages = async () => {
  try {
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
    if (error.response?.status === 401) {
      console.error('Authentication failed - please log in again')
    } else if (error.response?.status === 404) {
      console.error('Packages endpoint not found')
    }
    packages.value = []
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
