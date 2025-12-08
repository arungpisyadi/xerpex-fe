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
      <page-breadcrumb page-title="Bookings" />
    </div>

    <div class=" bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-0 xl:pb-0">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Bookings Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            v-if="canCreate"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="createNewBooking"
          >
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
            </svg>
            Create New Booking
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            v-model="filters.search"
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
            v-model="filters.status"
            class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            v-model="filters.from_date"
            placeholder="From Date"
            class="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        <div>
          <input
            type="date"
            v-model="filters.to_date"
            placeholder="To Date"
            class="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div v-if="hasActiveFilters" class="mb-4">
        <button
          @click="clearFilters"
          class="inline-flex items-center gap-2 rounded-md border border-stroke px-4 py-2 text-sm font-medium hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
        >
          <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Clear Filters
        </button>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="displayBookings"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewBookingDetails"
          @edit="handleEditEvent"
          @delete="canDelete ? confirmDeleteBooking : null"
          :show-edit-button="canUpdate"
          :show-delete-button="canDelete"
        >
          <template #status="{ item }">
            <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded-md text-xs font-medium">
              {{ capitalizeFirstLetter(item.status.replace('_', ' ')) }}
            </span>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-md rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5 dark:border-strokedark dark:bg-boxdark">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Confirm Delete
          </h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Delete booking <strong>{{ selectedBookingNumber }}</strong>? This action cannot be undone.
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
import { bookingService } from '../services';
import { usePermissions } from '../composables/usePermissions';
import { SystemModule, PermissionAction } from '../types/permissions.types';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  setup() {
    const permissions = usePermissions();

    return {
      permissions
    };
  },
  data() {
    return {
      bookings: [],
      loading: false,
      filters: {
        status: '',
        from_date: '',
        to_date: '',
        search: ''
      },
      columns: [
        { key: 'booking_code', label: 'Booking #', span: 1.5 },
        { key: 'customer_name', label: 'Customer', span: 1.5 },
        { key: 'sales_person_name', label: 'Sales Person', span: 1.5 },
        { key: 'stay_date', label: 'Stay Date', span: 2 },
        { key: 'total', label: 'Total', span: 1.5, type: 'currency' },
        { key: 'amount_paid', label: 'Paid', span: 1.5, type: 'currency' },
        { key: 'amount_due', label: 'Due', span: 1.5, type: 'currency' },
        { key: 'status', label: 'Status', span: 1.5, type: 'status' }
      ],
      showDeleteModal: false,
      selectedBookingId: null,
      selectedBookingNumber: '',
      notification: {
        show: false,
        type: '',
        message: ''
      }
    };
  },
  computed: {
    canCreate() {
      return this.permissions.canPerform(SystemModule.BOOKINGS, PermissionAction.CREATE);
    },
    canUpdate() {
      return this.permissions.canPerform(SystemModule.BOOKINGS, PermissionAction.UPDATE);
    },
    canDelete() {
      return this.permissions.canPerform(SystemModule.BOOKINGS, PermissionAction.DELETE);
    },
    filteredBookings() {
      let result = this.bookings;

      // Apply status filter
      if (this.filters.status) {
        result = result.filter(b => b.status === this.filters.status);
      }

      // Apply search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        result = result.filter(b =>
          b.booking_code?.toLowerCase().includes(search) ||
          b.customer?.name?.toLowerCase().includes(search) ||
          b.customer?.email?.toLowerCase().includes(search) ||
          b.sales_person?.full_name?.toLowerCase().includes(search)
        );
      }

      // Apply date range filter
      if (this.filters.from_date) {
        const fromDate = new Date(this.filters.from_date);
        result = result.filter(b => {
          const checkInDate = new Date(b.check_in);
          return checkInDate >= fromDate;
        });
      }

      if (this.filters.to_date) {
        const toDate = new Date(this.filters.to_date);
        result = result.filter(b => {
          const checkInDate = new Date(b.check_in);
          return checkInDate <= toDate;
        });
      }

      return result;
    },
    displayBookings() {
      return this.filteredBookings.map(booking => ({
        ...booking,
        customer_name: booking.customer?.name || 'N/A',
        sales_person_name: booking.sales_person?.full_name || 'N/A',
        stay_date: this.formatDateRange(booking.check_in, booking.check_out),
        villas_count: booking.villas?.length || 0,
        packages_list: booking.items?.map(item => item.package?.name).filter(Boolean).join(', ') || 'N/A',
        villas_list: booking.villas?.map(villa => villa.villa?.name).filter(Boolean).join(', ') || 'N/A'
      }));
    },
    hasActiveFilters() {
      return this.filters.status || this.filters.from_date || this.filters.to_date || this.filters.search;
    }
  },
  async mounted() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      this.loading = true;
      try {
        const params = {
          skip: 0,
          limit: 100,
          ...this.filters
        };
        const response = await bookingService.getBookings(params);
        this.bookings = response.bookings || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bookings';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    createNewBooking() {
      if (!this.canCreate) {
        this.showPermissionDeniedAlert('create bookings');
        return;
      }
      this.$router.push('/bookings/create');
    },
    viewBookingDetails(booking) {
      this.$router.push(`/bookings/${booking.id}`);
    },
    handleEditEvent(booking) {
      if (!this.canUpdate) {
        this.showPermissionDeniedAlert('edit bookings');
        return;
      }
      this.$router.push(`/bookings/edit/${booking.id}`);
    },
    confirmDeleteBooking(booking) {
      if (!this.canDelete) {
        this.showPermissionDeniedAlert('delete bookings');
        return;
      }
      this.selectedBookingId = booking.id;
      this.selectedBookingNumber = booking.booking_code || `#${booking.id}`;
      this.showDeleteModal = true;
    },
    async deleteBooking() {
      if (!this.canDelete) {
        this.showPermissionDeniedAlert('delete bookings');
        return;
      }

      try {
        this.loading = true;
        await bookingService.deleteBooking(this.selectedBookingId);
        this.showDeleteModal = false;
        await this.fetchBookings();
        this.showNotification('success', 'Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete booking';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    clearFilters() {
      this.filters = {
        status: '',
        from_date: '',
        to_date: '',
        search: ''
      };
      this.fetchBookings();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatDateRange(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 'N/A';
      const checkInFormatted = new Date(checkIn).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const checkOutFormatted = new Date(checkOut).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return `${checkInFormatted} - ${checkOutFormatted}`;
    },
    formatCurrency(amount) {
      if (amount === null || amount === undefined) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      if (!status) return 'bg-gray-100 text-gray-800';

      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        checked_in: 'bg-green-100 text-green-800',
        checked_out: 'bg-purple-100 text-purple-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    showPermissionDeniedAlert(action) {
      alert(`You do not have permission to ${action}`);
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message
      };

      setTimeout(() => {
        this.notification.show = false;
      }, 5000);
    }
  }
};
</script>
