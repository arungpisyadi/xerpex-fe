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
          :headers="headers"
          :items="filteredCustomers"
          :loading="loading"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        >
          <template #item.name="{ item }">
            <div>
              <span class="text-sm font-medium text-black dark:text-white">{{ item.name }}</span>
              <div v-if="showUserContext && item.user_id" class="text-xs text-gray-500">
                User ID: {{ item.user_id }}
              </div>
            </div>
          </template>

          <template #item.email="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.email || 'N/A' }}</span>
          </template>

          <template #item.phone="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.phone || 'N/A' }}</span>
          </template>

          <template #item.city="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.city || 'N/A' }}</span>
          </template>

          <template #item.is_active="{ item }">
            <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="item.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-red-500 bg-opacity-10 text-danger'">
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </span>
          </template>

          <template #item.created_at="{ item }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(item.created_at) }}</span>
          </template>

          <template #item.actions="{ item }">
            <div class="flex items-center space-x-3.5">
              <button class="hover:text-primary" @click="viewCustomerDetails(item)" title="View Details">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" fill=""></path>
                  <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""></path>
                </svg>
              </button>

              <button class="hover:text-warning" @click="editCustomer(item)" title="Edit Customer">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" fill=""></path>
                </svg>
              </button>

              <button
                v-if="!item.is_active"
                class="hover:text-success"
                @click="activateCustomerAction(item)"
                title="Activate Customer"
              >
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill=""></path>
                </svg>
              </button>

              <button
                v-if="item.is_active"
                class="hover:text-danger"
                @click="deactivateCustomerAction(item)"
                title="Deactivate Customer"
              >
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill=""></path>
                </svg>
              </button>

              <button class="hover:text-primary" @click="createQuoteForCustomer(item)" title="Create Quote">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill=""></path>
                </svg>
              </button>
            </div>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            Customer Details
          </h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedCustomer" class="mb-6">
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.name }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="selectedCustomer.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-red-500 bg-opacity-10 text-danger'">
                {{ selectedCustomer.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.phone || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.address || 'N/A' }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">City</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.city || 'N/A' }}</p>
            </div>
            <div>
              <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Country</p>
              <p class="text-base font-medium text-black dark:text-white">{{ selectedCustomer.country || 'N/A' }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-500 hover:bg-blue-600"
              @click="createQuoteForCustomer(selectedCustomer)"
            >
              Create Quote
            </button>
            <button
              v-if="!selectedCustomer.is_active"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600"
              @click="activateCustomerAction(selectedCustomer)"
            >
              Activate Customer
            </button>
            <button
              v-if="selectedCustomer.is_active"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-500 hover:bg-red-600"
              @click="deactivateCustomerAction(selectedCustomer)"
            >
              Deactivate Customer
            </button>
          </div>
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

        <form @submit.prevent="submitCustomer" class="mb-6">
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Name *
              </label>
              <input
                type="text"
                v-model="customerForm.name"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                v-model="customerForm.email"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Phone
              </label>
              <input
                type="tel"
                v-model="customerForm.phone"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                City
              </label>
              <input
                type="text"
                v-model="customerForm.city"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white">
                Country
              </label>
              <input
                type="text"
                v-model="customerForm.country"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block text-black dark:text-white">
              Address
            </label>
            <textarea
              v-model="customerForm.address"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Enter full address"
              rows="3"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block text-black dark:text-white">
              Billing Address
            </label>
            <textarea
              v-model="customerForm.billing_address"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Enter billing address (leave empty to use same as address)"
              rows="3"
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
              :disabled="!customerForm.name"
            >
              {{ editingCustomer ? 'Update Customer' : 'Create Customer' }}
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
      selectedCustomer: null,
      editingCustomer: null,
      customerForm: {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        billing_address: ''
      },
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'Phone', value: 'phone', sortable: true },
        { text: 'City', value: 'city', sortable: true },
        { text: 'Status', value: 'is_active', sortable: true },
        { text: 'Created', value: 'created_at', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
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
          customer.phone?.includes(query) ||
          customer.city?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        if (this.statusFilter === 'active') {
          filtered = filtered.filter(customer => customer.is_active);
        } else if (this.statusFilter === 'inactive') {
          filtered = filtered.filter(customer => !customer.is_active);
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
        phone: '',
        address: '',
        city: '',
        country: '',
        billing_address: ''
      };
      this.showCreateModal = true;
    },

    editCustomer(customer) {
      this.editingCustomer = customer;
      this.customerForm = {
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        country: customer.country || '',
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
          this.selectedCustomer.is_active = true;
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
          this.selectedCustomer.is_active = false;
        }

        await this.loadData();
        console.log('Customer deactivated successfully');
      } catch (error) {
        this.handleError(error, 'deactivateCustomerAction');
      }
    },

    createQuoteForCustomer(customer) {
      // Navigate to quotes page with customer pre-selected
      this.$router.push({
        path: '/quotes',
        query: { customer_id: customer.id, action: 'create' }
      });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>
