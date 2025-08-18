<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Villas', link: '/villas' }, { text: 'Villa Detail' }]" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Villa Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Villa Image and Basic Info -->
        <div class="md:col-span-1">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex flex-col items-center">
              <div class="mb-4 h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  v-if="villa.image_url"
                  :src="villa.image_url"
                  :alt="villa.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-gray-500 dark:text-gray-400">No image available</span>
                </div>
              </div>
              <h3 class="mb-1 text-xl font-semibold text-black dark:text-white">{{ villa.name }}</h3>
              <div class="flex items-center mb-2">
                <span v-for="i in Math.floor(villa.rating || 0)" :key="`star-${i}`" class="text-yellow-500">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                </span>
                <span class="text-sm text-gray-500 ml-1">({{ villa.rating || 0 }})</span>
              </div>
              <p class="mb-4 text-sm text-gray-500">{{ villa.location }}</p>

              <div class="w-full border-t border-stroke pt-4 dark:border-strokedark">
                <div class="mb-3 flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white">Capacity: {{ villa.capacity }} persons</span>
                </div>
                <div class="mb-3 flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z" />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white">Bedrooms: {{ villa.bedrooms }}</span>
                </div>
                <div class="mb-3 flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z" />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white">Bathrooms: {{ villa.bathrooms }}</span>
                </div>
                <div class="flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,17H13V11H11V17Z" />
                      <path d="M11,9H13V7H11V9Z" />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white">Status: {{ villa.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Villa Description and Amenities -->
        <div class="md:col-span-2">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
              Description
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ villa.description }}</p>
          </div>

          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
              Amenities
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(amenity, index) in villa.amenities" :key="index" class="flex items-center">
                <span class="mr-2 text-primary">
                  <svg class="fill-current" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                </span>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ amenity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price and Booking Information -->
      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
            Pricing
          </h4>
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Base Price:</span>
              <span class="text-sm font-medium text-black dark:text-white">${{ villa.base_price }} / night</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Weekend Price:</span>
              <span class="text-sm font-medium text-black dark:text-white">${{ villa.weekend_price || (villa.base_price * 1.2).toFixed(2) }} / night</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Holiday Price:</span>
              <span class="text-sm font-medium text-black dark:text-white">${{ villa.holiday_price || (villa.base_price * 1.5).toFixed(2) }} / night</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Cleaning Fee:</span>
              <span class="text-sm font-medium text-black dark:text-white">${{ villa.cleaning_fee || '50.00' }}</span>
            </div>
          </div>
          <div class="pt-4 border-t border-stroke dark:border-strokedark">
            <div class="flex justify-between">
              <span class="text-base font-medium text-black dark:text-white">Minimum Stay:</span>
              <span class="text-base font-medium text-black dark:text-white">{{ villa.minimum_stay || 1 }} night(s)</span>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
            Availability
          </h4>
          <div class="mb-4">
            <div v-if="upcomingBookings.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400">No upcoming bookings for this villa.</p>
            </div>
            <div v-else>
              <div v-for="(booking, index) in upcomingBookings" :key="index" class="mb-3 pb-3 border-b border-stroke dark:border-strokedark last:mb-0 last:pb-0 last:border-0">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}</span>
                  <span class="text-xs px-2 py-1 rounded" :class="getStatusClass(booking.status)">{{ booking.status }}</span>
                </div>
                <div class="text-xs text-gray-500">{{ getDuration(booking.check_in, booking.check_out) }} nights</div>
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-stroke dark:border-strokedark">
            <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 w-full">Check Availability</button>
          </div>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { villaService, bookingService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      villa: {
        amenities: []
      },
      upcomingBookings: []
    };
  },
  async created() {
    await this.fetchVillaData();
  },
  methods: {
    async fetchVillaData() {
      try {
        const villaId = this.$route.params.id;

        // Fetch villa data
        this.villa = await villaService.getVillaById(villaId);

        // If amenities is a string, convert to array
        if (typeof this.villa.amenities === 'string') {
          try {
            this.villa.amenities = JSON.parse(this.villa.amenities);
          } catch (e) {
            this.villa.amenities = this.villa.amenities.split(',').map(item => item.trim());
          }
        }

        // Ensure amenities is an array
        if (!Array.isArray(this.villa.amenities)) {
          this.villa.amenities = [];
        }

        // Fetch upcoming bookings for this villa
        const bookingsResponse = await bookingService.getBookingsByVillaId(villaId);
        this.upcomingBookings = (bookingsResponse.items || [])
          .filter(booking => new Date(booking.check_out) >= new Date())
          .sort((a, b) => new Date(a.check_in) - new Date(b.check_in))
          .slice(0, 5); // Show only the next 5 bookings
      } catch (error) {
        console.error('Error fetching villa data:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    getDuration(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 0;

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },
    getStatusClass(status) {
      const statusMap = {
        'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      };

      return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
};
</script>
