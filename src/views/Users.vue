<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Users' }]" />
    </div>

    <data-table
      title="Users Management"
      :data="users"
      :columns="columns"
      :loading="loading"
      @add="openAddUserModal"
      @view="viewUser"
      @edit="editUser"
      @delete="confirmDeleteUser"
    />

    <!-- Add/Edit User Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-40">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
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

        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Username
            </label>
            <input
              v-model="userForm.username"
              type="text"
              placeholder="Enter username"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Email
            </label>
            <input
              v-model="userForm.email"
              type="email"
              placeholder="Enter email"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Full Name
            </label>
            <input
              v-model="userForm.full_name"
              type="text"
              placeholder="Enter full name"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4" v-if="!isEditing">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Password
            </label>
            <input
              v-model="userForm.password"
              type="password"
              placeholder="Enter password"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              :required="!isEditing"
            />
          </div>

          <div class="mb-6">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Role
            </label>
            <select
              v-model="userForm.role"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
            >
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-40">
      <div class="w-full max-w-md rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
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
            class="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
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
      columns: [
        { key: 'id', label: 'ID', span: 1 },
        { key: 'username', label: 'Username', span: 2 },
        { key: 'email', label: 'Email', span: 3 },
        { key: 'full_name', label: 'Full Name', span: 3 },
        { key: 'role', label: 'Role', span: 2, type: 'status' }
      ],
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedUserId: null,
      userForm: {
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      }
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await userService.getUsers();
        this.users = response.items || [];
      } catch (error) {
        console.error('Error fetching users:', error);
        // Show error notification
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
      this.showModal = true;
    },
    async viewUser(user) {
      this.$router.push(`/users/${user.id}`);
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
      this.showModal = true;
    },
    confirmDeleteUser(user) {
      this.selectedUserId = user.id;
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.userForm = {
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      };
    },
    async saveUser() {
      try {
        if (this.isEditing) {
          await userService.updateUser(this.selectedUserId, this.userForm);
        } else {
          await userService.createUser(this.userForm);
        }
        this.closeModal();
        await this.fetchUsers();
        // Show success notification
      } catch (error) {
        console.error('Error saving user:', error);
        // Show error notification
      }
    },
    async deleteUser() {
      try {
        await userService.deleteUser(this.selectedUserId);
        this.showDeleteModal = false;
        await this.fetchUsers();
        // Show success notification
      } catch (error) {
        console.error('Error deleting user:', error);
        // Show error notification
      }
    }
  }
};
</script>
