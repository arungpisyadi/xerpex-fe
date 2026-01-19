<template>
  <admin-layout>
    <div class="mb-[1.5rem]">
      <page-breadcrumb page-title="Edit Booking" />
    </div>

    <!-- Loading State -->
    <div
      v-if="loadingBooking"
      class="rounded-sm border border-stroke bg-[#ffffff] px-[1.25rem] pt-[1.5rem] pb-[0.625rem] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-[1.875rem] xl:pb-[0.25rem]"
    >
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-3 text-[#4b5563] dark:text-gray-400">Loading booking...</span>
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
            @click="$router.push('/bookings')"
            class="px-[1rem] py-[0.5rem] bg-primary text-white rounded-[0.5rem] hover:bg-primary-dark"
          >
            Back to Bookings
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
            Edit Booking #{{ booking?.booking_number }}
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-[#4b5563] dark:text-gray-400">Status:</span>
            <span
              :class="getStatusClass(booking?.status)"
              class="px-2 py-1 text-xs font-[500] rounded-full"
            >
              {{ booking?.status?.toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="flex gap-[1rem]">
          <button
            @click="$router.push(`/bookings/${bookingId}`)"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#3b82f6] bg-[#eff6ff] border border-[#bfdbfe] rounded-[0.5rem] hover:bg-[#dbeafe] dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
          >
            View Full Details
          </button>
          <button
            @click="$router.push('/bookings')"
            class="flex items-center justify-center gap-2 px-[1rem] py-[0.75rem] text-sm font-[500] text-[#374151] bg-[#ffffff] border border-[#d1d5db] rounded-[0.5rem] hover:bg-[#f9fafb] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:border-[#4b5563] dark:hover:bg-[#374151]"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Non-editable Booking Warning -->
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
            This booking cannot be edited because its status is "{{ booking?.status }}". Only
            pending and confirmed bookings can be modified.
          </span>
        </div>
      </div>

      <FormKit
        type="form"
        :actions="false"
        @submit="submitBooking"
        v-model="bookingForm"
        :disabled="loading || !isEditable"
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
              :disabled="!isEditable"
            />
          </div>
          <div>
            <FormKit
              type="date"
              name="booking_date"
              label="Booking Date"
              validation="required"
              help="Date of booking creation"
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

        <!-- Check-in and Check-out Dates -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormKit
            type="date"
            name="check_in"
            label="Check-in Date"
            validation="required"
            help="Guest check-in date"
            @input="calculateNights"
            :disabled="!isEditable"
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
            :disabled="!isEditable"
          >
            <template #suffixIcon>
              <div @click="triggerDatePicker($event)" class="cursor-pointer">
                <CalenderIcon />
              </div>
            </template>
          </FormKit>
        </div>

        <!-- Villa Selection and Salesperson -->
        <div class="mb-[1.5rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormKit
            type="taglist"
            name="villa_ids"
            label="Select Villas"
            :options="villaOptions"
            placeholder="Choose villas for this booking"
            help="Select one or more villas for this booking"
            :disabled="!isEditable"
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
            :disabled="!isEditable"
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
                  @input="calculatePackageTotal"
                  :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
            :disabled="!isEditable"
            rows="3"
          />
          <FormKit
            type="textarea"
            name="customer_notes"
            label="Customer Notes"
            placeholder="Add any notes for the customer"
            help="Notes visible to the customer"
            :disabled="!isEditable"
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

            <div class="flex justify-between text-sm" v-if="calculations.totalDiscount > 0">
              <span class="text-[#4b5563] dark:text-gray-400">Total Discount:</span>
              <span class="font-[500] text-[#ef4444] dark:text-[#f87171]"
                >- Rp {{ formatPrice(calculations.totalDiscount) }}</span
              >
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-[#4b5563] dark:text-gray-400">Amount Paid:</span>
              <span class="font-[500] text-black dark:text-white"
                >Rp {{ formatPrice(bookingForm.amount_paid) }}</span
              >
            </div>

            <hr class="border-[#d1d5db] dark:border-gray-600" />

            <div class="flex justify-between text-lg font-[700]">
              <span class="text-black dark:text-white">Amount Due:</span>
              <span class="text-black dark:text-white"
                >Rp {{ formatPrice(calculations.subtotal - bookingForm.amount_paid) }}</span
              >
            </div>
          </div>
        </div>

        <!-- Form Actions - Editable -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-if="isEditable">
          <FormKit type="button" @click="$router.push('/bookings')" :disabled="loading">
            Cancel
          </FormKit>

          <FormKit type="submit" :disabled="loading || !isFormValid">
            {{ loading ? 'Updating...' : 'Update Booking' }}
          </FormKit>
        </div>

        <!-- Form Actions - Read-only -->
        <div class="flex justify-end gap-[1rem] mt-[1.5rem] pb-[1.5rem]" v-else>
          <FormKit type="button" @click="$router.push('/bookings')"> Back to Bookings </FormKit>
        </div>
      </FormKit>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import CalenderIcon from '../icons/CalenderIcon.vue'
import { useInvoicing } from '../composables/useInvoicing'
import bookingService from '../services/booking.service'
import villaService from '../services/villa.service.ts'
import packageService from '../services/package.service.ts'
import userService from '../services/user.service.ts'
import type { Customer } from '../types/customer.types'
import type { Booking, UpdateBookingRequest } from '../types/booking.types'
import type { Package } from '../types/package.types'
import type { User } from '../services/auth.service'
import { handleError } from '../utils/errorHandler'

// Router
const router = useRouter()
const route = useRoute()

// Get booking ID from route params
const bookingId = computed(() => route.params.id as string)

// Composables
const { customers, loading: invoicingLoading, fetchCustomers } = useInvoicing()

// Reactive state
const loading = ref(false)
const loadingBooking = ref(true)
const error = ref<string | null>(null)
const booking = ref<Booking | null>(null)
const villas = ref<any[]>([])
const packages = ref<Package[]>([])
const salespeople = ref<User[]>([])

// Form data structure
const bookingForm = ref({
  customer_id: '',
  booking_date: '',
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
  total_amount: 0,
  amount_paid: 0,
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

  // Calculate total discount from all items
  const totalDiscount = packagesData.reduce((sum, pkg) => {
    const discount = Number(pkg.discount) || 0
    return sum + discount
  }, 0)

  // Calculate subtotal before discount
  const subtotalBeforeDiscount = packagesData.reduce((sum, pkg) => {
    const unitPrice = Number(pkg.unit_price) || 0
    const pax = Number(pkg.pax) || 1
    return sum + (unitPrice * pax)
  }, 0)

  // Subtotal is after discount (total of all line_total values)
  const subtotal = packagesData.reduce((sum, pkg) => {
    const lineTotal = Number(pkg.line_total) || 0
    return sum + lineTotal
  }, 0)

  const total = subtotal

  // Calculate number of nights
  const numNights = calculateNumNights(bookingForm.value.check_in, bookingForm.value.check_out)

  return {
    subtotalBeforeDiscount,
    totalDiscount,
    subtotal,
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

const isEditable = computed(() => {
  // Only allow editing if status is pending or confirmed
  return booking.value?.status === 'pending' || booking.value?.status === 'confirmed'
})

// Methods
const getStatusClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-[#fef3c7] text-[#92400e] dark:bg-yellow-900 dark:text-yellow-300'
    case 'confirmed':
      return 'bg-[#dbeafe] text-[#1e40af] dark:bg-blue-900 dark:text-blue-300'
    case 'checked_in':
      return 'bg-[#e0e7ff] text-[#4338ca] dark:bg-indigo-900 dark:text-indigo-300'
    case 'checked_out':
      return 'bg-[#e0e7ff] text-[#6d28d9] dark:bg-purple-900 dark:text-purple-300'
    case 'completed':
      return 'bg-[#dcfce7] text-[#166534] dark:bg-green-900 dark:text-green-300'
    case 'cancelled':
      return 'bg-[#fee2e2] text-[#991b1b] dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-[#f3f4f6] text-[#1f2937] dark:bg-[#1f2937] dark:text-gray-300'
  }
}

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

const loadBookingData = async () => {
  if (!bookingId.value) {
    error.value = 'Booking ID is required'
    loadingBooking.value = false
    return
  }

  try {
    loadingBooking.value = true
    error.value = null

    // Fetch booking data
    const response = await bookingService.getBookingById(Number(bookingId.value))
    booking.value = response as any // Type assertion since API might return BookingDetail structure

    // console.log('Booking data loaded:', booking.value)

    // Extract villa IDs - handle both structures
    let villaIds: number[] = []
    if (booking.value?.villa_ids && Array.isArray(booking.value.villa_ids)) {
      // New structure with villa_ids array
      villaIds = booking.value.villa_ids
    } else if (booking.value?.villas && Array.isArray(booking.value.villas)) {
      // Legacy/API structure with nested villas
      villaIds = (booking.value.villas as any[])
        .map((v: any) => v.villa_id || v.villa?.id)
        .filter(Boolean)
    }

    // Extract packages/items - handle both structures
    let packagesData: any[] = []
    if (booking.value?.packages && Array.isArray(booking.value.packages)) {
      packagesData = booking.value.packages
    } else if ((booking.value as any)?.items && Array.isArray((booking.value as any).items)) {
      // API returns 'items' instead of 'packages'
      packagesData = (booking.value as any).items
    }

    // Extract sales person ID - handle both field names
    const salesPersonId = (booking.value as any)?.sales_person_id || booking.value?.salesmen_id

    // console.log('Extracted data:', {
    //   villaIds,
    //   packagesCount: packagesData.length,
    //   salesPersonId
    // })

    // Pre-populate form with booking data
    bookingForm.value = {
      customer_id: booking.value?.customer_id?.toString() || '',
      booking_date:
        booking.value?.booking_date ||
        (booking.value as any)?.created_at?.split('T')[0] ||
        new Date().toISOString().split('T')[0],
      check_in: booking.value?.check_in || booking.value?.earliest_check_in || '',
      check_out: booking.value?.check_out || booking.value?.latest_check_out || '',
      villa_ids: villaIds,
      salesmen_id: salesPersonId?.toString() || '',
      packages:
        packagesData.length > 0
          ? packagesData.map((pkg) => ({
              package_id: pkg.package_id?.toString() || '',
              unit_price: Number(pkg.unit_price) || 0,
              pax: Number(pkg.pax) || 1,
              discount: Number(pkg.discount) || 0,
              line_total: Number(pkg.line_total) || 0,
            }))
          : [
              {
                package_id: '',
                unit_price: 0,
                pax: 1,
                discount: 0,
                line_total: 0,
              },
            ],
      subtotal: Number(booking.value?.subtotal) || 0,
      total_amount:
        Number(booking.value?.total_amount) || Number((booking.value as any)?.total) || 0,
      amount_paid: Number(booking.value?.amount_paid) || 0,
      notes: booking.value?.notes || '',
      customer_notes: booking.value?.customer_notes || '',
    }

    // console.log('Form populated with values:', {
    //   customer_id: bookingForm.value.customer_id,
    //   booking_date: bookingForm.value.booking_date,
    //   villa_ids: bookingForm.value.villa_ids,
    //   salesmen_id: bookingForm.value.salesmen_id,
    //   packagesCount: bookingForm.value.packages.length
    // })
  } catch (err: any) {
    console.error('Error loading booking:', err)
    if (err.response?.status === 404) {
      error.value = 'Booking not found'
    } else if (err.response?.status === 403) {
      error.value = 'Access denied. You do not have permission to view this booking.'
    } else {
      error.value = 'Failed to load booking data'
    }
  } finally {
    loadingBooking.value = false
  }
}

const submitBooking = async () => {
  if (!isFormValid.value || !isEditable.value) {
    console.error('Form is not valid or booking is not editable')
    return
  }

  loading.value = true

  try {
    // Prepare booking data
    const bookingData: UpdateBookingRequest = {
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

    // console.log('Booking update payload before API call:', JSON.stringify(bookingData, null, 2))

    // Update the booking
    await bookingService.updateBooking(Number(bookingId.value), bookingData)

    // console.log('Booking updated successfully')

    // Redirect to booking detail
    router.push(`/bookings/${bookingId.value}`)
  } catch (error) {
    handleError(error, 'updateBooking')
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
    bookingForm.value.total_amount = calculations.value.total
  },
  { deep: true },
)

// Lifecycle
onMounted(async () => {
  try {
    // Load customers, villas, packages, salespeople, and booking data in parallel
    await Promise.all([
      fetchCustomers({ active_only: true }),
      loadVillas(),
      loadPackages(),
      loadSalespeople(),
      loadBookingData(),
    ])
  } catch (error) {
    handleError(error, 'loadData')
  }
})

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
