<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Invoices', link: '/invoices' }, { text: 'Invoice Detail' }]" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Invoice Status Banner -->
      <div class="mb-6 rounded-sm border p-4 shadow-default" :class="getStatusClass(invoice.status)">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="mr-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-if="invoice.status === 'paid'" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else-if="invoice.status === 'cancelled'" d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else-if="invoice.status === 'overdue'" d="M12 8V12L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="text-lg font-medium">Invoice #{{ invoice.invoice_number }} - {{ capitalizeFirstLetter(invoice.status) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
              class="btn btn-sm btn-success"
              @click="updateInvoiceStatus('paid')"
            >
              Mark as Paid
            </button>
            <button
              v-if="invoice.status === 'pending'"
              class="btn btn-sm btn-danger"
              @click="updateInvoiceStatus('cancelled')"
            >
              Cancel Invoice
            </button>
            <button class="btn btn-sm btn-primary" @click="downloadInvoice">
              Download PDF
            </button>
            <button class="btn btn-sm btn-outline-primary" @click="sendInvoice">
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Invoice Summary -->
        <div class="md:col-span-1">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Invoice Summary
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Invoice Number:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ invoice.invoice_number }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(invoice.amount) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Issue Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(invoice.issue_date) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(invoice.due_date) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span class="text-sm font-medium px-2 py-1 rounded" :class="getStatusClass(invoice.status)">
                  {{ capitalizeFirstLetter(invoice.status) }}
                </span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ invoice.payment_date ? formatDate(invoice.payment_date) : 'Not paid yet' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(invoice.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div v-if="invoice.status === 'paid'" class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Payment Information
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ invoice.payment_method || 'N/A' }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Transaction ID:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ invoice.transaction_id || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(invoice.payment_date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Information and Invoice Details -->
        <div class="md:col-span-2">
          <!-- Booking Information -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Booking Information
              </h4>
              <router-link :to="`/bookings/${booking.id}`" class="text-sm text-primary hover:underline">
                View Booking Details
              </router-link>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="md:w-1/3">
                <div class="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    v-if="booking.villa && booking.villa.image_url"
                    :src="booking.villa.image_url"
                    :alt="booking.villa.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400">No image available</span>
                  </div>
                </div>
              </div>
              <div class="md:w-2/3">
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Booking ID:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">#{{ booking.id }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Guest:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">{{ booking.guest_name }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Villa:</span>
                  <router-link
                    v-if="booking.villa"
                    :to="`/villas/${booking.villa.id}`"
                    class="text-sm text-primary hover:underline ml-2"
                  >
                    {{ booking.villa.name }}
                  </router-link>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400 ml-2">N/A</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Stay Period:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">
                    {{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Booking Status:</span>
                  <span class="text-sm font-medium px-2 py-1 rounded ml-2" :class="getBookingStatusClass(booking.status)">
                    {{ capitalizeFirstLetter(booking.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Breakdown -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Invoice Breakdown
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
                <span class="text-base font-semibold text-black dark:text-white">${{ formatPrice(invoice.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Notes -->
      <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
          Invoice Notes
        </h4>

        <div v-if="invoice.notes" class="mb-6">
          <h5 class="mb-2 text-base font-medium text-black dark:text-white">Notes:</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            {{ invoice.notes }}
          </p>
        </div>

        <div>
          <h5 class="mb-2 text-base font-medium text-black dark:text-white">Add Notes:</h5>
          <textarea
            v-model="invoiceNotes"
            class="w-full rounded border-stroke bg-gray-100 py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-gray-800 dark:text-white"
            rows="4"
            placeholder="Add notes about this invoice..."
          ></textarea>
          <div class="flex justify-end mt-2">
            <button class="btn btn-primary" @click="saveNotes">Save Notes</button>
          </div>
        </div>
      </div>

      <!-- Invoice History -->
      <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
          Invoice History
        </h4>

        <div v-if="invoiceHistory.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No invoice history available.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
                <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th class="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  User
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in invoiceHistory" :key="index">
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ formatDateTime(history.timestamp) }}</p>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ history.action }}</p>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(history.status)">
                    {{ capitalizeFirstLetter(history.status) }}
                  </span>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ history.user }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { invoiceService, bookingService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      invoice: {},
      booking: {},
      invoiceHistory: [],
      invoiceNotes: ''
    };
  },
  async created() {
    await this.fetchInvoiceData();
  },
  methods: {
    async fetchInvoiceData() {
      try {
        const invoiceId = this.$route.params.id;

        // Fetch invoice data
        this.invoice = await invoiceService.getInvoiceById(invoiceId);

        // Set invoice notes if available
        this.invoiceNotes = this.invoice.notes || '';

        // Fetch booking data if booking_id is available
        if (this.invoice.booking_id) {
          this.booking = await bookingService.getBookingById(this.invoice.booking_id);
        }

        // Fetch invoice history
        const historyResponse = await invoiceService.getInvoiceHistory(invoiceId);
        this.invoiceHistory = historyResponse.items || [];
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      if (!price) return '0.00';

      return parseFloat(price).toFixed(2);
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
    capitalizeFirstLetter(string) {
      if (!string) return '';

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      const statusMap = {
        'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    getBookingStatusClass(status) {
      const statusMap = {
        'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    async updateInvoiceStatus(status) {
      try {
        // Show confirmation dialog
        if (!confirm(`Are you sure you want to mark this invoice as ${status}?`)) {
          return;
        }

        this.loading = true;

        // Update invoice status
        await invoiceService.updateInvoiceStatus(this.invoice.id, status);

        // Refresh invoice data
        await this.fetchInvoiceData();

        // Show success notification
        alert(`Invoice status updated to ${status}`);
      } catch (error) {
        console.error('Error updating invoice status:', error);
        // Show error notification
        alert('Failed to update invoice status');
      } finally {
        this.loading = false;
      }
    },
    async saveNotes() {
      try {
        this.loading = true;

        // Update invoice notes
        await invoiceService.updateInvoiceNotes(this.invoice.id, this.invoiceNotes);

        // Refresh invoice data
        await this.fetchInvoiceData();

        // Show success notification
        alert('Notes saved successfully');
      } catch (error) {
        console.error('Error saving notes:', error);
        // Show error notification
        alert('Failed to save notes');
      } finally {
        this.loading = false;
      }
    },
    async downloadInvoice() {
      try {
        // Download invoice PDF
        await invoiceService.downloadInvoice(this.invoice.id);

        // Show success notification
        alert('Invoice downloaded successfully');
      } catch (error) {
        console.error('Error downloading invoice:', error);
        // Show error notification
        alert('Failed to download invoice');
      }
    },
    async sendInvoice() {
      try {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to send this invoice to the guest?')) {
          return;
        }

        this.loading = true;

        // Send invoice
        await invoiceService.sendInvoice(this.invoice.id);

        // Refresh invoice data
        await this.fetchInvoiceData();

        // Show success notification
        alert('Invoice sent successfully');
      } catch (error) {
        console.error('Error sending invoice:', error);
        // Show error notification
        alert('Failed to send invoice');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
