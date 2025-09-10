<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Booking Detail" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Booking Status Banner -->
      <div class="mb-6 rounded-sm border p-4 shadow-default" :class="getStatusClass(booking.status)">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="mr-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-if="booking.status === 'confirmed'" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else-if="booking.status === 'cancelled'" d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else-if="booking.status === 'completed'" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="text-lg font-medium">Booking #{{ booking.id }} - {{ capitalizeFirstLetter(booking.status) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              v-if="booking.status === 'pending'"
              class="btn btn-sm btn-success"
              @click="updateBookingStatus('confirmed')"
            >
              Confirm
            </button>
            <button
              v-if="['pending', 'confirmed'].includes(booking.status)"
              class="btn btn-sm btn-danger"
              @click="updateBookingStatus('cancelled')"
            >
              Cancel
            </button>
            <button
              v-if="booking.status === 'confirmed' && isCheckoutPassed"
              class="btn btn-sm btn-primary"
              @click="updateBookingStatus('completed')"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Booking Summary -->
        <div class="md:col-span-1">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Booking Summary
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Booking ID:</span>
                <span class="text-sm font-medium text-black dark:text-white">#{{ booking.id }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Check-in:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.check_in) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Check-out:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.check_out) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Duration:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ getDuration(booking.check_in, booking.check_out) }} nights</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Guests:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ booking.guests }} persons</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(booking.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Last Updated:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(booking.updated_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Guest Information -->
          <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Guest Information
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex items-center">
                <span class="mr-2 text-gray-500">
                  <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                  </svg>
                </span>
                <span class="text-sm text-black dark:text-white">{{ booking.guest_name }}</span>
              </div>
              <div class="mb-3 flex items-center">
                <span class="mr-2 text-gray-500">
                  <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <span class="text-sm text-black dark:text-white">{{ booking.guest_email }}</span>
              </div>
              <div class="flex items-center">
                <span class="mr-2 text-gray-500">
                  <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </span>
                <span class="text-sm text-black dark:text-white">{{ booking.guest_phone || 'Not provided' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Villa Information and Payment Details -->
        <div class="md:col-span-2">
          <!-- Villa Information -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Villa Information
              </h4>
              <router-link :to="`/villas/${booking.villa_id}`" class="text-sm text-primary hover:underline">
                View Villa Details
              </router-link>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="md:w-1/3">
                <div class="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    v-if="villa.image_url"
                    :src="villa.image_url"
                    :alt="villa.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400">No image available</span>
                  </div>
                </div>
              </div>
              <div class="md:w-2/3">
                <h5 class="text-lg font-medium text-black dark:text-white mb-2">{{ villa.name }}</h5>
                <p class="text-sm text-gray-500 mb-3">{{ villa.location }}</p>
                <div class="grid grid-cols-2 gap-2">
                  <div class="flex items-center">
                    <span class="mr-2 text-gray-500">
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                      </svg>
                    </span>
                    <span class="text-sm text-black dark:text-white">{{ villa.capacity }} persons</span>
                  </div>
                  <div class="flex items-center">
                    <span class="mr-2 text-gray-500">
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z" />
                      </svg>
                    </span>
                    <span class="text-sm text-black dark:text-white">{{ villa.bedrooms }} bedrooms</span>
                  </div>
                  <div class="flex items-center">
                    <span class="mr-2 text-gray-500">
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z" />
                      </svg>
                    </span>
                    <span class="text-sm text-black dark:text-white">{{ villa.bathrooms }} bathrooms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Payment Details
            </h4>

            <div class="mb-6">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Base Rate ({{ getDuration(booking.check_in, booking.check_out) }} nights):</span>
                <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(booking.base_amount) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Cleaning Fee:</span>
                <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(booking.cleaning_fee) }}</span>
              </div>
              <div v-if="booking.additional_fees > 0" class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Additional Fees:</span>
                <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(booking.additional_fees) }}</span>
              </div>
              <div v-if="booking.discount > 0" class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Discount:</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400">-${{ formatPrice(booking.discount) }}</span>
              </div>
              <div v-if="booking.tax > 0" class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Tax:</span>
                <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(booking.tax) }}</span>
              </div>
              <div class="pt-3 border-t border-stroke dark:border-strokedark flex justify-between">
                <span class="text-base font-semibold text-black dark:text-white">Total Amount:</span>
                <span class="text-base font-semibold text-black dark:text-white">${{ formatPrice(booking.total_amount) }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-stroke dark:border-strokedark">
              <h5 class="mb-3 text-base font-semibold text-black dark:text-white">Payment Status</h5>
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                  <span class="text-sm px-2 py-1 rounded" :class="getPaymentStatusClass(booking.payment_status)">
                    {{ capitalizeFirstLetter(booking.payment_status) }}
                  </span>
                </div>
                <div v-if="booking.payment_date" class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                  <span class="text-sm text-black dark:text-white">{{ formatDateTime(booking.payment_date) }}</span>
                </div>
              </div>

              <div v-if="booking.payment_status !== 'paid'" class="flex justify-end">
                <button class="btn btn-primary" @click="markAsPaid">Mark as Paid</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes and Special Requests -->
      <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
          Notes and Special Requests
        </h4>

        <div v-if="booking.special_requests" class="mb-6">
          <h5 class="mb-2 text-base font-medium text-black dark:text-white">Guest Requests:</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            {{ booking.special_requests }}
          </p>
        </div>

        <div>
          <h5 class="mb-2 text-base font-medium text-black dark:text-white">Internal Notes:</h5>
          <textarea
            v-model="internalNotes"
            class="w-full rounded border-stroke bg-gray-100 py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-gray-800 dark:text-white"
            rows="4"
            placeholder="Add internal notes about this booking..."
          ></textarea>
          <div class="flex justify-end mt-2">
            <button class="btn btn-primary" @click="saveNotes">Save Notes</button>
          </div>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { bookingService, villaService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      booking: {
        status: 'pending',
        payment_status: 'pending'
      },
      villa: {},
      internalNotes: ''
    };
  },
  computed: {
    isCheckoutPassed() {
      if (!this.booking.check_out) return false;

      const checkoutDate = new Date(this.booking.check_out);
      const today = new Date();

      return checkoutDate < today;
    }
  },
  async created() {
    await this.fetchBookingData();
  },
  methods: {
    async fetchBookingData() {
      try {
        const bookingId = this.$route.params.id;

        // Fetch booking data
        this.booking = await bookingService.getBookingById(bookingId);

        // Fetch villa data
        if (this.booking.villa_id) {
          this.villa = await villaService.getVillaById(this.booking.villa_id);
        }

        // Set internal notes if available
        this.internalNotes = this.booking.internal_notes || '';
      } catch (error) {
        console.error('Error fetching booking data:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
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
    getDuration(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 0;

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },
    formatPrice(price) {
      if (!price) return '0.00';

      return parseFloat(price).toFixed(2);
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      const statusMap = {
        'confirmed': 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400',
        'pending': 'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-500 dark:text-yellow-400',
        'cancelled': 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400',
        'completed': 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-50 border-gray-500 text-gray-700 dark:bg-gray-900/30 dark:border-gray-500 dark:text-gray-400';
    },
    getPaymentStatusClass(status) {
      const statusMap = {
        'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'refunded': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    async updateBookingStatus(status) {
      try {
        // Show confirmation dialog
        if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) {
          return;
        }

        this.loading = true;

        // Update booking status
        await bookingService.updateBookingStatus(this.booking.id, status);

        // Refresh booking data
        await this.fetchBookingData();

        // Show success notification
        alert(`Booking status updated to ${status}`);
      } catch (error) {
        console.error('Error updating booking status:', error);
        // Show error notification
        alert('Failed to update booking status');
      } finally {
        this.loading = false;
      }
    },
    async markAsPaid() {
      try {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to mark this booking as paid?')) {
          return;
        }

        this.loading = true;

        // Update payment status
        await bookingService.updatePaymentStatus(this.booking.id, 'paid');

        // Refresh booking data
        await this.fetchBookingData();

        // Show success notification
        alert('Payment status updated to paid');
      } catch (error) {
        console.error('Error updating payment status:', error);
        // Show error notification
        alert('Failed to update payment status');
      } finally {
        this.loading = false;
      }
    },
    async saveNotes() {
      try {
        this.loading = true;

        // Update internal notes
        await bookingService.updateBookingNotes(this.booking.id, this.internalNotes);

        // Show success notification
        alert('Notes saved successfully');
      } catch (error) {
        console.error('Error saving notes:', error);
        // Show error notification
        alert('Failed to save notes');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
