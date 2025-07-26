<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Reports', link: '/reports' }, { text: 'Booking Status' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Booking Status Report
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <select
              v-model="timeRange"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div v-if="timeRange === 'custom'" class="flex gap-2">
            <div>
              <input
                type="date"
                v-model="startDate"
                class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
            <div>
              <input
                type="date"
                v-model="endDate"
                class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
          </div>
          <button class="btn btn-primary" @click="generateReport">
            Generate Report
          </button>
          <button class="btn btn-outline-primary" @click="exportReport">
            <span class="mr-2">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3334 5.33334L8.00002 10.6667L2.66669 5.33334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10.6667V1.33334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.33331 12H14.6666" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Export
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          <!-- Total Bookings -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10H1M16 2V6M6 2V6M3 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H3C1.89543 4 1 4.89543 1 6V20C1 21.1046 1.89543 22 3 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.totalBookings }}
                </h4>
                <span class="text-sm font-medium">Total Bookings</span>
              </div>
            </div>
          </div>

          <!-- Confirmed Bookings -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.confirmedBookings }} ({{ calculatePercentage(reportData.confirmedBookings, reportData.totalBookings) }}%)
                </h4>
                <span class="text-sm font-medium">Confirmed Bookings</span>
              </div>
            </div>
          </div>

          <!-- Cancelled Bookings -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7L7 15M7 7L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.cancelledBookings }} ({{ calculatePercentage(reportData.cancelledBookings, reportData.totalBookings) }}%)
                </h4>
                <span class="text-sm font-medium">Cancelled Bookings</span>
              </div>
            </div>
          </div>

          <!-- Total Revenue -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2V20M2 11H20M2 6H6M16 6H20M2 16H6M16 16H20M6 2V6M6 16V20M16 2V6M16 16V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  ${{ formatPrice(reportData.totalRevenue) }}
                </h4>
                <span class="text-sm font-medium">Total Revenue</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Status Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Booking Status Distribution
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="bookingStatusChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Booking Trend Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Booking Trends
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="bookingTrendChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Booking Status Table -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Booking Status Details
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Count
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Percentage
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Avg. Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(status, index) in reportData.statusDetails" :key="index">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(status.status)">
                      {{ capitalizeFirstLetter(status.status) }}
                    </span>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ status.count }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ status.percentage }}%</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(status.revenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ status.averageDuration }} days</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="mt-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Recent Bookings
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    ID
                  </th>
                  <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Guest
                  </th>
                  <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Villa
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Check-in
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Check-out
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in reportData.recentBookings" :key="booking.id">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <router-link :to="`/bookings/${booking.id}`" class="text-primary hover:underline">
                      #{{ booking.id }}
                    </router-link>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ booking.guest_name }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <router-link :to="`/villas/${booking.villa_id}`" class="text-primary hover:underline">
                      {{ booking.villa_name }}
                    </router-link>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ formatDate(booking.check_in) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ formatDate(booking.check_out) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(booking.status)">
                      {{ capitalizeFirstLetter(booking.status) }}
                    </span>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(booking.total_amount) }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue';
import { reportService } from '../../services';
import ApexCharts from 'apexcharts';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      timeRange: 'month',
      startDate: '',
      endDate: '',
      reportData: {
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        statusDistribution: [],
        bookingTrends: [],
        statusDetails: [],
        recentBookings: []
      },
      bookingStatusChart: null,
      bookingTrendChart: null
    };
  },
  async created() {
    this.setDefaultDateRange();
    await this.generateReport();
  },
  methods: {
    setDefaultDateRange() {
      const now = new Date();
      const endDate = new Date(now);
      let startDate;

      switch (this.timeRange) {
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
      }

      this.startDate = this.formatDateForInput(startDate);
      this.endDate = this.formatDateForInput(endDate);
    },
    formatDateForInput(date) {
      return date.toISOString().split('T')[0];
    },
    async generateReport() {
      try {
        this.loading = true;

        const params = {
          start_date: this.startDate,
          end_date: this.endDate
        };

        const reportData = await reportService.getBookingStatusReport(params);
        this.reportData = reportData;

        // Wait for DOM to update
        this.$nextTick(() => {
          this.renderBookingStatusChart();
          this.renderBookingTrendChart();
        });
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        this.loading = false;
      }
    },
    renderBookingStatusChart() {
      if (this.bookingStatusChart) {
        this.bookingStatusChart.destroy();
      }

      const statuses = this.reportData.statusDistribution.map(item => item.status);
      const counts = this.reportData.statusDistribution.map(item => item.count);

      const options = {
        chart: {
          type: 'pie',
          height: 350
        },
        colors: ['#3C50E0', '#10B981', '#F59E0B', '#EF4444'],
        labels: statuses.map(status => this.capitalizeFirstLetter(status)),
        series: counts,
        legend: {
          position: 'bottom'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        tooltip: {
          y: {
            formatter: function(val, { seriesIndex, w }) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              const percentage = ((val / total) * 100).toFixed(1);
              return `${val} (${percentage}%)`;
            }
          }
        }
      };

      this.bookingStatusChart = new ApexCharts(document.querySelector('#bookingStatusChart'), options);
      this.bookingStatusChart.render();
    },
    renderBookingTrendChart() {
      if (this.bookingTrendChart) {
        this.bookingTrendChart.destroy();
      }

      const dates = this.reportData.bookingTrends.map(item => item.date);
      const confirmedCounts = this.reportData.bookingTrends.map(item => item.confirmed);
      const pendingCounts = this.reportData.bookingTrends.map(item => item.pending);
      const cancelledCounts = this.reportData.bookingTrends.map(item => item.cancelled);

      const options = {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          }
        },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        series: [
          {
            name: 'Confirmed',
            data: confirmedCounts
          },
          {
            name: 'Pending',
            data: pendingCounts
          },
          {
            name: 'Cancelled',
            data: cancelledCounts
          }
        ],
        xaxis: {
          categories: dates,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: 'Number of Bookings'
          }
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: '#E2E8F0'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          }
        }
      };

      this.bookingTrendChart = new ApexCharts(document.querySelector('#bookingTrendChart'), options);
      this.bookingTrendChart.render();
    },
    formatPrice(price) {
      if (!price) return '0.00';

      return parseFloat(price).toFixed(2);
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
    capitalizeFirstLetter(string) {
      if (!string) return '';

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      const statusMap = {
        'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    calculatePercentage(value, total) {
      if (!total) return 0;

      return ((value / total) * 100).toFixed(1);
    },
    async exportReport() {
      try {
        const params = {
          start_date: this.startDate,
          end_date: this.endDate,
          format: 'pdf'
        };

        await reportService.exportBookingStatusReport(params);

        // Show success notification
        alert('Report exported successfully');
      } catch (error) {
        console.error('Error exporting report:', error);
        // Show error notification
        alert('Failed to export report');
      }
    }
  }
};
</script>
