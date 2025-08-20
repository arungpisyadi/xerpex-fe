<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Invoices' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Invoices Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
          <div>
            <select
              v-model="statusFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              v-model="dateFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="createNewInvoice">
            <span class="mr-2">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
              </svg>
            </span>
            Create Invoice
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :headers="headers"
          :items="filteredInvoices"
          :loading="loading"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        >
          <template #item.invoice_number="{ item }">
            <span class="text-sm font-medium text-black dark:text-white">{{ item.invoice_number }}</span>
          </template>

          <template #item.booking_id="{ item }">
            <router-link :to="`/bookings/${item.booking_id}`" class="text-sm text-primary hover:underline">
              #{{ item.booking_id }}
            </router-link>
          </template>

          <template #item.guest_name="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.guest_name }}</span>
          </template>

          <template #item.amount="{ item }">
            <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(item.amount) }}</span>
          </template>

          <template #item.status="{ item }">
            <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(item.status)">
              {{ capitalizeFirstLetter(item.status) }}
            </span>
          </template>

          <template #item.due_date="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(item.due_date) }}</span>
          </template>

          <template #item.actions="{ item }">
            <div class="flex items-center space-x-3.5">
              <button class="hover:text-primary" @click="viewInvoiceDetails(item)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" fill=""></path>
                  <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""></path>
                </svg>
              </button>
              <button class="hover:text-success" @click="sendInvoice(item)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill=""></path>
                </svg>
              </button>
              <button class="hover:text-warning" @click="downloadInvoice(item)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill=""></path>
                </svg>
              </button>
              <button
                v-if="item.status === 'pending' || item.status === 'overdue'"
                class="hover:text-success"
                @click="markAsPaid(item)"
              >
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill=""></path>
                </svg>
              </button>
            </div>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Invoice Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Invoice Details
          </h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedInvoice" class="mb-6">
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedInvoice.invoice_number }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(selectedInvoice.status)">
                {{ capitalizeFirstLetter(selectedInvoice.status) }}
              </span>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p class="text-base font-medium text-black dark:text-white">${{ formatPrice(selectedInvoice.amount) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ formatDate(selectedInvoice.issue_date) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Due Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ formatDate(selectedInvoice.due_date) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedInvoice.payment_date ? formatDate(selectedInvoice.payment_date) : 'Not paid yet' }}</p>
            </div>
          </div>

          <div class="mb-4">
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Booking Details</p>
            <div class="rounded border border-stroke p-4 dark:border-strokedark">
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Booking ID:</span>
                <router-link :to="`/bookings/${selectedInvoice.booking_id}`" class="text-sm text-primary hover:underline">
                  #{{ selectedInvoice.booking_id }}
                </router-link>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Guest:</span>
                <span class="text-sm text-black dark:text-white">{{ selectedInvoice.guest_name }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Villa:</span>
                <router-link :to="`/villas/${selectedInvoice.villa_id}`" class="text-sm text-primary hover:underline">
                  {{ selectedInvoice.villa_name }}
                </router-link>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Stay Period:</span>
                <span class="text-sm text-black dark:text-white">
                  {{ formatDate(selectedInvoice.check_in) }} - {{ formatDate(selectedInvoice.check_out) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="selectedInvoice.notes" class="mb-4">
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Notes</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
              {{ selectedInvoice.notes }}
            </p>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              v-if="selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600"
              @click="markAsPaid(selectedInvoice)"
            >
              Mark as Paid
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="sendInvoice(selectedInvoice)">
              Send Invoice
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" @click="downloadInvoice(selectedInvoice)">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Create New Invoice
          </h3>
          <button @click="showCreateModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitInvoice" class="mb-6">
          <div class="mb-4">
            <label class="mb-2.5 block text-black dark:text-white">
              Select Booking
            </label>
            <select
              v-model="newInvoice.booking_id"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              @change="fetchBookingDetails"
            >
              <option value="">Select a booking</option>
              <option v-for="booking in bookings" :key="booking.id" :value="booking.id">
                #{{ booking.id }} - {{ booking.guest_name }} ({{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }})
              </option>
            </select>
          </div>

          <div v-if="newInvoice.booking_id" class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Amount
              </label>
              <input
                type="number"
                v-model="newInvoice.amount"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Due Date
              </label>
              <input
                type="date"
                v-model="newInvoice.due_date"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block text-black dark:text-white">
              Notes
            </label>
            <textarea
              v-model="newInvoice.notes"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Enter notes"
              rows="4"
            ></textarea>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
              :disabled="!newInvoice.booking_id || !newInvoice.amount || !newInvoice.due_date"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { invoiceService, bookingService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      loading: true,
      searchQuery: '',
      statusFilter: '',
      dateFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      invoices: [],
      bookings: [],
      showModal: false,
      showCreateModal: false,
      selectedInvoice: null,
      newInvoice: {
        booking_id: '',
        amount: '',
        due_date: '',
        notes: ''
      },
      headers: [
        { text: 'Invoice #', value: 'invoice_number', sortable: true },
        { text: 'Booking ID', value: 'booking_id', sortable: true },
        { text: 'Guest', value: 'guest_name', sortable: true },
        { text: 'Amount', value: 'amount', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Due Date', value: 'due_date', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredInvoices() {
      let filtered = [...this.invoices];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(invoice =>
          invoice.invoice_number?.toLowerCase().includes(query) ||
          invoice.booking_id?.toString().includes(query) ||
          invoice.guest_name?.toLowerCase().includes(query) ||
          invoice.villa_name?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(invoice => invoice.status === this.statusFilter);
      }

      // Apply date filter
      if (this.dateFilter) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        filtered = filtered.filter(invoice => {
          const dueDate = new Date(invoice.due_date);

          switch (this.dateFilter) {
            case 'today':
              return dueDate >= today && dueDate < new Date(today.getTime() + 86400000);
            case 'week':
              return dueDate >= startOfWeek;
            case 'month':
              return dueDate >= startOfMonth;
            case 'year':
              return dueDate >= startOfYear;
            default:
              return true;
          }
        });
      }

      return filtered;
    }
  },
  async created() {
    await this.fetchInvoices();
  },
  methods: {
    async fetchInvoices() {
      try {
        this.loading = true;
        const response = await invoiceService.getInvoices({
          page: this.currentPage,
          limit: this.itemsPerPage
        });

        this.invoices = response.items || [];
        this.totalItems = response.total || 0;
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    async fetchBookings() {
      try {
        const response = await bookingService.getBookings({
          status: 'confirmed',
          limit: 100
        });

        this.bookings = response.items || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Show error notification
      }
    },
    async fetchBookingDetails() {
      if (!this.newInvoice.booking_id) return;

      try {
        const booking = await bookingService.getBookingById(this.newInvoice.booking_id);

        // Set default amount from booking total
        this.newInvoice.amount = booking.total_amount || 0;

        // Set default due date (7 days from now)
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + 7);
        this.newInvoice.due_date = dueDate.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error fetching booking details:', error);
        // Show error notification
      }
    },
    async handlePageChange(page) {
      this.currentPage = page;
      await this.fetchInvoices();
    },
    viewInvoiceDetails(invoice) {
      this.selectedInvoice = invoice;
      this.showModal = true;
    },
    createNewInvoice() {
      this.newInvoice = {
        booking_id: '',
        amount: '',
        due_date: '',
        notes: ''
      };
      this.fetchBookings();
      this.showCreateModal = true;
    },
    async submitInvoice() {
      try {
        await invoiceService.createInvoice(this.newInvoice);
        this.showCreateModal = false;
        await this.fetchInvoices();
        // Show success notification
      } catch (error) {
        console.error('Error creating invoice:', error);
        // Show error notification
      }
    },
    async markAsPaid(invoice) {
      try {
        await invoiceService.updateInvoiceStatus(invoice.id, 'paid');

        // Update local data
        if (this.selectedInvoice && this.selectedInvoice.id === invoice.id) {
          this.selectedInvoice.status = 'paid';
          this.selectedInvoice.payment_date = new Date().toISOString();
        }

        // Refresh the invoice list
        await this.fetchInvoices();

        // Show success notification
      } catch (error) {
        console.error('Error marking invoice as paid:', error);
        // Show error notification
      }
    },
    async sendInvoice(invoice) {
      try {
        await invoiceService.sendInvoice(invoice.id);
        // Show success notification
      } catch (error) {
        console.error('Error sending invoice:', error);
        // Show error notification
      }
    },
    async downloadInvoice(invoice) {
      try {
        await invoiceService.downloadInvoice(invoice.id);
        // Show success notification
      } catch (error) {
        console.error('Error downloading invoice:', error);
        // Show error notification
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      switch (status) {
        case 'paid':
          return 'bg-success bg-opacity-10 text-success';
        case 'pending':
          return 'bg-warning bg-opacity-10 text-warning';
        case 'overdue':
          return 'bg-red-500 bg-opacity-10 text-danger';
        case 'cancelled':
          return 'bg-gray-500 bg-opacity-10 text-gray-500';
        default:
          return 'bg-gray-500 bg-opacity-10 text-gray-500';
      }
    }
  }
};
</script>
