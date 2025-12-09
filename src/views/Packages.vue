<template>
  <admin-layout>
    <!-- Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-999999 max-w-sm">
      <div
        :class="[
          'rounded-lg border p-4 shadow-lg',
          notification.type === 'success'
            ? 'border-success bg-success/10 text-success'
            : 'border-danger bg-red-500/10 text-danger',
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              v-if="notification.type === 'success'"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="notification.show = false"
              class="inline-flex rounded-md p-1.5 hover:bg-black/5"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <page-breadcrumb page-title="Packages" />
    </div>

    <div
      class="bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
    >
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">Packages Management</h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search packages..."
              v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg
                class="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
          <button
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="openAddPackageModal"
          >
            <svg
              class="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                fill="white"
              />
            </svg>
            Add New Package
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredPackages"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewPackage"
          @edit="editPackage"
          @delete="confirmDeletePackage"
        />
      </div>
    </div>

    <!-- Add/Edit Package Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5"
      >
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit Package' : 'Add New Package' }}
          </h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z"
                fill=""
              ></path>
            </svg>
          </button>
        </div>

        <FormKit type="form" :actions="false" @submit="savePackage">
          <div class="mb-4">
            <FormKit
              type="text"
              name="name"
              label="Name"
              v-model="packageForm.name"
              placeholder="Enter package name"
              validation="required|length:2"
              validation-messages="{
                required: 'Package name is required',
                length: 'Package name must be at least 2 characters long'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
            </FormKit>
          </div>

          <div class="mb-4">
            <FormKit
              type="select"
              name="category"
              label="Category"
              v-model="packageForm.category"
              :options="categoryOptions"
            />
          </div>

          <div class="mb-4">
            <FormKit
              type="select"
              name="type"
              label="Type"
              v-model="packageForm.type"
              :options="typeOptions"
            />
          </div>

          <div class="mb-4">
            <FormKit
              type="textarea"
              name="description"
              label="Description"
              v-model="packageForm.description"
              placeholder="Enter package description"
              validation="required|length:10"
              validation-messages="{
                required: 'Description is required',
                length: 'Description must be at least 10 characters long'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
            </FormKit>
          </div>

          <div class="mb-4">
            <FormKit
              type="number"
              name="days"
              label="Days"
              v-model="packageForm.days"
              placeholder="Enter number of days"
              min="1"
              max="365"
              validation="required|between:1,365"
              validation-messages="{
                required: 'Days is required',
                between: 'Days must be between 1 and 365'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
            </FormKit>
          </div>

          <div class="mb-4">
            <FormKit
              type="text"
              name="cost_per_pax"
              label="Cost per Pax"
              v-model="packageForm.cost_per_pax"
              placeholder="0"
              validation="required|min:1"
              validation-messages="{
                required: 'Cost per pax is required',
                min: 'Cost per pax must be greater than 0'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
              <template #prefix>
                <span class="absolute left-1 top-1/2 -translate-y-2 text-gray-500 text-xs"
                  >IDR</span
                >
              </template>
            </FormKit>
          </div>

          <div class="mb-6">
            <FormKit
              type="number"
              name="min_pax"
              label="Minimum Pax"
              v-model="packageForm.min_pax"
              placeholder="Enter minimum pax"
              min="1"
              max="100"
              validation="required|between:1,100"
              validation-messages="{
                required: 'Minimum pax is required',
                between: 'Minimum pax must be between 1 and 100'
              }"
            >
              <template #label="context">
                {{ context.label }} <span class="text-meta-1">*</span>
              </template>
            </FormKit>
          </div>

          <div class="flex justify-end gap-4">
            <FormKit type="button" @click="closeModal"> Cancel </FormKit>
            <FormKit type="submit">
              {{ isEditing ? 'Update' : 'Save' }}
            </FormKit>
          </div>
        </FormKit>
      </div>
    </div>

    <!-- View Package Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5"
      >
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">Package Details</h4>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z"
                fill=""
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedPackage" class="space-y-6">
          <!-- Package Information Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <h5 class="mb-3 font-medium text-black dark:text-white">Basic Information</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
                  <p class="text-black dark:text-white">{{ selectedPackage.name }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Category:</span
                  >
                  <p class="text-black dark:text-white">{{ selectedPackage.category }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                  <p class="text-black dark:text-white">{{ selectedPackage.type }}</p>
                </div>
              </div>
            </div>

            <div
              class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <h5 class="mb-3 font-medium text-black dark:text-white">Pricing & Details</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Days:</span>
                  <p class="text-black dark:text-white">{{ selectedPackage.days }} days</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Cost per Pax:</span
                  >
                  <p class="text-black dark:text-white">
                    IDR {{ formatCurrency(selectedPackage.cost_per_pax) }}
                  </p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Min Pax:</span>
                  <p class="text-black dark:text-white">{{ selectedPackage.min_pax }} persons</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Package ID:</span
                  >
                  <p class="text-black dark:text-white">#{{ selectedPackage.id }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div
            class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h5 class="mb-3 font-medium text-black dark:text-white">Description</h5>
            <p class="text-gray-600 dark:text-gray-400">{{ selectedPackage.description }}</p>
          </div>

          <!-- Timestamps -->
          <div
            class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h5 class="mb-3 font-medium text-black dark:text-white">Timeline</h5>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                <p class="text-black dark:text-white">
                  {{ formatDate(selectedPackage.created_at) }}
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >Last Updated:</span
                >
                <p class="text-black dark:text-white">
                  {{ formatDate(selectedPackage.updated_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5"
      >
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">Confirm Delete</h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z"
                fill=""
              ></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this package? This action cannot be undone.
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
            @click="deletePackage"
            class="flex justify-center rounded bg-red-500 py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import DataTable from '../components/common/DataTable.vue'
import { packageService } from '../services'

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable,
  },
  data() {
    return {
      packages: [],
      categories: [],
      types: [],
      loading: false,
      searchQuery: '',
      columns: [
        { key: 'id', label: 'ID', span: 1 },
        { key: 'name', label: 'Name', span: 2 },
        { key: 'category', label: 'Category', span: 1 },
        { key: 'type', label: 'Type', span: 1 },
        { key: 'description', label: 'Description', span: 2 },
        { key: 'days', label: 'Days', span: 1 },
        { key: 'cost_per_pax', label: 'Cost/Pax', span: 1, type: 'currency' },
        { key: 'min_pax', label: 'Min Pax', span: 1 },
      ],
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedPackageId: null,
      selectedPackage: null,
      packageForm: {
        name: '',
        category: '',
        type: '',
        description: '',
        days: 1,
        cost_per_pax: '',
        min_pax: 1,
      },
      formErrors: {},
      notification: {
        show: false,
        type: '',
        message: '',
      },
    }
  },
  computed: {
    filteredPackages() {
      if (!this.searchQuery) {
        return this.packages
      }

      const query = this.searchQuery.toLowerCase()
      return this.packages.filter((pkg) => {
        return (
          pkg.name?.toLowerCase().includes(query) ||
          pkg.category?.toLowerCase().includes(query) ||
          pkg.type?.toLowerCase().includes(query) ||
          pkg.description?.toLowerCase().includes(query) ||
          String(pkg.days || '').includes(query) ||
          String(pkg.cost_per_pax || '').includes(query) ||
          String(pkg.min_pax || '').includes(query)
        )
      })
    },
    categoryOptions() {
      return [
        { label: 'Select category', value: '' },
        ...this.categories.map((category) => ({ label: category, value: category })),
      ]
    },
    typeOptions() {
      return [
        { label: 'Select type', value: '' },
        ...this.types.map((type) => ({ label: type, value: type })),
      ]
    },
  },
  async created() {
    await this.fetchPackages()
    await this.fetchMetadata()
  },
  methods: {
    async fetchPackages() {
      this.loading = true
      try {
        const response = await packageService.getPackages()
        this.packages = response.items || response || []
      } catch (error) {
        console.error('Error fetching packages:', error)
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to fetch packages'
        this.showNotification('error', errorMessage)
      } finally {
        this.loading = false
      }
    },
    async fetchMetadata() {
      try {
        // Get categories and types from environment variables
        const envCategories = import.meta.env.VITE_PACKAGE_CATEGORIES?.split(',') || []
        const envTypes = import.meta.env.VITE_PACKAGE_TYPES?.split(',') || []

        this.categories =
          envCategories.length > 0 ? envCategories : ['DELUXE', 'STANDARD LT 1', 'STANDARD LT 2']
        this.types = envTypes.length > 0 ? envTypes : ['BASIC', 'ADD-ON']
      } catch (error) {
        console.error('Error fetching metadata:', error)
        // Use default values if env vars are not available
        this.categories = ['DELUXE', 'STANDARD LT 1', 'STANDARD LT 2']
        this.types = ['BASIC', 'ADD-ON']
      }
    },
    openAddPackageModal() {
      this.isEditing = false
      this.packageForm = {
        name: '',
        category: '',
        type: '',
        description: '',
        days: 1,
        cost_per_pax: '',
        min_pax: 1,
      }
      this.showModal = true
    },
    async viewPackage(pkg) {
      try {
        this.loading = true
        const response = await packageService.getPackageById(pkg.id)
        this.selectedPackage = response
        this.showViewModal = true
      } catch (error) {
        console.error('Error fetching package details:', error)
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to fetch package details'
        this.showNotification('error', errorMessage)
      } finally {
        this.loading = false
      }
    },
    async editPackage(pkg) {
      this.isEditing = true
      this.selectedPackageId = pkg.id
      this.packageForm = {
        name: pkg.name,
        category: pkg.category,
        type: pkg.type,
        description: pkg.description,
        days: pkg.days,
        cost_per_pax: pkg.cost_per_pax,
        min_pax: pkg.min_pax,
      }
      this.showModal = true
    },
    confirmDeletePackage(pkg) {
      this.selectedPackageId = pkg.id
      this.showDeleteModal = true
    },
    closeModal() {
      this.showModal = false
      this.formErrors = {}
      this.packageForm = {
        name: '',
        category: '',
        type: '',
        description: '',
        days: 1,
        cost_per_pax: '',
        min_pax: 1,
      }
    },
    closeViewModal() {
      this.showViewModal = false
      this.selectedPackage = null
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    formatCurrency(value) {
      if (!value) return '0'
      return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message,
      }

      // Auto hide after 5 seconds
      setTimeout(() => {
        this.notification.show = false
      }, 5000)
    },
    async savePackage(formData) {
      try {
        this.loading = true

        // FormKit provides the form data, but we'll use our packageForm for consistency
        const packageData = {
          name: this.packageForm.name,
          category: this.packageForm.category,
          type: this.packageForm.type,
          description: this.packageForm.description,
          days: this.packageForm.days,
          cost_per_pax: this.packageForm.cost_per_pax,
          min_pax: this.packageForm.min_pax,
        }

        if (this.isEditing) {
          await packageService.updatePackage(this.selectedPackageId, packageData)
          this.showNotification('success', 'Package updated successfully')
        } else {
          await packageService.createPackage(packageData)
          this.showNotification('success', 'Package created successfully')
        }
        this.closeModal()
        await this.fetchPackages()
      } catch (error) {
        console.error('Error saving package:', error)
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to save package'
        this.showNotification('error', errorMessage)
      } finally {
        this.loading = false
      }
    },
    async deletePackage() {
      try {
        this.loading = true
        await packageService.deletePackage(this.selectedPackageId)
        this.showDeleteModal = false
        await this.fetchPackages()
        this.showNotification('success', 'Package deleted successfully')
      } catch (error) {
        console.error('Error deleting package:', error)
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to delete package'
        this.showNotification('error', errorMessage)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
