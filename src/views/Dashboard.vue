<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Top metrics cards -->
      <div class="col-span-12 xl:col-span-3">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <UserCircleIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Users</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ userCount }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                userGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ userGrowth >= 0 ? '+' : '' }}{{ userGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <HomeIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Villas</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ villaCount }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                villaGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ villaGrowth >= 0 ? '+' : '' }}{{ villaGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <CalenderIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Bookings</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ bookingCount }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                bookingGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ bookingGrowth >= 0 ? '+' : '' }}{{ bookingGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <DocsIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                ${{ revenue.toLocaleString() }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                revenueGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Revenue Chart -->
      <div class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
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
      </div>

      <!-- Booking Status Chart -->
      <div class="col-span-12 xl:col-span-4">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
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
              <!-- We'll need to create a pie chart component -->
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="col-span-12">
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

            <div v-for="booking in recentBookings" :key="booking.id" class="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
              <div class="flex items-center gap-3 p-2.5 xl:p-5">
                <p class="text-black dark:text-white">{{ booking.id }}</p>
              </div>

              <div class="flex items-center justify-center p-2.5 xl:p-5">
                <p class="text-black dark:text-white">{{ booking.customer }}</p>
              </div>

              <div class="flex items-center justify-center p-2.5 xl:p-5">
                <p class="text-black dark:text-white">{{ booking.villa }}</p>
              </div>

              <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p :class="[
                  'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium',
                  booking.status === 'Confirmed' ? 'bg-success text-success' :
                  booking.status === 'Pending' ? 'bg-warning text-warning' :
                  'bg-danger text-danger'
                ]">
                  {{ booking.status }}
                </p>
              </div>

              <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p class="text-black dark:text-white">${{ booking.total.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import BarChartOne from '../components/charts/BarChart/BarChartOne.vue';
import {
  UserCircleIcon,
  HomeIcon,
  CalenderIcon,
  DocsIcon
} from '../icons';
import { reportService } from '../services';

export default {
  components: {
    AdminLayout,
    BarChartOne,
    UserCircleIcon,
    HomeIcon,
    CalenderIcon,
    DocsIcon
  },
  data() {
    return {
      // Metrics
      userCount: 0,
      userGrowth: 0,
      villaCount: 0,
      villaGrowth: 0,
      bookingCount: 0,
      bookingGrowth: 0,
      revenue: 0,
      revenueGrowth: 0,

      // Monthly Revenue Chart
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

      // Recent Bookings
      recentBookings: []
    };
  },
  async created() {
    try {
      // Fetch dashboard data
      const dashboardData = await reportService.getDashboardSummary();

      // Update metrics
      this.userCount = dashboardData.user_count || 0;
      this.userGrowth = dashboardData.user_growth || 0;
      this.villaCount = dashboardData.villa_count || 0;
      this.villaGrowth = dashboardData.villa_growth || 0;
      this.bookingCount = dashboardData.booking_count || 0;
      this.bookingGrowth = dashboardData.booking_growth || 0;
      this.revenue = dashboardData.total_revenue || 0;
      this.revenueGrowth = dashboardData.revenue_growth || 0;

      // Update monthly revenue chart
      if (dashboardData.monthly_revenue) {
        this.monthlyRevenueData.datasets[0].data = dashboardData.monthly_revenue;
      }

      // Update recent bookings
      this.recentBookings = dashboardData.recent_bookings || [];
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set some dummy data for demonstration
      this.setDummyData();
    }
  },
  methods: {
    setDummyData() {
      // Dummy metrics
      this.userCount = 125;
      this.userGrowth = 11.01;
      this.villaCount = 48;
      this.villaGrowth = 8.5;
      this.bookingCount = 312;
      this.bookingGrowth = -3.2;
      this.revenue = 156789;
      this.revenueGrowth = 15.3;

      // Dummy monthly revenue
      this.monthlyRevenueData.datasets[0].data = [
        12500, 18700, 14300, 21000, 15600, 16800, 23400, 11200, 17800, 25600, 19300, 14200
      ];

      // Dummy recent bookings
      this.recentBookings = [
        { id: 'B-1001', customer: 'John Doe', villa: 'Luxury Villa A', status: 'Confirmed', total: 3250 },
        { id: 'B-1002', customer: 'Jane Smith', villa: 'Beachfront Villa', status: 'Pending', total: 4800 },
        { id: 'B-1003', customer: 'Robert Johnson', villa: 'Garden Villa', status: 'Confirmed', total: 2100 },
        { id: 'B-1004', customer: 'Emily Davis', villa: 'Luxury Villa B', status: 'Cancelled', total: 3750 },
        { id: 'B-1005', customer: 'Michael Brown', villa: 'Poolside Villa', status: 'Confirmed', total: 2950 }
      ];
    }
  }
};
</script>
