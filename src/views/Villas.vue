<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Villas' }]" />
    </div>

    <data-table
      title="Villas Management"
      :data="villas"
      :columns="columns"
      :loading="loading"
      @add="openAddVillaModal"
      @view="viewVilla"
      @edit="editVilla"
      @delete="confirmDeleteVilla"
    />

    <!-- Add/Edit Villa Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-40">
      <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit Villa' : 'Add New Villa' }}
          </h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveVilla">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Name
            </label>
            <input
              v-model="villaForm.name"
              type="text"
              placeholder="Enter villa name"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              v-model="villaForm.description"
              placeholder="Enter description"
              rows="4"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Location
            </label>
            <input
              v-model="villaForm.location"
              type="text"
              placeholder="Enter location"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Price per Night
            </label>
            <input
              v-model="villaForm.price_per_night"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price per night"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Bedrooms
            </label>
            <input
              v-model="villaForm.bedrooms"
              type="number"
              min="1"
              placeholder="Enter number of bedrooms"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Bathrooms
            </label>
            <input
              v-model="villaForm.bathrooms"
              type="number"
              min="1"
              placeholder="Enter number of bathrooms"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-6">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Status
            </label>
            <select
              v-model="villaForm.status"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
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
            Are you sure you want to delete this villa? This action cannot be undone.
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
            @click="deleteVilla"
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
import { villaService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      villas: [],
      loading: false,
      columns: [
        { key: 'id', label: 'ID', span: 1 },
        { key: 'name', label: 'Name', span: 2 },
        { key: 'location', label: 'Location', span: 2 },
        { key: 'price_per_night', label: 'Price/Night', span: 1, type: 'currency' },
        { key: 'bedrooms', label: 'Bedrooms', span: 1 },
        { key: 'bathrooms', label: 'Bathrooms', span: 1 },
        { key: 'status', label: 'Status', span: 1, type: 'status' }
      ],
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedVillaId: null,
      villaForm: {
        name: '',
        description: '',
        location: '',
        price_per_night: 0,
        bedrooms: 1,
        bathrooms: 1,
        status: 'active'
      }
    };
  },
  async created() {
    await this.fetchVillas();
  },
  methods: {
    async fetchVillas() {
      this.loading = true;
      try {
        const response = await villaService.getVillas();
        this.villas = response.items || [];
      } catch (error) {
        console.error('Error fetching villas:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    openAddVillaModal() {
      this.isEditing = false;
      this.villaForm = {
        name: '',
        description: '',
        location: '',
        price_per_night: 0,
        bedrooms: 1,
        bathrooms: 1,
        status: 'active'
      };
      this.showModal = true;
    },
    async viewVilla(villa) {
      this.$router.push(`/villas/${villa.id}`);
    },
    async editVilla(villa) {
      this.isEditing = true;
      this.selectedVillaId = villa.id;
      this.villaForm = {
        name: villa.name,
        description: villa.description,
        location: villa.location,
        price_per_night: villa.price_per_night,
        bedrooms: villa.bedrooms,
        bathrooms: villa.bathrooms,
        status: villa.status
      };
      this.showModal = true;
    },
    confirmDeleteVilla(villa) {
      this.selectedVillaId = villa.id;
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.villaForm = {
        name: '',
        description: '',
        location: '',
        price_per_night: 0,
        bedrooms: 1,
        bathrooms: 1,
        status: 'active'
      };
    },
    async saveVilla() {
      try {
        if (this.isEditing) {
          await villaService.updateVilla(this.selectedVillaId, this.villaForm);
        } else {
          await villaService.createVilla(this.villaForm);
        }
        this.closeModal();
        await this.fetchVillas();
        // Show success notification
      } catch (error) {
        console.error('Error saving villa:', error);
        // Show error notification
      }
    },
    async deleteVilla() {
      try {
        await villaService.deleteVilla(this.selectedVillaId);
        this.showDeleteModal = false;
        await this.fetchVillas();
        // Show success notification
      } catch (error) {
        console.error('Error deleting villa:', error);
        // Show error notification
      }
    }
  }
};
</script>
