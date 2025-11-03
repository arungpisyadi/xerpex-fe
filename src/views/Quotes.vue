<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Quotes" />
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
          <button
            v-if="canCreate"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="navigateToCreateQuote"
          >
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
          @edit="handleEditEvent"
          @delete="canDelete ? deleteQuote : null"
          :show-edit-button="canUpdate"
          :show-delete-button="canDelete"
        />
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
import { usePermissions } from '../composables/usePermissions';
import { SystemModule, PermissionAction } from '../types/permissions.types';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  setup() {
    const {
      quotes,
      loading,
      error,
      fetchQuotes,
      sendQuote,
      acceptQuote,
      convertQuoteToInvoice
    } = useInvoicing();

    const permissions = usePermissions();

    return {
      quotes,
      loading,
      error,
      fetchQuotes,
      sendQuote,
      acceptQuote,
      convertQuoteToInvoice,
      authService,
      handleError,
      permissions
    };
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      columns: [
        { key: 'quote_number', label: 'Quote #', span: 1 },
        { key: 'customer_name', label: 'Customer', span: 2 },
        { key: 'total', label: 'Amount', span: 1, type: 'currency' },
        { key: 'status', label: 'Status', span: 1, type: 'status' },
        { key: 'issue_date', label: 'Issue Date', span: 1, type: 'date' },
        { key: 'expiry_date', label: 'Expiry Date', span: 1, type: 'date' }
      ]
    };
  },
  computed: {
    canCreate() {
      return this.permissions.canPerform(SystemModule.QUOTES, PermissionAction.CREATE);
    },
    canUpdate() {
      return this.permissions.canPerform(SystemModule.QUOTES, PermissionAction.UPDATE);
    },
    canDelete() {
      return this.permissions.canPerform(SystemModule.QUOTES, PermissionAction.DELETE);
    },
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
      // console.log(filtered);

      return filtered;
    },

    // Show user context for admin/finance users
    showUserContext() {
      return this.authService.canAccessAllData();
    }
  },
  async created() {
    console.log('Quotes component created, refreshing permissions...');
    this.permissions.forceRefreshPermissions();
    console.log('Permissions after refresh:', this.permissions.getUserPermissions());
    console.log('Current user matrix role:', this.permissions.getCurrentUserMatrixRole());
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        await this.fetchQuotes({
          skip: (this.currentPage - 1) * this.itemsPerPage,
          limit: this.itemsPerPage
        });

        // Pre-process data to flatten nested customer names
        if (this.quotes && Array.isArray(this.quotes)) {
          this.quotes = this.quotes.map(item => ({
            ...item,
            customer_name: item.customer?.name || 'N/A'
          }));
        }

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
      this.$router.push(`/quotes/${quote.id}`);
    },

    navigateToCreateQuote() {
      console.log('navigateToCreateQuote called');
      console.log('canCreate permission:', this.canCreate);

      if (!this.canCreate) {
        console.error('You do not have permission to create quotes');
        this.showPermissionDeniedAlert('create quotes');
        return;
      }

      console.log('Navigating to create quote...');
      this.$router.push('/quotes/create');
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
      console.log('editQuote called with:', quote);
      console.log('canUpdate permission:', this.canUpdate);
      console.log('current user permissions:', this.permissions.getUserPermissions());
      console.log('current user matrix role:', this.permissions.getCurrentUserMatrixRole());
      console.log('authService.getCurrentUser():', this.authService.getCurrentUser());
      console.log('authService.isAuthenticated():', this.authService.isAuthenticated());

      if (!this.canUpdate) {
        console.error('You do not have permission to edit quotes');
        this.showPermissionDeniedAlert('edit quotes');
        return;
      }

      console.log('Navigating to edit quote:', `/quotes/edit/${quote.id}`);
      this.$router.push(`/quotes/edit/${quote.id}`);
    },

    handleEditEvent(quote) {
      console.log('handleEditEvent called with quote:', quote);
      console.log('canUpdate permission:', this.canUpdate);

      if (!this.canUpdate) {
        console.log('Edit permission denied, showing alert');
        this.showPermissionDeniedAlert('edit quotes');
        return;
      }

      console.log('Calling editQuote function');
      this.editQuote(quote);
    },

    showPermissionDeniedAlert(action) {
      // Create and show a user-friendly alert for permission denied
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-300 dark:bg-gray-800 dark:text-red-400 dark:border-red-800';
      alertDiv.innerHTML = `
        <div class="flex items-center">
          <svg class="flex-shrink-0 w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-medium">Permission Denied!</span>
        </div>
        <div class="mt-2 text-sm">
          You don't have permission to ${action}. Please contact your administrator if you believe this is an error.
        </div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" onclick="this.parentElement.remove()">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      `;

      document.body.appendChild(alertDiv);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (alertDiv.parentElement) {
          alertDiv.remove();
        }
      }, 5000);
    },

    deleteQuote(quote) {
      console.log('deleteQuote called with:', quote);
      console.log('canDelete permission:', this.canDelete);

      if (!this.canDelete) {
        console.error('You do not have permission to delete quotes');
        this.showPermissionDeniedAlert('delete quotes');
        return;
      }

      // For now, just log - could implement delete functionality later
      console.log('Delete quote:', quote.quote_number);
      // TODO: Implement actual delete functionality with confirmation dialog
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
