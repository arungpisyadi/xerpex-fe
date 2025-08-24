<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Salesmen" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Salesmen Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search salesmen..."
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
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="createNewSalesman">
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
            </svg>
            Add Salesman
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredSalesmen"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @edit="editSalesman"
          @delete="deleteSalesmanConfirm"
        />
      </div>
    </div>

    <!-- Create/Edit Salesman Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit Salesman' : 'Add New Salesman' }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <FormKit
          type="form"
          :actions="false"
          @submit="submitSalesman"
          :classes="{
            form: 'mb-6'
          }"
        >
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <FormKit
                type="text"
                name="first_name"
                label="First Name"
                v-model="salesmanForm.first_name"
                placeholder="Enter first name"
                validation="required|length:2"
                validation-messages="{
                  required: 'First name is required',
                  length: 'First name must be at least 2 characters long'
                }"
                :classes="{
                  outer: '',
                  wrapper: '',
                  label: 'mb-2.5 block font-medium text-black dark:text-white',
                  input: 'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary border-stroke dark:border-form-strokedark',
                  message: 'mt-1 text-sm text-danger'
                }"
              >
                <template #label="context">
                  {{ context.label }} <span class="text-meta-1">*</span>
                </template>
              </FormKit>
            </div>
            <div>
              <FormKit
                type="text"
                name="last_name"
                label="Last Name"
                v-model="salesmanForm.last_name"
                placeholder="Enter last name"
                validation="required|length:2"
                validation-messages="{
                  required: 'Last name is required',
                  length: 'Last name must be at least 2 characters long'
                }"
                :classes="{
                  outer: '',
                  wrapper: '',
                  label: 'mb-2.5 block font-medium text-black dark:text-white',
                  input: 'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary border-stroke dark:border-form-strokedark',
                  message: 'mt-1 text-sm text-danger'
                }"
              >
                <template #label="context">
                  {{ context.label }} <span class="text-meta-1">*</span>
                </template>
              </FormKit>
            </div>
          </div>

          <div class="mb-4">
            <FormKit
              type="email"
              name="email"
              label="Email"
              v-model="salesmanForm.email"
              placeholder="Enter email address"
              validation="required|email"
              validation-messages="{
                required: 'Email is required',
                email: 'Please enter a valid email address'
              }"
              :classes="{
                outer: '',
                wrapper: '',
                label: 'mb-2.5 block font-medium text-black dark:text-white',
                input: 'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary border-stroke dark:border-form-strokedark',
                message: 'mt-1 text-sm text-danger'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
            </FormKit>
          </div>

          <div class="mb-4">
            <FormKit
              type="tel"
              name="phone_number"
              label="Phone Number"
              v-model="salesmanForm.phone_number"
              placeholder="Enter phone number"
              :classes="{
                outer: '',
                wrapper: '',
                label: 'mb-2.5 block font-medium text-black dark:text-white',
                input: 'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary border-stroke dark:border-form-strokedark',
                message: 'mt-1 text-sm text-danger'
              }"
            />
          </div>

          <div class="mb-6">
            <FormKit
              type="checkbox"
              name="is_active"
              label="Active"
              v-model="salesmanForm.is_active"
              :classes="{
                outer: '',
                wrapper: 'flex items-center',
                label: 'flex cursor-pointer select-none items-center font-medium text-black dark:text-white mt-2!',
                input: 'sr-only',
                decorator: 'mr-4 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark',
                decoratorIcon: 'h-2.5 w-2.5 rounded-sm bg-primary',
                message: 'mt-1 text-sm text-danger'
              }"
            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <FormKit
              type="button"
              @click="closeModal"
              :classes="{
                input: 'flex justify-center rounded border border-stroke py-2 px-6 font-medium text-white bg-red-500! hover:shadow-1 dark:border-strokedark dark:text-white'
              }"
            >
              Cancel
            </FormKit>
            <FormKit
              type="submit"
              :disabled="submitting"
              :classes="{
                input: 'flex items-center justify-center px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed'
              }"
            >
              {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Save') }}
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
import { salesmanService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      loading: true,
      submitting: false,
      searchQuery: '',
      statusFilter: '',
      salesmen: [],
      showModal: false,
      isEditing: false,
      salesmanForm: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_active: true
      },
      columns: [
        { key: 'full_name', label: 'Name', span: 3 },
        { key: 'email', label: 'Email', span: 3 },
        { key: 'phone_number', label: 'Phone', span: 2 },
        { key: 'is_active', label: 'Status', span: 2, type: 'status' },
        { key: 'created_at', label: 'Created', span: 2, type: 'date' }
      ]
    };
  },
  computed: {
    filteredSalesmen() {
      let filtered = [...this.salesmen];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(salesman =>
          salesman.full_name?.toLowerCase().includes(query) ||
          salesman.first_name?.toLowerCase().includes(query) ||
          salesman.last_name?.toLowerCase().includes(query) ||
          salesman.email?.toLowerCase().includes(query) ||
          salesman.phone_number?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter !== '') {
        const isActive = this.statusFilter === 'true';
        filtered = filtered.filter(salesman => salesman.is_active === isActive);
      }

      return filtered;
    }
  },
  async created() {
    await this.fetchSalesmen();
  },
  methods: {
    async fetchSalesmen() {
      try {
        this.loading = true;
        const response = await salesmanService.getSalesmen();
        this.salesmen = response || [];
      } catch (error) {
        console.error('Error fetching salesmen:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    createNewSalesman() {
      this.isEditing = false;
      this.salesmanForm = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_active: true
      };
      this.showModal = true;
    },
    editSalesman(salesman) {
      this.isEditing = true;
      this.salesmanForm = {
        id: salesman.id,
        first_name: salesman.first_name || '',
        last_name: salesman.last_name || '',
        email: salesman.email || '',
        phone_number: salesman.phone_number || '',
        is_active: salesman.is_active
      };
      this.showModal = true;
    },
    async submitSalesman() {
      try {
        this.submitting = true;

        if (this.isEditing) {
          await salesmanService.updateSalesman(this.salesmanForm.id, this.salesmanForm);
        } else {
          await salesmanService.createSalesman(this.salesmanForm);
        }

        this.closeModal();
        await this.fetchSalesmen();
        // Show success notification
      } catch (error) {
        console.error('Error saving salesman:', error);
        // Show error notification
      } finally {
        this.submitting = false;
      }
    },
    deleteSalesmanConfirm(salesman) {
      if (confirm(`Are you sure you want to delete ${salesman.full_name}?`)) {
        this.deleteSalesman(salesman.id);
      }
    },
    async deleteSalesman(id) {
      try {
        await salesmanService.deleteSalesman(id);
        await this.fetchSalesmen();
        // Show success notification
      } catch (error) {
        console.error('Error deleting salesman:', error);
        // Show error notification
      }
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.salesmanForm = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_active: true
      };
    }
  }
};
</script>
