<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Payments' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Payments Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search payments..."
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
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
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
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :headers="headers"
          :items="filteredPayments"
          :loading="loading"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        >
          <template #item.id="{ item }">
            <span class="text-sm font-medium text-black dark:text-white">#{{ item.id }}</span>
          </template>

          <template #item.booking_id="{ item }">
            <router-link :to="`/bookings/${item.booking_id}`" class="text-sm text-primary hover:underline">
              #{{ item.booking_id }}
            </router-link>
          </template>

          <template #item.amount="{ item }">
            <span class="text-sm font-medium text-black dark:text-white">${{ formatPrice(item.amount) }}</span>
          </template>

          <template #item.payment_method="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.payment_method }}</span>
          </template>

          <template #item.status="{ item }">
            <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(item.status)">
              {{ capitalizeFirstLetter(item.status) }}
            </span>
          </template>

          <template #item.payment_date="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(item.payment_date) }}</span>
          </template>

          <template #item.actions="{ item }">
            <div class="flex items-center space-x-3.5">
              <button class="hover:text-primary" @click="viewPaymentDetails(item)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" fill=""></path>
                  <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""></path>
                </svg>
              </button>
              <button
                v-if="item.status === 'pending'"
                class="hover:text-success"
                @click="markAsPaid(item)"
              >
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z" fill=""></path>
                  <path d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.4726 7.53752C13.2195 7.2844 12.8257 7.2844 12.5726 7.53752L9.00074 11.0532L5.42886 7.53752C5.17574 7.2844 4.78199 7.2844 4.52886 7.53752C4.27574 7.79065 4.27574 8.1844 4.52886 8.43752L8.55074 12.3469Z" fill=""></path>
                  <path d="M9.00029 11.2219C9.33779 11.2219 9.64717 10.9407 9.64717 10.575V1.6875C9.64717 1.35 9.36592 1.04062 9.00029 1.04062C8.66279 1.04062 8.35342 1.32187 8.35342 1.6875V10.575C8.35342 10.9407 8.66279 11.2219 9.00029 11.2219Z" fill=""></path>
                </svg>
              </button>
              <button
                v-if="item.status === 'paid'"
                class="hover:text-warning"
                @click="markAsRefunded(item)"
              >
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.8754 6.47812C16.5379 6.47812 16.2285 6.19687 16.2285 5.83125V3.32812C16.2285 3.07499 16.0316 2.87812 15.7785 2.87812H2.22227C1.96914 2.87812 1.77227 3.07499 1.77227 3.32812V5.83125C1.77227 6.16875 1.49102 6.47812 1.12539 6.47812C0.759766 6.47812 0.478516 6.19687 0.478516 5.83125V3.32812C0.478516 2.37187 1.23789 1.6125 2.19414 1.6125H15.7785C16.7348 1.6125 17.4941 2.37187 17.4941 3.32812V5.83125C17.5223 6.19687 17.2129 6.47812 16.8754 6.47812Z" fill=""></path>
                  <path d="M8.55074 5.79375C8.66324 5.68125 8.83199 5.625 9.00074 5.625C9.16949 5.625 9.31012 5.68125 9.45074 5.79375L13.4726 9.70312C13.7257 9.95625 13.7257 10.35 13.4726 10.6031C13.2195 10.8562 12.8257 10.8562 12.5726 10.6031L9.00074 7.08437L5.42886 10.6031C5.17574 10.8562 4.78199 10.8562 4.52886 10.6031C4.27574 10.35 4.27574 9.95625 4.52886 9.70312L8.55074 5.79375Z" fill=""></path>
                  <path d="M9.00029 6.91875C9.33779 6.91875 9.64717 7.2 9.64717 7.56562V16.4531C9.64717 16.7906 9.36592 17.1 9.00029 17.1C8.66279 17.1 8.35342 16.8187 8.35342 16.4531V7.56562C8.35342 7.2 8.66279 6.91875 9.00029 6.91875Z" fill=""></path>
                </svg>
              </button>
            </div>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Payment Details
          </h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedPayment" class="mb-6">
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
              <p class="text-base font-medium text-black dark:text-white">#{{ selectedPayment.id }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(selectedPayment.status)">
                {{ capitalizeFirstLetter(selectedPayment.status) }}
              </span>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p class="text-base font-medium text-black dark:text-white">${{ formatPrice(selectedPayment.amount) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedPayment.payment_method }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ formatDateTime(selectedPayment.payment_date) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedPayment.transaction_id || 'N/A' }}</p>
            </div>
          </div>

          <div class="mb-4">
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Booking Details</p>
            <div class="rounded border border-stroke p-4 dark:border-strokedark">
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Booking ID:</span>
                <router-link :to="`/bookings/${selectedPayment.booking_id}`" class="text-sm text-primary hover:underline">
                  #{{ selectedPayment.booking_id }}
                </router-link>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Guest:</span>
                <span class="text-sm text-black dark:text-white">{{ selectedPayment.guest_name }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Villa:</span>
                <router-link :to="`/villas/${selectedPayment.villa_id}`" class="text-sm text-primary hover:underline">
                  {{ selectedPayment.villa_name }}
                </router-link>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Stay Period:</span>
                <span class="text-sm text-black dark:text-white">
                  {{ formatDate(selectedPayment.check_in) }} - {{ formatDate(selectedPayment.check_out) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="selectedPayment.notes" class="mb-4">
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Payment Notes</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
              {{ selectedPayment.notes }}
            </p>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              v-if="selectedPayment.status === 'pending'"
              class="btn btn-success"
              @click="markAsPaid(selectedPayment)"
            >
              Mark as Paid
            </button>
            <button
              v-if="selectedPayment.status === 'paid'"
              class="btn btn-warning"
              @click="markAsRefunded(selectedPayment)"
            >
              Mark as Refunded
            </button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { paymentService } from '../services';

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
      payments: [],
      showModal: false,
      selectedPayment: null,
      headers: [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Booking ID', value: 'booking_id', sortable: true },
        { text: 'Amount', value: 'amount', sortable: true },
        { text: 'Payment Method', value: 'payment_method', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Payment Date', value: 'payment_date', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredPayments() {
      let filtered = [...this.payments];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(payment =>
          payment.id.toString().includes(query) ||
          payment.booking_id.toString().includes(query) ||
          payment.guest_name?.toLowerCase().includes(query) ||
          payment.villa_name?.toLowerCase().includes(query) ||
          payment.payment_method?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(payment => payment.status === this.statusFilter);
      }

      // Apply date filter
      if (this.dateFilter) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        filtered = filtered.filter(payment => {
          const paymentDate = new Date(payment.payment_date);

          switch (this.dateFilter) {
            case 'today':
              return paymentDate >= today;
            case 'week':
              return paymentDate >= startOfWeek;
            case 'month':
              return paymentDate >= startOfMonth;
            case 'year':
              return paymentDate >= startOfYear;
            default:
              return true;
          }
        });
      }

      return filtered;
    }
  },
  async created() {
    await this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      try {
        this.loading = true;
        const response = await paymentService.getPayments({
          page: this.currentPage,
          limit: this.itemsPerPage
        });

        this.payments = response.items || [];
        this.totalItems = response.total || 0;
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchPayments();
    },
    formatPrice(price) {
      if (!price) return '0.00';

      return parseFloat(price).toFixed(2);
    },
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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
      if (!string) return '';

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      const statusMap = {
        'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'refunded': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    viewPaymentDetails(payment) {
      this.selectedPayment = payment;
      this.showModal = true;
    },
    async markAsPaid(payment) {
      try {
        this.loading = true;

        // Update payment status
        await paymentService.updatePaymentStatus(payment.id, 'paid');

        // Refresh payments data
        await this.fetchPayments();

        // Update selected payment if modal is open
        if (this.showModal && this.selectedPayment && this.selectedPayment.id === payment.id) {
          this.selectedPayment.status = 'paid';
          this.selectedPayment.payment_date = new Date().toISOString();
        }

        // Show success notification
        alert('Payment marked as paid successfully');
      } catch (error) {
        console.error('Error updating payment status:', error);
        // Show error notification
        alert('Failed to update payment status');
      } finally {
        this.loading = false;
      }
    },
    async markAsRefunded(payment) {
      try {
        this.loading = true;

        // Update payment status
        await paymentService.updatePaymentStatus(payment.id, 'refunded');

        // Refresh payments data
        await this.fetchPayments();

        // Update selected payment if modal is open
        if (this.showModal && this.selectedPayment && this.selectedPayment.id === payment.id) {
          this.selectedPayment.status = 'refunded';
        }

        // Show success notification
        alert('Payment marked as refunded successfully');
      } catch (error) {
        console.error('Error updating payment status:', error);
        // Show error notification
        alert('Failed to update payment status');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
