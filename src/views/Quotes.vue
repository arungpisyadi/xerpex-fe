<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Quotes' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Quotes Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search quotes..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="createNewQuote">
            <span class="mr-2">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
              </svg>
            </span>
            Create Quote
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredQuotes"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewQuoteDetails"
          @edit="editQuote"
          @delete="deleteQuote"
        />
      </div>
    </div>

    <!-- Quote Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Quote Details
          </h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedQuote" class="mb-6">
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Quote Number</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedQuote.quote_number }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(selectedQuote.status)">
                {{ capitalizeFirstLetter(selectedQuote.status) }}
              </span>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Customer</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedQuote.customer_name }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p class="text-base font-medium text-black dark:text-white">${{ formatPrice(selectedQuote.total) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Tax Amount</p>
              <p class="text-base font-medium text-black dark:text-white">${{ formatPrice(selectedQuote.tax_total) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ formatDate(selectedQuote.issue_date) }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
              <p class="text-base font-medium text-black dark:text-white">{{ formatDate(selectedQuote.expiry_date) }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              v-if="selectedQuote.status === 'draft'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-500 hover:bg-blue-600"
              @click="sendQuoteToCustomer(selectedQuote)"
            >
              Send Quote
            </button>
            <button
              v-if="selectedQuote.status === 'sent'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600"
              @click="acceptQuoteAction(selectedQuote)"
            >
              Accept Quote
            </button>
            <button
              v-if="selectedQuote.status === 'accepted'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-orange-500 hover:bg-orange-600"
              @click="convertToInvoice(selectedQuote)"
            >
              Convert to Invoice
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" @click="downloadQuote(selectedQuote)">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Quote Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Create New Quote
          </h3>
          <button @click="showCreateModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <FormKit
          type="form"
          :actions="false"
          @submit="submitQuote"

        >
          <div class="mb-4">
            <FormKit
              type="select"
              name="customer_id"
              label="Select Customer"
              v-model="newQuote.customer_id"
              :options="customers.map(customer => ({ label: `${customer.name} - ${customer.email}`, value: customer.id }))"
              placeholder="Select a customer"
              validation="required"

            />
          </div>

          <div v-if="newQuote.customer_id" class="mb-4 grid grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="amount"
              label="Subtotal Amount"
              v-model="newQuote.amount"
              placeholder="Enter subtotal amount"
              step="0.01"
              min="0"
              validation="required|min:0"

            />
            <FormKit
              type="number"
              name="tax_total"
              label="Tax Amount"
              v-model="newQuote.tax_total"
              placeholder="Enter tax amount"
              step="0.01"
              min="0"
              validation="min:0"

            />
          </div>

          <div v-if="newQuote.customer_id" class="mb-4">
            <FormKit
              type="date"
              name="expiry_date"
              label="Expiry Date"
              v-model="newQuote.expiry_date"

            />
          </div>

          <div class="mb-4">
            <FormKit
              type="textarea"
              name="notes"
              label="Notes"
              v-model="newQuote.notes"
              placeholder="Enter notes"

            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <FormKit
              type="button"
              @click="showCreateModal = false"

            >
              Cancel
            </FormKit>
            <FormKit
              type="submit"

            >
              Save
            </FormKit>
          </div>
        </FormKit>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { useInvoicing } from '../composables/useInvoicing';
import authService from '../services/auth.service';
import { handleError } from '../utils/errorHandler';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  setup() {
    const {
      quotes,
      customers,
      loading,
      error,
      draftQuotes,
      sentQuotes,
      acceptedQuotes,
      fetchQuotes,
      fetchCustomers,
      createQuote,
      sendQuote,
      acceptQuote,
      convertQuoteToInvoice
    } = useInvoicing();

    return {
      quotes,
      customers,
      loading,
      error,
      draftQuotes,
      sentQuotes,
      acceptedQuotes,
      fetchQuotes,
      fetchCustomers,
      createQuote,
      sendQuote,
      acceptQuote,
      convertQuoteToInvoice,
      authService,
      handleError
    };
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      showModal: false,
      showCreateModal: false,
      selectedQuote: null,
      newQuote: {
        customer_id: '',
        amount: '',
        tax_total: 0,
        expiry_date: '',
        notes: '',
        items: []
      },
      columns: [
        { key: 'quote_number', label: 'Quote #', span: 1 },
        { key: 'customer_name', label: 'Customer', span: 2 },
        { key: 'total', label: 'Amount', span: 1, type: 'currency' },
        { key: 'tax_total', label: 'Tax', span: 1, type: 'currency' },
        { key: 'status', label: 'Status', span: 1, type: 'status' },
        { key: 'issue_date', label: 'Issue Date', span: 1, type: 'date' },
        { key: 'expiry_date', label: 'Expiry Date', span: 1, type: 'date' }
      ]
    };
  },
  computed: {
    filteredQuotes() {
      // Ensure quotes is an array before filtering
      if (!this.quotes || !Array.isArray(this.quotes)) {
        return [];
      }

      let filtered = [...this.quotes];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(quote =>
          quote.quote_number?.toLowerCase().includes(query) ||
          quote.customer_name?.toLowerCase().includes(query) ||
          quote.total?.toString().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(quote => quote.status === this.statusFilter);
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
          this.fetchQuotes({
            skip: (this.currentPage - 1) * this.itemsPerPage,
            limit: this.itemsPerPage
          }),
          this.fetchCustomers({ active_only: true })
        ]);
        this.totalItems = this.quotes.length;
      } catch (error) {
        this.handleError(error, 'loadData');
      }
    },

    async handlePageChange(page) {
      this.currentPage = page;
      await this.loadData();
    },

    viewQuoteDetails(quote) {
      this.selectedQuote = quote;
      this.showModal = true;
    },

    createNewQuote() {
      this.newQuote = {
        customer_id: '',
        amount: '',
        tax_total: 0,
        expiry_date: '',
        notes: '',
        items: []
      };
      this.showCreateModal = true;
    },

    async submitQuote() {
      try {
        const quoteData = {
          ...this.newQuote,
          issue_date: new Date().toISOString().split('T')[0],
          status: 'draft',
          total: parseFloat(this.newQuote.amount) + parseFloat(this.newQuote.tax_total)
        };

        await this.createQuote(quoteData);
        this.showCreateModal = false;
        await this.loadData();

        console.log('Quote created successfully');
      } catch (error) {
        this.handleError(error, 'submitQuote');
      }
    },

    async sendQuoteToCustomer(quote) {
      try {
        await this.sendQuote(quote.id);
        await this.loadData();
        console.log('Quote sent successfully');
      } catch (error) {
        this.handleError(error, 'sendQuoteToCustomer');
      }
    },

    async acceptQuoteAction(quote) {
      try {
        await this.acceptQuote(quote.id);
        await this.loadData();
        console.log('Quote accepted successfully');
      } catch (error) {
        this.handleError(error, 'acceptQuoteAction');
      }
    },

    async convertToInvoice(quote) {
      try {
        const conversionData = {
          payment_terms: 'Net 30 days',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: `Converted from quote ${quote.quote_number}`
        };

        await this.convertQuoteToInvoice(quote.id, conversionData);
        await this.loadData();
        console.log('Quote converted to invoice successfully');

        // Redirect to invoices page
        this.$router.push('/invoices');
      } catch (error) {
        this.handleError(error, 'convertToInvoice');
      }
    },

    editQuote(quote) {
      // For now, just view the quote details
      this.viewQuoteDetails(quote);
    },

    deleteQuote(quote) {
      // For now, just log - could implement delete functionality later
      console.log('Delete quote:', quote.quote_number);
    },

    async downloadQuote(quote) {
      try {
        // This would use the quote service to generate PDF
        console.log('Downloading quote:', quote.quote_number);
      } catch (error) {
        this.handleError(error, 'downloadQuote');
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
        case 'draft':
          return 'bg-gray-500 bg-opacity-10 text-gray-500';
        case 'sent':
          return 'bg-blue-500 bg-opacity-10 text-blue-500';
        case 'accepted':
          return 'bg-success bg-opacity-10 text-success';
        case 'declined':
          return 'bg-red-500 bg-opacity-10 text-danger';
        case 'expired':
          return 'bg-warning bg-opacity-10 text-warning';
        default:
          return 'bg-gray-500 bg-opacity-10 text-gray-500';
      }
    }
  }
};
</script>
