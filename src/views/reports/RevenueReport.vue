<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Reports', link: '/reports' }, { text: 'Revenue' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Revenue Report
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

          <!-- Average Revenue per Booking -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10H1M16 2V6M6 2V6M3 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H3C1.89543 4 1 4.89543 1 6V20C1 21.1046 1.89543 22 3 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  ${{ formatPrice(reportData.averageRevenuePerBooking) }}
                </h4>
                <span class="text-sm font-medium">Avg. Revenue per Booking</span>
              </div>
            </div>
          </div>

          <!-- Total Bookings -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

          <!-- Revenue Growth -->
          <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg class="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L8 14L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 6H12V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mt-4 flex items-end justify-between">
              <div>
                <h4 class="text-title-md font-bold text-black dark:text-white">
                  {{ reportData.revenueGrowth > 0 ? '+' : '' }}{{ reportData.revenueGrowth }}%
                </h4>
                <span class="text-sm font-medium">Revenue Growth</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Trend Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Revenue Trends
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="revenueTrendChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Revenue by Villa Chart -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Revenue by Villa
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="revenueByVillaChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Revenue by Payment Method -->
        <div class="mb-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Revenue by Payment Method
              </h4>
            </div>
          </div>

          <div class="mb-2">
            <div id="revenueByPaymentMethodChart" class="h-[350px] w-full"></div>
          </div>
        </div>

        <!-- Revenue Details Table -->
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Revenue Details
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Villa
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Bookings
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Avg. Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Occupancy Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(villa, index) in reportData.revenueByVilla" :key="index">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <router-link :to="`/villas/${villa.id}`" class="text-primary hover:underline">
                      {{ villa.name }}
                    </router-link>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.bookings }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(villa.revenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(villa.averageRevenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ villa.occupancyRate }}%</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Monthly Revenue Table -->
        <div class="mt-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Monthly Revenue
          </h4>

          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Month
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Bookings
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Avg. Revenue
                  </th>
                  <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(month, index) in reportData.monthlyRevenue" :key="index">
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ month.month }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">{{ month.bookings }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(month.revenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p class="text-black dark:text-white">${{ formatPrice(month.averageRevenue) }}</p>
                  </td>
                  <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div class="flex items-center">
                      <span :class="month.growth > 0 ? 'text-meta-3' : 'text-meta-5'">
                        {{ month.growth > 0 ? '+' : '' }}{{ month.growth }}%
                      </span>
                      <span class="ml-1">
                        <svg v-if="month.growth > 0" class="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" fill="currentColor"/>
                        </svg>
                        <svg v-else-if="month.growth < 0" class="fill-meta-5" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.64284 3.41101L9.09102 6.76351L10 5.87976L5 1.01849L-8.98488e-07 5.87976L0.908973 6.76351L4.35716 3.41101L4.35716 11.0185L5.64284 11.0185L5.64284 3.41101Z" fill="currentColor"/>
                        </svg>
                      </span>
                    </div>
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
        totalRevenue: 0,
        averageRevenuePerBooking: 0,
        totalBookings: 0,
        revenueGrowth: 0,
        revenueTrend: [],
        revenueByVilla: [],
        revenueByPaymentMethod: [],
        monthlyRevenue: []
      },
      revenueTrendChart: null,
      revenueByVillaChart: null,
      revenueByPaymentMethodChart: null
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

        const reportData = await reportService.getRevenueReport(params);
        this.reportData = reportData;

        // Wait for DOM to update
        this.$nextTick(() => {
          this.renderRevenueTrendChart();
          this.renderRevenueByVillaChart();
          this.renderRevenueByPaymentMethodChart();
        });
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        this.loading = false;
      }
    },
    renderRevenueTrendChart() {
      if (this.revenueTrendChart) {
        this.revenueTrendChart.destroy();
      }

      const dates = this.reportData.revenueTrend.map(item => item.date);
      const revenues = this.reportData.revenueTrend.map(item => item.revenue);
      const bookings = this.reportData.revenueTrend.map(item => item.bookings);

      const options = {
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          }
        },
        colors: ['#3C50E0', '#80CAEE'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        series: [
          {
            name: 'Revenue',
            data: revenues
          },
          {
            name: 'Bookings',
            data: bookings
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
        yaxis: [
          {
            title: {
              text: 'Revenue ($)'
            },
            labels: {
              formatter: function(val) {
                return '$' + val.toFixed(2);
              }
            }
          },
          {
            opposite: true,
            title: {
              text: 'Bookings'
            }
          }
        ],
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

      this.revenueTrendChart = new ApexCharts(document.querySelector('#revenueTrendChart'), options);
      this.revenueTrendChart.render();
    },
    renderRevenueByVillaChart() {
      if (this.revenueByVillaChart) {
        this.revenueByVillaChart.destroy();
      }

      const villas = this.reportData.revenueByVilla.map(item => item.name);
      const revenues = this.reportData.revenueByVilla.map(item => item.revenue);

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
        series: [{
          name: 'Revenue',
          data: revenues
        }],
        xaxis: {
          categories: villas,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: 'Revenue ($)'
          },
          labels: {
            formatter: function(val) {
              return '$' + val.toFixed(2);
            }
          }
        },
        fill: {
          opacity: 1
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: '#E2E8F0'
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return '$' + val.toFixed(2);
            }
          }
        }
      };

      this.revenueByVillaChart = new ApexCharts(document.querySelector('#revenueByVillaChart'), options);
      this.revenueByVillaChart.render();
    },
    renderRevenueByPaymentMethodChart() {
      if (this.revenueByPaymentMethodChart) {
        this.revenueByPaymentMethodChart.destroy();
      }

      const methods = this.reportData.revenueByPaymentMethod.map(item => item.method);
      const revenues = this.reportData.revenueByPaymentMethod.map(item => item.revenue);

      const options = {
        chart: {
          type: 'pie',
          height: 350
        },
        colors: ['#3C50E0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        labels: methods,
        series: revenues,
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
            formatter: function(val) {
              return '$' + val.toFixed(2);
            }
          }
        }
      };

      this.revenueByPaymentMethodChart = new ApexCharts(document.querySelector('#revenueByPaymentMethodChart'), options);
      this.revenueByPaymentMethodChart.render();
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

        await reportService.exportRevenueReport(params);

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
