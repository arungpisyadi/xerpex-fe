<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Reports', link: '/reports' }, { text: 'Villa Occupancy' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Villa Occupancy Report
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <select
              v-model="selectedVilla"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Villas</option>
              <option v-for="villa in villas" :key="villa.id" :value="villa.id">
                {{ villa.name }}
              </option>
            </select>
          </div>
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
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="generateReport">
            Generate Report
          </button>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" @click="exportReport">
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

          <!-- Occupancy Rate -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2L19.8 17H2.2L11 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.occupancyRate }}%
                </h4>
                <span class="text-sm font-medium">Occupancy Rate</span>
              </div>
            </div>
          </div>

          <!-- Average Stay Duration -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 5V11L15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.averageStayDuration }} days
                </h4>
                <span class="text-sm font-medium">Average Stay</span>
              </div>
            </div>
          </div>

          <!-- Revenue -->
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

        <!-- Occupancy Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Occupancy by Date
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="occupancyChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Villa Comparison -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Villa Comparison
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="villaComparisonChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Villa Occupancy Table -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Villa Occupancy Details
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Villa Name
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Total Bookings
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Occupancy Rate
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Avg. Stay (days)
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="villa in reportData.villaDetails" :key="villa.id">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 class="font-medium text-black dark:text-white">{{ villa.name }}</h5>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.bookings }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.occupancyRate }}%</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.averageStay }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(villa.revenue) }}</p>
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
import { reportService, villaService } from '../../services';
import ApexCharts from 'apexcharts';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      selectedVilla: '',
      timeRange: 'month',
      startDate: '',
      endDate: '',
      villas: [],
      reportData: {
        totalBookings: 0,
        occupancyRate: 0,
        averageStayDuration: 0,
        totalRevenue: 0,
        occupancyByDate: [],
        villaComparison: [],
        villaDetails: []
      },
      occupancyChart: null,
      villaComparisonChart: null
    };
  },
  async created() {
    await this.fetchVillas();
    this.setDefaultDateRange();
    await this.generateReport();
  },
  methods: {
    async fetchVillas() {
      try {
        const response = await villaService.getVillas({ limit: 100 });
        this.villas = response.items || [];
      } catch (error) {
        console.error('Error fetching villas:', error);
      }
    },
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
          villa_id: this.selectedVilla || undefined,
          start_date: this.startDate,
          end_date: this.endDate
        };

        const reportData = await reportService.getVillaOccupancyReport(params);
        this.reportData = reportData;

        // Wait for DOM to update
        this.$nextTick(() => {
          this.renderOccupancyChart();
          this.renderVillaComparisonChart();
        });
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        this.loading = false;
      }
    },
    renderOccupancyChart() {
      if (this.occupancyChart) {
        this.occupancyChart.destroy();
      }

      const dates = this.reportData.occupancyByDate.map(item => item.date);
      const occupancyRates = this.reportData.occupancyByDate.map(item => item.occupancyRate);

      const options = {
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          }
        },
        colors: ['#3C50E0'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        series: [
          {
            name: 'Occupancy Rate',
            data: occupancyRates
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
          min: 0,
          max: 100,
          title: {
            text: 'Occupancy Rate (%)'
          }
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: '#E2E8F0'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100]
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          }
        }
      };

      this.occupancyChart = new ApexCharts(document.querySelector('#occupancyChart'), options);
      this.occupancyChart.render();
    },
    renderVillaComparisonChart() {
      if (this.villaComparisonChart) {
        this.villaComparisonChart.destroy();
      }

      const villaNames = this.reportData.villaDetails.map(villa => villa.name);
      const occupancyRates = this.reportData.villaDetails.map(villa => villa.occupancyRate);
      const revenues = this.reportData.villaDetails.map(villa => villa.revenue);

      const options = {
        chart: {
          height: 350,
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        colors: ['#3C50E0', '#10B981'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        series: [
          {
            name: 'Occupancy Rate',
            data: occupancyRates
          },
          {
            name: 'Revenue',
            data: revenues
          }
        ],
        xaxis: {
          categories: villaNames
        },
        yaxis: [
          {
            title: {
              text: 'Occupancy Rate (%)'
            },
            min: 0,
            max: 100
          },
          {
            opposite: true,
            title: {
              text: 'Revenue ($)'
            }
          }
        ],
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val, { seriesIndex }) {
              return seriesIndex === 0 ? val + '%' : '$' + val.toFixed(2);
            }
          }
        }
      };

      this.villaComparisonChart = new ApexCharts(document.querySelector('#villaComparisonChart'), options);
      this.villaComparisonChart.render();
    },
    formatPrice(price) {
      if (!price) return '0.00';

      return parseFloat(price).toFixed(2);
    },
    async exportReport() {
      try {
        const params = {
          villa_id: this.selectedVilla || undefined,
          start_date: this.startDate,
          end_date: this.endDate,
          format: 'pdf'
        };

        await reportService.exportVillaOccupancyReport(params);

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
