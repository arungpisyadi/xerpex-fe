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
          :data="filteredInvoices"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewInvoiceDetails"
          @edit="editInvoice"
          @delete="deleteInvoice"
        />
      </div>
    </div>

    <!-- Invoice Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
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
    <div v-if="showCreateModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
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
              Select Customer
            </label>
            <select
              v-model="newInvoice.customer_id"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              @change="fetchCustomerDetails"
              required
            >
              <option value="">Select a customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.email }}
              </option>
            </select>
          </div>

          <div v-if="newInvoice.customer_id" class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Subtotal Amount
              </label>
              <input
                type="number"
                v-model="newInvoice.amount"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter subtotal amount"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Tax Amount
              </label>
              <input
                type="number"
                v-model="newInvoice.tax_total"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter tax amount"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div v-if="newInvoice.customer_id" class="mb-4 grid grid-cols-2 gap-4">
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
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Payment Terms
              </label>
              <select
                v-model="newInvoice.payment_terms"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="Net 15 days">Net 15 days</option>
                <option value="Net 30 days">Net 30 days</option>
                <option value="Net 60 days">Net 60 days</option>
                <option value="Due on receipt">Due on receipt</option>
              </select>
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
              :disabled="!newInvoice.customer_id || !newInvoice.amount || !newInvoice.due_date"
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
import invoiceService from '../services/invoice.service';
import customerService from '../services/customer.service';
import authService from '../services/auth.service';
import { useInvoicing } from '../composables/useInvoicing';
import { handleError } from '../utils/errorHandler';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  setup() {
    const {
      invoices,
      customers,
      loading,
      error,
      overdueInvoices,
      fetchInvoices,
      fetchCustomers,
      createInvoice,
      sendInvoice,
      markInvoiceAsPaid
    } = useInvoicing();

    return {
      invoices,
      customers,
      loading,
      error,
      overdueInvoices,
      fetchInvoices,
      fetchCustomers,
      createInvoice,
      sendInvoice,
      markInvoiceAsPaid,
      authService,
      handleError
    };
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      dateFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      showModal: false,
      showCreateModal: false,
      selectedInvoice: null,
      newInvoice: {
        customer_id: '',
        amount: '',
        due_date: '',
        tax_total: 0,
        payment_terms: 'Net 30 days',
        notes: '',
        items: []
      },
      columns: [
        { key: 'invoice_number', label: 'Invoice #', span: 1 },
        { key: 'customer_name', label: 'Customer', span: 2 },
        { key: 'total', label: 'Amount', span: 1, type: 'currency' },
        { key: 'tax_total', label: 'Tax', span: 1, type: 'currency' },
        { key: 'status', label: 'Status', span: 1, type: 'status' },
        { key: 'issue_date', label: 'Issue Date', span: 1, type: 'date' },
        { key: 'due_date', label: 'Due Date', span: 1, type: 'date' }
      ]
    };
  },
  computed: {
    filteredInvoices() {
      // Ensure invoices is an array before filtering
      if (!this.invoices || !Array.isArray(this.invoices)) {
        return [];
      }

      let filtered = [...this.invoices];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(invoice =>
          invoice.invoice_number?.toLowerCase().includes(query) ||
          invoice.customer_name?.toLowerCase().includes(query) ||
          invoice.total?.toString().includes(query)
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
    },

    // Show user context for admin/finance users
    showUserContext() {
      return this.authService.canAccessAllData();
    }
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.fetchInvoices({
            skip: (this.currentPage - 1) * this.itemsPerPage,
            limit: this.itemsPerPage
          }),
          this.fetchCustomers({ active_only: true })
        ]);
        this.totalItems = this.invoices?.length || 0;
      } catch (error) {
        this.handleError(error, 'loadData');
      }
    },

    async fetchCustomerDetails() {
      if (!this.newInvoice.customer_id) return;

      try {
        const customer = await customerService.getCustomerById(this.newInvoice.customer_id);

        // Set default due date (30 days from now)
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + 30);
        this.newInvoice.due_date = dueDate.toISOString().split('T')[0];
        this.newInvoice.payment_terms = 'Net 30 days';
      } catch (error) {
        this.handleError(error, 'fetchCustomerDetails');
      }
    },
    async handlePageChange(page) {
      this.currentPage = page;
      await this.loadData();
    },

    viewInvoiceDetails(invoice) {
      this.selectedInvoice = invoice;
      this.showModal = true;
    },

    createNewInvoice() {
      this.newInvoice = {
        customer_id: '',
        amount: '',
        due_date: '',
        tax_total: 0,
        payment_terms: 'Net 30 days',
        notes: '',
        items: []
      };
      this.showCreateModal = true;
    },

    async submitInvoice() {
      try {
        const invoiceData = {
          ...this.newInvoice,
          issue_date: new Date().toISOString().split('T')[0],
          status: 'draft',
          total: parseFloat(this.newInvoice.amount) + parseFloat(this.newInvoice.tax_total)
        };

        await this.createInvoice(invoiceData);
        this.showCreateModal = false;
        await this.loadData();

        // Show success notification
        console.log('Invoice created successfully');
      } catch (error) {
        this.handleError(error, 'submitInvoice');
      }
    },

    async markAsPaid(invoice) {
      try {
        await this.markInvoiceAsPaid(invoice.id, {
          payment_date: new Date().toISOString().split('T')[0]
        });

        // Update local data
        if (this.selectedInvoice && this.selectedInvoice.id === invoice.id) {
          this.selectedInvoice.status = 'paid';
        }

        await this.loadData();
        console.log('Invoice marked as paid successfully');
      } catch (error) {
        this.handleError(error, 'markAsPaid');
      }
    },

    async sendInvoiceEmail(invoice) {
      try {
        await this.sendInvoice(invoice.id, {
          recipient_email: invoice.customer_email,
          subject: `Invoice ${invoice.invoice_number}`,
          message: 'Please find your invoice attached.'
        });

        console.log('Invoice sent successfully');
      } catch (error) {
        this.handleError(error, 'sendInvoiceEmail');
      }
    },

    editInvoice(invoice) {
      // For now, just view the invoice details
      this.viewInvoiceDetails(invoice);
    },

    deleteInvoice(invoice) {
      // For now, just log - could implement delete functionality later
      console.log('Delete invoice:', invoice.invoice_number);
    },

    async downloadInvoice(invoice) {
      try {
        await invoiceService.downloadInvoice(invoice.id, `invoice-${invoice.invoice_number}.pdf`);
        console.log('Invoice downloaded successfully');
      } catch (error) {
        this.handleError(error, 'downloadInvoice');
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
