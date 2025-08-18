<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Reports', link: '/reports' }, { text: 'Top Villas' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Top Villas Report
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
          <div>
            <select
              v-model="sortBy"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="revenue">Revenue</option>
              <option value="bookings">Bookings</option>
              <option value="occupancy">Occupancy Rate</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="generateReport">
            Generate Report
          </button>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" @click="exportReport">
            Export
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <template v-else>
        <!-- Top Villas Cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          <!-- Top Revenue Villa -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.topRevenueVilla?.name || 'N/A' }}
                </h4>
                <span class="text-sm font-medium">Top Revenue Villa</span>
              </div>
              <span class="flex items-center gap-1 text-sm font-medium text-meta-3">
                ${{ formatPrice(reportData.topRevenueVilla?.revenue || 0) }}
              </span>
            </div>
          </div>

          <!-- Top Bookings Villa -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.topBookingsVilla?.name || 'N/A' }}
                </h4>
                <span class="text-sm font-medium">Top Bookings Villa</span>
              </div>
              <span class="flex items-center gap-1 text-sm font-medium text-meta-3">
                {{ reportData.topBookingsVilla?.bookings || 0 }} bookings
              </span>
            </div>
          </div>

          <!-- Top Occupancy Villa -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.topOccupancyVilla?.name || 'N/A' }}
                </h4>
                <span class="text-sm font-medium">Top Occupancy Villa</span>
              </div>
              <span class="flex items-center gap-1 text-sm font-medium text-meta-3">
                {{ reportData.topOccupancyVilla?.occupancyRate || 0 }}%
              </span>
            </div>
          </div>

          <!-- Top Rated Villa -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.topRatedVilla?.name || 'N/A' }}
                </h4>
                <span class="text-sm font-medium">Top Rated Villa</span>
              </div>
              <span class="flex items-center gap-1 text-sm font-medium text-meta-3">
                {{ reportData.topRatedVilla?.rating || 0 }}/5
              </span>
            </div>
          </div>
        </div>

        <!-- Top Villas Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Top Villas by {{ getSortByLabel() }}
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="topVillasChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Top Villas Table -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Top Villas Details
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[40px] py-4 px-4 font-medium text-black dark:text-white">
                    Rank
                  </th>
                  <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Villa
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Bookings
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Occupancy Rate
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Avg. Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(villa, index) in reportData.topVillas" :key="villa.id">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ index + 1 }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <router-link :to="`/villas/${villa.id}`" class="text-primary hover:underline">
                      {{ villa.name }}
                    </router-link>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(villa.revenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.bookings }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.occupancyRate }}%</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.rating }}/5</p>
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
      sortBy: 'revenue',
      reportData: {
        topRevenueVilla: null,
        topBookingsVilla: null,
        topOccupancyVilla: null,
        topRatedVilla: null,
        topVillas: []
      },
      topVillasChart: null
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
    getSortByLabel() {
      const labels = {
        'revenue': 'Revenue',
        'bookings': 'Bookings',
        'occupancy': 'Occupancy Rate',
        'rating': 'Guest Rating'
      };

      return labels[this.sortBy] || 'Revenue';
    },
    async generateReport() {
      try {
        this.loading = true;

        const params = {
          start_date: this.startDate,
          end_date: this.endDate,
          sort_by: this.sortBy
        };

        const reportData = await reportService.getTopVillasReport(params);
        this.reportData = reportData;

        // Wait for DOM to update
        this.$nextTick(() => {
          this.renderTopVillasChart();
        });
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        this.loading = false;
      }
    },
    renderTopVillasChart() {
      if (this.topVillasChart) {
        this.topVillasChart.destroy();
      }

      const villas = this.reportData.topVillas.slice(0, 10).map(villa => villa.name);
      let values = [];

      switch (this.sortBy) {
        case 'revenue':
          values = this.reportData.topVillas.slice(0, 10).map(villa => villa.revenue);
          break;
        case 'bookings':
          values = this.reportData.topVillas.slice(0, 10).map(villa => villa.bookings);
          break;
        case 'occupancy':
          values = this.reportData.topVillas.slice(0, 10).map(villa => villa.occupancyRate);
          break;
        case 'rating':
          values = this.reportData.topVillas.slice(0, 10).map(villa => villa.rating);
          break;
        default:
          values = this.reportData.topVillas.slice(0, 10).map(villa => villa.revenue);
      }

      const options = {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#3C50E0'],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '70%',
            distributed: true
          }
        },
        dataLabels: {
          enabled: true
        },
        series: [{
          name: this.getSortByLabel(),
          data: values
        }],
        xaxis: {
          categories: villas
        },
        yaxis: {
          title: {
            text: 'Villas'
          }
        }
      };

      this.topVillasChart = new ApexCharts(document.querySelector('#topVillasChart'), options);
      this.topVillasChart.render();
    },
    formatPrice(price) {
      if (!price) return '0.00';
      return parseFloat(price).toFixed(2);
    },
    async exportReport() {
      try {
        const params = {
          start_date: this.startDate,
          end_date: this.endDate,
          format: 'pdf'
        };

        await reportService.exportTopVillasReport(params);
        alert('Report exported successfully');
      } catch (error) {
        console.error('Error exporting report:', error);
        alert('Failed to export report');
      }
    }
  }
};
</script>
