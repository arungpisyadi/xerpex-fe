<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Bookings' }]" />
    </div>

    <data-table
      title="Bookings Management"
      :data="bookings"
      :columns="columns"
      :loading="loading"
      @add="openAddBookingModal"
      @view="viewBooking"
      @edit="editBooking"
      @delete="confirmDeleteBooking"
    />

    <!-- Add/Edit Booking Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-40">
      <div class="w-full max-w-2xl rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit Booking' : 'Add New Booking' }}
          </h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveBooking">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Name
              </label>
              <input
                v-model="bookingForm.customer_name"
                type="text"
                placeholder="Enter customer name"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Email
              </label>
              <input
                v-model="bookingForm.customer_email"
                type="email"
                placeholder="Enter customer email"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Phone
              </label>
              <input
                v-model="bookingForm.customer_phone"
                type="text"
                placeholder="Enter customer phone"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Villa
              </label>
              <select
                v-model="bookingForm.villa_id"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="" disabled>Select a villa</option>
                <option v-for="villa in villas" :key="villa.id" :value="villa.id">
                  {{ villa.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Check-in Date
              </label>
              <input
                v-model="bookingForm.check_in_date"
                type="date"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Check-out Date
              </label>
              <input
                v-model="bookingForm.check_out_date"
                type="date"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Number of Guests
              </label>
              <input
                v-model="bookingForm.num_guests"
                type="number"
                min="1"
                placeholder="Enter number of guests"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Status
              </label>
              <select
                v-model="bookingForm.status"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Special Requests
            </label>
            <textarea
              v-model="bookingForm.special_requests"
              placeholder="Enter special requests"
              rows="3"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
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
            Are you sure you want to delete this booking? This action cannot be undone.
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
            @click="deleteBooking"
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
import { bookingService, villaService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      bookings: [],
      villas: [],
      loading: false,
      columns: [
        { key: 'id', label: 'ID', span: 1 },
        { key: 'customer_name', label: 'Customer', span: 2 },
        { key: 'villa_name', label: 'Villa', span: 2 },
        { key: 'check_in_date', label: 'Check-in', span: 1, type: 'date' },
        { key: 'check_out_date', label: 'Check-out', span: 1, type: 'date' },
        { key: 'total_price', label: 'Total', span: 1, type: 'currency' },
        { key: 'status', label: 'Status', span: 1, type: 'status' }
      ],
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedBookingId: null,
      bookingForm: {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      }
    };
  },
  async created() {
    await Promise.all([
      this.fetchBookings(),
      this.fetchVillas()
    ]);
  },
  methods: {
    async fetchBookings() {
      this.loading = true;
      try {
        const response = await bookingService.getBookings();

        // Process bookings to add villa_name
        this.bookings = (response.items || []).map(booking => {
          const villa = this.villas.find(v => v.id === booking.villa_id);
          return {
            ...booking,
            villa_name: villa ? villa.name : 'Unknown Villa'
          };
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    async fetchVillas() {
      try {
        const response = await villaService.getVillas();
        this.villas = response.items || [];
      } catch (error) {
        console.error('Error fetching villas:', error);
        // Show error notification
      }
    },
    openAddBookingModal() {
      this.isEditing = false;
      this.bookingForm = {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      };
      this.showModal = true;
    },
    async viewBooking(booking) {
      this.$router.push(`/bookings/${booking.id}`);
    },
    async editBooking(booking) {
      this.isEditing = true;
      this.selectedBookingId = booking.id;

      // Get detailed booking information
      try {
        const bookingDetails = await bookingService.getBookingById(booking.id);

        this.bookingForm = {
          customer_name: bookingDetails.customer_name,
          customer_email: bookingDetails.customer_email,
          customer_phone: bookingDetails.customer_phone,
          villa_id: bookingDetails.villa_id,
          check_in_date: bookingDetails.check_in_date,
          check_out_date: bookingDetails.check_out_date,
          num_guests: bookingDetails.num_guests,
          special_requests: bookingDetails.special_requests || '',
          status: bookingDetails.status
        };

        this.showModal = true;
      } catch (error) {
        console.error('Error fetching booking details:', error);
        // Show error notification
      }
    },
    confirmDeleteBooking(booking) {
      this.selectedBookingId = booking.id;
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.bookingForm = {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      };
    },
    async saveBooking() {
      try {
        if (this.isEditing) {
          await bookingService.updateBooking(this.selectedBookingId, this.bookingForm);
        } else {
          await bookingService.createBooking(this.bookingForm);
        }
        this.closeModal();
        await this.fetchBookings();
        // Show success notification
      } catch (error) {
        console.error('Error saving booking:', error);
        // Show error notification
      }
    },
    async deleteBooking() {
      try {
        await bookingService.deleteBooking(this.selectedBookingId);
        this.showDeleteModal = false;
        await this.fetchBookings();
        // Show success notification
      } catch (error) {
        console.error('Error deleting booking:', error);
        // Show error notification
      }
    }
  }
};
</script>
