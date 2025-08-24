<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Customers' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Customer Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search customers..."
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
              <option value="">All Customers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="createNewCustomer">
            <span class="mr-2">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
              </svg>
            </span>
            Add Customer
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredCustomers"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewCustomerDetails"
          @edit="editCustomer"
          @delete="confirmDeactivateCustomer"
        />
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Customer Details
          </h4>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedCustomer" class="space-y-6">
          <!-- Customer Information Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Basic Information</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
                  <p class="text-black dark:text-white">{{ selectedCustomer.name }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <p class="text-black dark:text-white">{{ selectedCustomer.email || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                  <p class="text-black dark:text-white">{{ selectedCustomer.phone_number || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Status & ID</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span
                    :class="[
                      'ml-2 inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium',
                      getCustomerStatus(selectedCustomer.status)
                        ? 'bg-success text-white'
                        : 'bg-red-500 text-danger'
                    ]"
                  >
                    {{ getCustomerStatus(selectedCustomer.status) ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Customer ID:</span>
                  <p class="text-black dark:text-white">#{{ selectedCustomer.id }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 class="mb-3 font-medium text-black dark:text-white">Address Information</h5>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Address:</span>
                <p class="text-black dark:text-white">{{ selectedCustomer.address || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Billing Address:</span>
                <p class="text-black dark:text-white">{{ selectedCustomer.billing_address || 'Same as address' }}</p>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 class="mb-3 font-medium text-black dark:text-white">Timeline</h5>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedCustomer.created_at) }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedCustomer.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-500 hover:bg-blue-600"
            @click="createQuoteForCustomer(selectedCustomer)"
          >
            Create Quote
          </button>
          <button
            v-if="!getCustomerStatus(selectedCustomer.status)"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600"
            @click="activateCustomerAction(selectedCustomer)"
          >
            Activate Customer
          </button>
          <button
            v-if="getCustomerStatus(selectedCustomer.status)"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-500 hover:bg-red-600"
            @click="confirmDeactivateCustomer(selectedCustomer)"
          >
            Deactivate Customer
          </button>
          <button
            type="button"
            @click="closeViewModal"
            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Customer Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            {{ editingCustomer ? 'Edit Customer' : 'Create New Customer' }}
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
          @submit="submitCustomer"

        >
          <div class="mb-4 grid grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="name"
              label="Name"
              v-model="customerForm.name"
              placeholder="Enter customer name"
              validation="required"

            />
            <FormKit
              type="email"
              name="email"
              label="Email"
              v-model="customerForm.email"
              placeholder="Enter email address"

            />
          </div>

          <div class="mb-4">
            <FormKit
              type="tel"
              name="phone_number"
              label="Phone Number"
              v-model="customerForm.phone_number"
              placeholder="Enter phone number"

            />
          </div>

          <div class="mb-4">
            <FormKit
              type="textarea"
              name="address"
              label="Address"
              v-model="customerForm.address"
              placeholder="Enter full address"

            />
          </div>

          <div class="mb-4">
            <FormKit
              type="textarea"
              name="billing_address"
              label="Billing Address"
              v-model="customerForm.billing_address"
              placeholder="Enter billing address (leave empty to use same as address)"

            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <FormKit
              type="submit"

            >
              {{ editingCustomer ? 'Update Customer' : 'Create Customer' }}
            </FormKit>
          </div>
        </FormKit>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Confirm Deactivation
          </h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to deactivate this customer? This action will make the customer inactive but can be reversed later.
          </p>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="executeDeactivateCustomer"
            class="flex justify-center rounded bg-red-500 py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { useInvoicing } from '../composables/useInvoicing';
import customerService from '../services/customer.service';
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
      customers,
      loading,
      error,
      fetchCustomers,
      createCustomer,
      activateCustomer
    } = useInvoicing();

    return {
      customers,
      loading,
      error,
      fetchCustomers,
      createCustomer,
      activateCustomer,
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
      showDeleteModal: false,
      selectedCustomer: null,
      editingCustomer: null,
      customerToDeactivate: null,
      customerForm: {
        name: '',
        email: '',
        phone_number: '',
        address: '',
        billing_address: ''
      },
      columns: [
        { key: 'name', label: 'Name', span: 2 },
        { key: 'email', label: 'Email', span: 2 },
        { key: 'phone_number', label: 'Phone', span: 1 },
        { key: 'address', label: 'Address', span: 2 },
        { key: 'billing_address', label: 'Billing Address', span: 2 },
        { key: 'created_at', label: 'Created', span: 1, type: 'date' }
      ]
    };
  },
  computed: {
    filteredCustomers() {
      // Ensure customers is an array before filtering
      if (!this.customers || !Array.isArray(this.customers)) {
        return [];
      }

      let filtered = [...this.customers];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(customer =>
          customer.name?.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.phone_number?.includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        if (this.statusFilter === 'active') {
          filtered = filtered.filter(customer => this.getCustomerStatus(customer.status));
        } else if (this.statusFilter === 'inactive') {
          filtered = filtered.filter(customer => !this.getCustomerStatus(customer.status));
        }
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
        await this.fetchCustomers({
          skip: (this.currentPage - 1) * this.itemsPerPage,
          limit: this.itemsPerPage
        });
        this.totalItems = this.customers.length;
      } catch (error) {
        this.handleError(error, 'loadData');
      }
    },

    async handlePageChange(page) {
      this.currentPage = page;
      await this.loadData();
    },

    viewCustomerDetails(customer) {
      this.selectedCustomer = customer;
      this.showModal = true;
    },

    createNewCustomer() {
      this.editingCustomer = null;
      this.customerForm = {
        name: '',
        email: '',
        phone_number: '',
        address: '',
        billing_address: ''
      };
      this.showCreateModal = true;
    },

    editCustomer(customer) {
      this.editingCustomer = customer;
      this.customerForm = {
        name: customer.name || '',
        email: customer.email || '',
        phone_number: customer.phone_number || '',
        address: customer.address || '',
        billing_address: customer.billing_address || ''
      };
      this.showCreateModal = true;
    },

    async submitCustomer() {
      try {
        if (this.editingCustomer) {
          // Update existing customer
          await customerService.updateCustomer(this.editingCustomer.id, this.customerForm);
          console.log('Customer updated successfully');
        } else {
          // Create new customer
          await this.createCustomer(this.customerForm);
          console.log('Customer created successfully');
        }

        this.showCreateModal = false;
        await this.loadData();
      } catch (error) {
        this.handleError(error, 'submitCustomer');
      }
    },

    async activateCustomerAction(customer) {
      try {
        await this.activateCustomer(customer.id);

        // Update local data
        if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
          this.selectedCustomer.status = 1;
        }

        await this.loadData();
        console.log('Customer activated successfully');
      } catch (error) {
        this.handleError(error, 'activateCustomerAction');
      }
    },

    async deactivateCustomerAction(customer) {
      try {
        await customerService.deactivateCustomer(customer.id);

        // Update local data
        if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
          this.selectedCustomer.status = 0;
        }

        await this.loadData();
        console.log('Customer deactivated successfully');
      } catch (error) {
        this.handleError(error, 'deactivateCustomerAction');
      }
    },

    closeViewModal() {
      this.showModal = false;
      this.selectedCustomer = null;
    },

    confirmDeactivateCustomer(customer) {
      this.customerToDeactivate = customer;
      this.showDeleteModal = true;
    },

    async executeDeactivateCustomer() {
      try {
        await customerService.deactivateCustomer(this.customerToDeactivate.id);

        // Update local data
        if (this.selectedCustomer && this.selectedCustomer.id === this.customerToDeactivate.id) {
          this.selectedCustomer.status = 0;
        }

        this.showDeleteModal = false;
        this.customerToDeactivate = null;
        await this.loadData();
        console.log('Customer deactivated successfully');
      } catch (error) {
        this.handleError(error, 'executeDeactivateCustomer');
      }
    },

    createQuoteForCustomer(customer) {
      // Navigate to quotes page with customer pre-selected
      this.$router.push({
        path: '/quotes',
        query: { customer_id: customer.id, action: 'create' }
      });
    },

    getCustomerStatus(status) {
      // Convert backend numeric status to boolean
      // 0 = inactive, 1 = active
      return status === 1;
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>
