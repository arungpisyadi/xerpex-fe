<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Reports', link: '/reports/dashboard' }, { text: 'Dashboard Summary' }]" />
    </div>

    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-black dark:text-white">Dashboard Summary Report</h2>
    </div>

    <!-- Date Range Filter -->
    <div class="mb-6 p-6 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="mb-2.5 block font-medium text-black dark:text-white">
            Start Date
          </label>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div>
          <label class="mb-2.5 block font-medium text-black dark:text-white">
            End Date
          </label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="generateReport"
            class="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <UserCircleIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ reportData.user_count || 0 }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                (reportData.user_growth || 0) >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ (reportData.user_growth || 0) >= 0 ? '+' : '' }}{{ reportData.user_growth || 0 }}%
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <HomeIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Villas</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ reportData.villa_count || 0 }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                (reportData.villa_growth || 0) >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ (reportData.villa_growth || 0) >= 0 ? '+' : '' }}{{ reportData.villa_growth || 0 }}%
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <CalenderIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Bookings</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ reportData.booking_count || 0 }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                (reportData.booking_growth || 0) >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ (reportData.booking_growth || 0) >= 0 ? '+' : '' }}{{ reportData.booking_growth || 0 }}%
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <DocsIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                ${{ formatNumber(reportData.total_revenue || 0) }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                (reportData.revenue_growth || 0) >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ (reportData.revenue_growth || 0) >= 0 ? '+' : '' }}{{ reportData.revenue_growth || 0 }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Monthly Revenue Chart -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">
                  Monthly Revenue
                </h4>
              </div>
            </div>
          </div>

          <div>
            <div id="monthlyRevenueChart" class="mx-auto flex justify-center">
              <!-- Chart will be rendered here -->
              <bar-chart-one
                :chartData="monthlyRevenueData"
                :chartOptions="monthlyRevenueOptions"
              />
            </div>
          </div>
        </div>

        <!-- Booking Status Chart -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">
                  Booking Status
                </h4>
              </div>
            </div>
          </div>

          <div>
            <div id="bookingStatusChart" class="mx-auto flex justify-center">
              <!-- Chart will be rendered here -->
              <div class="flex flex-col items-center">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div v-for="(status, index) in bookingStatusData" :key="index" class="flex items-center">
                    <div :class="['w-4 h-4 rounded-full mr-2', getStatusColor(status.label)]"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ status.label }}: {{ status.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Villas -->
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mb-6">
        <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
          Top Villas
        </h4>

        <div class="flex flex-col">
          <div class="grid grid-cols-12 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div class="p-2.5 xl:p-5 col-span-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Villa Name
              </h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 col-span-3">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Bookings
              </h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 col-span-4">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Revenue
              </h5>
            </div>
          </div>

          <div v-for="(villa, index) in reportData.top_villas || []" :key="index" class="grid grid-cols-12 border-b border-stroke dark:border-strokedark">
            <div class="flex items-center gap-3 p-2.5 xl:p-5 col-span-5">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-lg font-semibold">{{ index + 1 }}</span>
              </div>
              <p class="text-black dark:text-white">{{ villa.name }}</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5 col-span-3">
              <p class="text-black dark:text-white">{{ villa.booking_count }}</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5 col-span-4">
              <p class="text-black dark:text-white">${{ formatNumber(villa.revenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
          Recent Bookings
        </h4>

        <div class="flex flex-col">
          <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div class="p-2.5 xl:p-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Booking ID
              </h5>
            </div>
            <div class="p-2.5 text-center xl:p-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Customer
              </h5>
            </div>
            <div class="p-2.5 text-center xl:p-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Villa
              </h5>
            </div>
            <div class="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div class="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 class="text-sm font-medium uppercase xsm:text-base">
                Total
              </h5>
            </div>
          </div>

          <div v-for="booking in reportData.recent_bookings || []" :key="booking.id" class="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
            <div class="flex items-center gap-3 p-2.5 xl:p-5">
              <p class="text-black dark:text-white">{{ booking.id }}</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white">{{ booking.customer_name }}</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white">{{ booking.villa_name }}</p>
            </div>

            <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p :class="[
                'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium',
                getStatusClass(booking.status)
              ]">
                {{ booking.status }}
              </p>
            </div>

            <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p class="text-black dark:text-white">${{ formatNumber(booking.total_price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue';
import BarChartOne from '../../components/charts/BarChart/BarChartOne.vue';
import {
  UserCircleIcon,
  HomeIcon,
  CalenderIcon,
  DocsIcon
} from '../../icons';
import { reportService } from '../../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    BarChartOne,
    UserCircleIcon,
    HomeIcon,
    CalenderIcon,
    DocsIcon
  },
  data() {
    return {
      loading: false,
      filters: {
        start_date: this.getDefaultStartDate(),
        end_date: this.getDefaultEndDate()
      },
      reportData: {},
      monthlyRevenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            backgroundColor: '#3C50E0',
            borderColor: '#3C50E0',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      monthlyRevenueOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `$${context.raw.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `$${value.toLocaleString()}`;
              },
            },
          },
        },
      },
      bookingStatusData: []
    };
  },
  async created() {
    await this.generateReport();
  },
  methods: {
    getDefaultStartDate() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().split('T')[0];
    },
    getDefaultEndDate() {
      return new Date().toISOString().split('T')[0];
    },
    async generateReport() {
      this.loading = true;
      try {
        const response = await reportService.getDashboardSummary({
          start_date: this.filters.start_date,
          end_date: this.filters.end_date
        });

        this.reportData = response;

        // Update monthly revenue chart
        if (response.monthly_revenue) {
          this.monthlyRevenueData.datasets[0].data = response.monthly_revenue;
        }

        // Update booking status data
        if (response.booking_status) {
          this.bookingStatusData = Object.entries(response.booking_status).map(([label, value]) => ({
            label,
            value
          }));
        }
      } catch (error) {
        console.error('Error generating report:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    formatNumber(value) {
      return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    getStatusClass(status) {
      if (!status) return '';

      const statusMap = {
        'active': 'bg-success text-success',
        'pending': 'bg-warning text-warning',
        'cancelled': 'bg-red-500 text-danger',
        'completed': 'bg-success text-success',
        'confirmed': 'bg-success text-success',
        'rejected': 'bg-red-500 text-danger'
      };

      return statusMap[status.toLowerCase()] || 'bg-gray-500 text-gray-500';
    },
    getStatusColor(status) {
      if (!status) return 'bg-gray-500';

      const statusMap = {
        'active': 'bg-success',
        'pending': 'bg-warning',
        'cancelled': 'bg-red-500',
        'completed': 'bg-success',
        'confirmed': 'bg-success',
        'rejected': 'bg-red-500'
      };

      return statusMap[status.toLowerCase()] || 'bg-gray-500';
    }
  }
};
</script>
