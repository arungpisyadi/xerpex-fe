<template>
  <admin-layout>
    <!-- Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-999999 max-w-sm">
      <div
        :class="[
          'rounded-lg border p-4 shadow-lg',
          notification.type === 'success'
            ? 'border-success bg-success/10 text-success'
            : 'border-danger bg-red-500/10 text-danger'
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="notification.show = false" class="inline-flex rounded-md p-1.5 hover:bg-black/5">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <page-breadcrumb page-title="Users" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Users Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search users..."
              v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="openAddUserModal">
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
            </svg>
            Add New User
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredUsers"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewUser"
          @edit="editUser"
          @delete="confirmDeleteUser"
        />
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit User' : 'Add New User' }}
          </h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <FormKit
          type="form"
          :actions="false"
          @submit="saveUser"

        >
          <FormKit
            type="text"
            name="username"
            label="Username"
            placeholder="Enter username"
            v-model="userForm.username"
            validation="required|length:3"

          />

          <FormKit
            type="email"
            name="email"
            label="Email"
            placeholder="Enter email"
            v-model="userForm.email"
            validation="required|email"

          />

          <FormKit
            type="text"
            name="full_name"
            label="Full Name"
            placeholder="Enter full name"
            v-model="userForm.full_name"
            validation="required|length:2"

          />

          <FormKit
            v-if="!isEditing"
            type="password"
            name="password"
            label="Password"
            placeholder="Enter password"
            v-model="userForm.password"
            validation="required|length:6"

          />

          <FormKit
            type="select"
            name="role"
            label="Role"
            v-model="userForm.role"
            validation="required"
            :options="[
              { label: 'Select role', value: '', attrs: { disabled: true } },
              { label: 'Admin', value: 'admin' },
              { label: 'Manager', value: 'manager' },
              { label: 'Finance', value: 'finance' },
              { label: 'Sales', value: 'sales' },
              { label: 'Survey', value: 'survey' },
              { label: 'Staff', value: 'staff' }
            ]"

          />

          <div class="flex justify-end gap-4">
            <FormKit
              type="button"
              @click="closeModal"
            >
              Cancel
            </FormKit>
            <FormKit
              type="submit"
            >
              {{ isEditing ? 'Update' : 'Save' }}
            </FormKit>
          </div>
        </FormKit>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            User Details
          </h4>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedUser" class="space-y-6">
          <!-- User Information Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Basic Information</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Username:</span>
                  <p class="text-black dark:text-white">{{ selectedUser.username }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name:</span>
                  <p class="text-black dark:text-white">{{ selectedUser.full_name }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <p class="text-black dark:text-white">{{ selectedUser.email }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Role & Status</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Role:</span>
                  <span
                    :class="[
                      'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ml-2',
                      getRoleClass(selectedUser.role)
                    ]"
                  >
                    {{ formatRole(selectedUser.role) }}
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">User ID:</span>
                  <p class="text-black dark:text-white">#{{ selectedUser.id }}</p>
                </div>
                <div v-if="selectedUser.is_active !== undefined">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span
                    :class="[
                      'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ml-2',
                      selectedUser.is_active
                        ? 'bg-success text-success'
                        : 'bg-red-500 text-danger'
                    ]"
                  >
                    {{ selectedUser.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 class="mb-3 font-medium text-black dark:text-white">Timeline</h5>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedUser.created_at) }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedUser.updated_at) }}</p>
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
    <div v-if="showDeleteModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Confirm Delete
          </h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this user? This action cannot be undone.
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
            @click="deleteUser"
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
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { userService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      users: [],
      loading: false,
      searchQuery: '',
      columns: [
        { key: 'username', label: 'Username', span: 2 },
        { key: 'email', label: 'Email', span: 3 },
        { key: 'full_name', label: 'Full Name', span: 3 },
        { key: 'role', label: 'Role', span: 2, type: 'status' }
      ],
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedUserId: null,
      selectedUser: null,
      userForm: {
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      },
      formErrors: {},
      notification: {
        show: false,
        type: '',
        message: ''
      }
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users;
      }

      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => {
        return (
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.full_name?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
        );
      });
    }
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await userService.getUsers();
        this.users = response.items || response || [];
      } catch (error) {
        console.error('Error fetching users:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    openAddUserModal() {
      this.isEditing = false;
      this.userForm = {
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      };
      this.formErrors = {};
      this.showModal = true;
    },
    async viewUser(user) {
      try {
        this.loading = true;
        const response = await userService.getUserById(user.id);
        this.selectedUser = response;
        this.showViewModal = true;
      } catch (error) {
        console.error('Error fetching user details:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user details';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async editUser(user) {
      this.isEditing = true;
      this.selectedUserId = user.id;
      this.userForm = {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      };
      this.formErrors = {};
      this.showModal = true;
    },
    confirmDeleteUser(user) {
      this.selectedUserId = user.id;
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.formErrors = {};
      this.userForm = {
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatRole(role) {
      if (!role) return '';
      return role.charAt(0).toUpperCase() + role.slice(1);
    },
    getRoleClass(role) {
      if (!role) return 'bg-gray/10 text-gray border border-gray/20';

      const roleStr = String(role).toLowerCase();
      switch (roleStr) {
        case 'admin':
          return 'bg-red-500/10 text-danger border border-danger/20';
        case 'manager':
          return 'bg-warning/10 text-warning border border-warning/20';
        case 'user':
          return 'bg-success/10 text-success border border-success/20';
        default:
          return 'bg-gray/10 text-gray border border-gray/20';
      }
    },
    validateField(fieldName) {
      this.formErrors = { ...this.formErrors };
      delete this.formErrors[fieldName];

      switch (fieldName) {
        case 'username':
          if (!this.userForm.username || this.userForm.username.trim().length < 3) {
            this.formErrors.username = 'Username must be at least 3 characters long';
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.userForm.email || !emailRegex.test(this.userForm.email)) {
            this.formErrors.email = 'Please enter a valid email address';
          }
          break;
        case 'full_name':
          if (!this.userForm.full_name || this.userForm.full_name.trim().length < 2) {
            this.formErrors.full_name = 'Full name must be at least 2 characters long';
          }
          break;
        case 'password':
          if (!this.isEditing && (!this.userForm.password || this.userForm.password.length < 6)) {
            this.formErrors.password = 'Password must be at least 6 characters long';
          }
          break;
        case 'role':
          if (!this.userForm.role) {
            this.formErrors.role = 'Please select a role';
          }
          break;
      }
    },
    validateForm() {
      this.formErrors = {};

      // Validate all fields
      this.validateField('username');
      this.validateField('email');
      this.validateField('full_name');
      if (!this.isEditing) {
        this.validateField('password');
      }
      this.validateField('role');

      return Object.keys(this.formErrors).length === 0;
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message
      };

      // Auto hide after 5 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 5000);
    },
    async saveUser() {
      if (!this.validateForm()) {
        this.showNotification('error', 'Please fix the validation errors before submitting');
        return;
      }

      try {
        this.loading = true;
        if (this.isEditing) {
          await userService.updateUser(this.selectedUserId, this.userForm);
          this.showNotification('success', 'User updated successfully');
        } else {
          await userService.createUser(this.userForm);
          this.showNotification('success', 'User created successfully');
        }
        this.closeModal();
        await this.fetchUsers();
      } catch (error) {
        console.error('Error saving user:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save user';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async deleteUser() {
      try {
        this.loading = true;
        await userService.deleteUser(this.selectedUserId);
        this.showDeleteModal = false;
        await this.fetchUsers();
        this.showNotification('success', 'User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
