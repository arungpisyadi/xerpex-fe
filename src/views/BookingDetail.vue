<template>
  <admin-layout>
    <!-- Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-999999 max-w-sm">
      <div
        :class="[
          'rounded-lg border p-4 shadow-lg',
          notification.type === 'success'
            ? 'border-success bg-success/10 text-success'
            : 'border-danger bg-red-500/10 text-danger'
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="notification.show = false" class="inline-flex rounded-md p-1.5 hover:bg-black/5">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <page-breadcrumb page-title="Booking Detail" :breadcrumbs="[
        { text: 'Bookings', href: '/bookings' },
        { text: `Booking ${booking?.booking_code || bookingId}` }
      ]" />
    </div>

    <!-- Action Buttons Section -->
    <div v-if="!loading" class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-black dark:text-white">Actions</h3>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <!-- Status Update Dropdown -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Update Status:</label>
            <select
              v-model="selectedStatus"
              @change="handleStatusUpdate"
              :disabled="actionLoading || booking.status === 'completed' || booking.status === 'cancelled'"
              class="relative z-20 appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select status...</option>
              <option value="pending" :disabled="booking.status === 'pending'">Pending</option>
              <option value="confirmed" :disabled="booking.status === 'confirmed'">Confirmed</option>
              <option value="checked_in" :disabled="booking.status === 'checked_in'">Checked In</option>
              <option value="checked_out" :disabled="booking.status === 'checked_out'">Checked Out</option>
              <option value="completed" :disabled="booking.status === 'completed'">Completed</option>
              <option value="cancelled" :disabled="booking.status === 'cancelled'">Cancelled</option>
            </select>
          </div>

          <!-- Mark as Confirmed Button -->
          <button
            v-if="booking.status === 'pending'"
            @click="confirmBooking"
            :disabled="actionLoading"
            class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="!actionLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-if="actionLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {{ actionLoading ? 'Processing...' : 'Mark as Confirmed' }}
          </button>

          <!-- Convert to Invoice Button -->
          <button
            v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
            @click="showConvertToInvoiceModal = true"
            :disabled="actionLoading"
            class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Convert to Invoice
          </button>

          <!-- Edit Button -->
          <button
            @click="$router.push(`/bookings/edit/${bookingId}`)"
            class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Booking
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Booking Status Banner -->
      <div class="mb-6 rounded-sm border p-4 shadow-default" :class="getStatusClass(booking.status)">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center">
            <span class="mr-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path v-if="booking.status === 'completed'" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path v-else-if="booking.status === 'cancelled'" d="M15 9L9 15M9 9L15 15" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path v-else d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-lg font-medium">Booking {{ booking.booking_code }} -
              {{ capitalizeFirstLetter(booking.status) }}</span>
          </div>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <!-- Left Column: Booking Summary and Customer Info -->
        <div class="md:col-span-1">
          <!-- Booking Summary -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Booking Summary
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Booking Code:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ booking.booking_code }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Booking Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.created_at) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Check-in:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.check_in) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Check-out:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.check_out) }}</span>
              </div>
              <!-- <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Total Pax:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ booking.total_pax }} {{ booking.total_pax === 1 ? 'person' : 'people' }}</span>
              </div> -->
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span class="text-sm font-medium px-2 py-1 rounded border" :class="getStatusClass(booking.status)">
                  {{ capitalizeFirstLetter(booking.status) }}
                </span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Salesperson:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ booking.sales_person?.full_name || 'Not assigned' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(booking.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Customer Information
            </h4>
            <div class="customer-info-section">
              <div v-if="booking.customer?.name" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                <div class="customer-name text-sm font-medium text-black dark:text-white mt-1">{{ booking.customer.name }}</div>
              </div>
              <div v-if="booking.customer?.email" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                <a :href="`mailto:${booking.customer.email}`"
                  class="text-sm text-primary hover:underline mt-1 block">{{ booking.customer.email }}</a>
              </div>
              <div v-if="booking.customer?.phone_number" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                <a :href="`tel:${booking.customer.phone_number}`" class="text-sm text-primary hover:underline mt-1 block">{{ booking.customer.phone_number }}</a>
              </div>
              <div v-if="booking.customer?.address" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Address:</span>
                <div class="text-sm text-black dark:text-white mt-1">{{ booking.customer.address }}</div>
              </div>
              <div v-if="booking.customer?.billing_address" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Billing Address:</span>
                <div class="text-sm text-black dark:text-white mt-1">{{ booking.customer.billing_address }}</div>
              </div>
              <div v-if="!booking.customer" class="text-center py-4">
                <p class="text-gray-500 dark:text-gray-400 text-sm italic">No customer information available.</p>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
              Booking Notes
            </h4>

            <div v-if="booking.notes" class="mb-6">
              <h5 class="mb-2 text-base font-medium text-black dark:text-white">Notes:</h5>
              <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                {{ booking.notes }}
              </p>
            </div>

            <div v-if="!booking.notes" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400 text-sm italic">No notes available.</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Villas, Packages, and Financial Summary -->
        <div class="md:col-span-2">
          <!-- Villas Section -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Selected Villas
            </h4>

            <div v-if="!booking.villas || booking.villas.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No villas selected for this booking.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="villaItem in booking.villas" :key="villaItem.id"
                class="border border-stroke dark:border-strokedark rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div class="flex items-start gap-4">
                  <svg class="w-6 h-6 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <div class="flex-1">
                    <h5 class="text-lg font-semibold text-black dark:text-white mb-2">{{ villaItem.villa.name }}</h5>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Room Type:</span>
                        <p class="text-sm font-medium text-black dark:text-white">{{ villaItem.villa.room_type }}</p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Capacity:</span>
                        <p class="text-sm font-medium text-black dark:text-white">{{ villaItem.villa.capacity }}</p>
                      </div>
                    </div>
                    <div v-if="villaItem.villa.description" class="mt-3">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Description:</span>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ villaItem.villa.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Packages Section -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Booking Packages
            </h4>

            <div v-if="!booking.items || booking.items.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No packages added to this booking.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full table-auto">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-800 text-left">
                    <th class="py-3 px-4 font-medium text-black dark:text-white">Package Name</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white">Type</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white">Category</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white text-right">Unit Price</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white text-center">Pax</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white text-right">Discount</th>
                    <th class="py-3 px-4 font-medium text-black dark:text-white text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in booking.items" :key="item.id"
                    class="border-b border-stroke dark:border-strokedark">
                    <td class="py-4 px-4">
                      <p class="text-sm font-medium text-black dark:text-white">{{ item.package.name }}</p>
                      <p v-if="item.package.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.package.description }}</p>
                    </td>
                    <td class="py-4 px-4">
                      <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {{ item.package.type }}
                      </span>
                    </td>
                    <td class="py-4 px-4">
                      <span class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {{ item.package.category }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-right text-sm text-black dark:text-white">
                      IDR {{ formatPrice(item.unit_price) }}
                    </td>
                    <td class="py-4 px-4 text-center text-sm font-medium text-black dark:text-white">
                      {{ item.pax }}
                    </td>
                    <td class="py-4 px-4 text-right text-sm text-red-600 dark:text-red-400">
                      {{ parseFloat(item.discount) > 0 ? '-IDR ' + formatPrice(item.discount) : '-' }}
                    </td>
                    <td class="py-4 px-4 text-right text-sm font-semibold text-black dark:text-white">
                      IDR {{ formatPrice(item.line_total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Financial Summary -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Financial Summary
            </h4>

            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Subtotal:</span>
                <span class="text-black dark:text-white font-medium">IDR {{ formatPrice(calculateSubtotal()) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Tax Total:</span>
                <span class="text-black dark:text-white font-medium">IDR {{ formatPrice(booking.tax_total) }}</span>
              </div>
              <div class="pt-3 border-t border-stroke dark:border-strokedark flex justify-between">
                <span class="text-lg font-bold text-black dark:text-white">Total Amount:</span>
                <span class="text-lg font-bold text-black dark:text-white">IDR {{ formatPrice(booking.total) }}</span>
              </div>
              <div class="pt-2 border-t border-stroke dark:border-strokedark flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Amount Paid:</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400">IDR {{ formatPrice(booking.amount_paid) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Amount Due:</span>
                <span class="text-sm font-medium text-red-600 dark:text-red-400">IDR {{ formatPrice(booking.amount_due) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Convert to Invoice Modal -->
    <div v-if="showConvertToInvoiceModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-md rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5 dark:border-strokedark dark:bg-boxdark">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Convert to Invoice
          </h4>
          <button @click="closeConvertToInvoiceModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Convert booking <strong>{{ booking.booking_code }}</strong> to an invoice?
          </p>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p class="text-sm text-blue-800 dark:text-blue-300">
              This will create a new invoice with all the booking details. The booking will remain unchanged.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="closeConvertToInvoiceModal"
            :disabled="actionLoading"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="convertToInvoice"
            :disabled="actionLoading"
            class="flex justify-center items-center gap-2 rounded bg-green-600 py-2 px-6 font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="actionLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {{ actionLoading ? 'Converting...' : 'Convert to Invoice' }}
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { bookingService } from '../services/index.ts';
import { formatNumber } from '../utils/number-formatter.ts';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      actionLoading: false,
      selectedStatus: '',
      showConvertToInvoiceModal: false,
      notification: {
        show: false,
        type: '',
        message: ''
      },
      booking: {
        id: 0,
        booking_code: '',
        customer_id: 0,
        check_in: '',
        check_out: '',
        total_pax: 0,
        status: 'pending',
        notes: '',
        sales_person_id: 0,
        total: '0',
        tax_total: '0',
        amount_paid: '0',
        amount_due: '0',
        created_at: '',
        updated_at: '',
        customer: null,
        sales_person: null,
        items: [],
        villas: []
      }
    };
  },
  computed: {
    bookingId() {
      return this.$route.params.id;
    }
  },
  async created() {
    await this.fetchBookingData();
  },
  methods: {
    async fetchBookingData() {
      try {
        this.loading = true;
        const response = await bookingService.getBookingById(this.bookingId);

        this.booking = response || {
          id: 0,
          booking_code: 'N/A',
          customer_id: 0,
          check_in: '',
          check_out: '',
          total_pax: 0,
          status: 'pending',
          notes: '',
          sales_person_id: 0,
          total: '0',
          tax_total: '0',
          amount_paid: '0',
          amount_due: '0',
          created_at: '',
          updated_at: '',
          customer: null,
          sales_person: null,
          items: [],
          villas: []
        };

        // Initialize selected status
        this.selectedStatus = '';
      } catch (error) {
        console.error('Error fetching booking data:', error);
        this.showNotification('error', 'Failed to load booking data. Please try again.');
        this.$router.push('/bookings');
      } finally {
        this.loading = false;
      }
    },
    async confirmBooking() {
      if (this.booking.status !== 'pending') {
        this.showNotification('error', 'Only pending bookings can be confirmed.');
        return;
      }

      try {
        this.actionLoading = true;
        await bookingService.confirmBooking(this.booking.id);
        this.showNotification('success', 'Booking confirmed successfully!');

        // Refresh booking data
        await this.fetchBookingData();
      } catch (error) {
        console.error('Error confirming booking:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm booking';
        this.showNotification('error', errorMessage);
      } finally {
        this.actionLoading = false;
      }
    },
    async handleStatusUpdate() {
      if (!this.selectedStatus) {
        return;
      }

      const confirmMessage = `Are you sure you want to update the booking status to "${this.capitalizeFirstLetter(this.selectedStatus)}"?`;

      if (!confirm(confirmMessage)) {
        this.selectedStatus = '';
        return;
      }

      try {
        this.actionLoading = true;
        await bookingService.updateBookingStatus(this.booking.id, this.selectedStatus);
        this.showNotification('success', `Booking status updated to ${this.capitalizeFirstLetter(this.selectedStatus)} successfully!`);

        // Refresh booking data
        await this.fetchBookingData();
      } catch (error) {
        console.error('Error updating booking status:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking status';
        this.showNotification('error', errorMessage);
        this.selectedStatus = '';
      } finally {
        this.actionLoading = false;
      }
    },
    async convertToInvoice() {
      try {
        this.actionLoading = true;

        // Prepare export data
        const exportData = {
          include_taxes: true,
          payment_terms: 'Due on receipt',
          notes: `Invoice generated from booking ${this.booking.booking_code}`
        };

        const response = await bookingService.exportToInvoice(this.booking.id, exportData);

        this.showNotification('success', 'Booking converted to invoice successfully!');
        this.closeConvertToInvoiceModal();

        // Navigate to the invoice detail page
        if (response.invoice_id) {
          setTimeout(() => {
            this.$router.push(`/invoices/${response.invoice_id}`);
          }, 1500);
        }
      } catch (error) {
        console.error('Error converting to invoice:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to convert booking to invoice';
        this.showNotification('error', errorMessage);
      } finally {
        this.actionLoading = false;
      }
    },
    closeConvertToInvoiceModal() {
      this.showConvertToInvoiceModal = false;
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message
      };

      setTimeout(() => {
        this.notification.show = false;
      }, 5000);
    },
    calculateSubtotal() {
      if (!this.booking.items || this.booking.items.length === 0) {
        return '0';
      }

      const subtotal = this.booking.items.reduce((sum, item) => {
        return sum + parseFloat(item.line_total || 0);
      }, 0);

      return subtotal.toString();
    },
    formatPrice(price) {
      if (price === null || price === undefined || price === '') {
        return '0.00';
      }

      const num = typeof price === 'string' ? parseFloat(price) : price;

      if (isNaN(num)) {
        return '0.00';
      }

      const formatted = formatNumber(num);

      if (!formatted.includes('.')) {
        return formatted + '.00';
      }

      const parts = formatted.split('.');
      if (parts[1] && parts[1].length === 1) {
        return formatted + '0';
      }

      return formatted;
    },
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    formatDateTime(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') return '';
      return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
    },
    getStatusClass(status) {
      const statusMap = {
        'pending': 'bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-900 dark:text-yellow-300',
        'confirmed': 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300',
        'checked_in': 'bg-green-100 text-green-800 border-green-400 dark:bg-green-900 dark:text-green-300',
        'checked_out': 'bg-purple-100 text-purple-800 border-purple-400 dark:bg-purple-900 dark:text-purple-300',
        'completed': 'bg-gray-100 text-gray-800 border-gray-400 dark:bg-gray-700 dark:text-gray-300',
        'cancelled': 'bg-red-100 text-red-800 border-red-400 dark:bg-red-900 dark:text-red-300'
      };

      const statusStr = status && typeof status === 'string' ? status.toLowerCase() : '';
      return statusMap[statusStr] || 'bg-gray-100 text-gray-800 border-gray-400 dark:bg-gray-700 dark:text-gray-300';
    }
  }
};
</script>
