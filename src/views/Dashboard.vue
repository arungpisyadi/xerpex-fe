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
            <span class="text-sm text-gray-500 dark:text-gray-400">Customers</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ customerCount }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                customerGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ customerGrowth >= 0 ? '+' : '' }}{{ customerGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <BoxIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ orderCount }}
              </h4>
              <span :class="[
                'text-sm font-medium',
                orderGrowth >= 0 ? 'text-meta-3' : 'text-meta-5'
              ]">
                {{ orderGrowth >= 0 ? '+' : '' }}{{ orderGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Sales Chart -->
      <div class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">
                  Monthly Sales
                </h4>
              </div>
            </div>
            <div class="flex">
              <button class="text-gray-500">
                <HorizontalDots class="fill-current" />
              </button>
            </div>
          </div>

          <div>
            <div id="monthlySalesChart" class="mx-auto flex justify-center">
              <!-- Chart will be rendered here -->
              <bar-chart-one />
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Target Chart -->
      <div class="col-span-12 xl:col-span-4">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-3">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">
                  Monthly Target
                </h4>
              </div>
            </div>
            <div class="flex">
              <button class="text-gray-500">
                <HorizontalDots class="fill-current" />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-5">Target you've set for each month</p>

          <div>
            <div id="monthlyTargetChart" class="mx-auto flex justify-center">
              <radial-chart-one :percentage="75.55" :growth="10" :earnings="3287" />
            </div>
          </div>

          <div class="text-center mt-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              You earn $3287 today, it's higher than last month.
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Keep up your good work!
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-6">
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Target</p>
              <p class="text-base font-semibold flex items-center justify-center">
                $20K
                <span class="text-meta-5 ml-1">↓</span>
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Revenue</p>
              <p class="text-base font-semibold flex items-center justify-center">
                $20K
                <span class="text-meta-3 ml-1">↑</span>
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Today</p>
              <p class="text-base font-semibold flex items-center justify-center">
                $20K
                <span class="text-meta-3 ml-1">↑</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Chart -->
      <div class="col-span-12">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">
                  Statistics
                </h4>
              </div>
            </div>

            <div class="flex gap-3 items-center">
              <div class="flex gap-2">
                <button class="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600">Overview</button>
                <button class="px-3 py-1 text-xs font-medium rounded-md">Sales</button>
                <button class="px-3 py-1 text-xs font-medium rounded-md">Revenue</button>
              </div>

              <div class="flex items-center gap-2 border border-stroke rounded-md px-3 py-1">
                <span class="text-xs font-medium">Jul 20, 2025 - Jul 26, 2025</span>
                <CalendarIcon class="w-4 h-4" />
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-5">Target you've set for each month</p>

          <div>
            <div id="statisticsChart" class="mx-auto flex justify-center">
              <line-chart-one />
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/layout/AdminLayout.vue';
import BarChartOne from '../components/charts/BarChart/BarChartOne.vue';
import LineChartOne from '../components/charts/LineChart/LineChartOne.vue';
import RadialChartOne from '../components/charts/RadialChart/RadialChartOne.vue';
import {
  UserCircleIcon,
  BoxIcon,
  CalenderIcon as CalendarIcon,
  DocsIcon,
  HorizontalDots
} from '../icons';
import { reportService } from '../services';

// Metrics
const customerCount = ref(3782);
const customerGrowth = ref(11.01);
const orderCount = ref(5359);
const orderGrowth = ref(-9.05);

// Monthly Sales Chart data
const monthlySalesData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: '#3C50E0',
      borderColor: '#3C50E0',
      data: [180, 390, 210, 350, 190, 200, 300, 120, 200, 390, 280, 120],
    },
  ],
});

// Monthly Target data
const monthlyTargetPercentage = ref(75.55);
const monthlyTargetGrowth = ref(10);
const monthlyEarnings = ref(3287);

// Fetch dashboard data
onMounted(async () => {
  try {
    // Fetch dashboard data
    const dashboardData = await reportService.getDashboardSummary();

    // Update with real data if available
    if (dashboardData) {
      customerCount.value = dashboardData.customer_count || customerCount.value;
      customerGrowth.value = dashboardData.customer_growth || customerGrowth.value;
      orderCount.value = dashboardData.order_count || orderCount.value;
      orderGrowth.value = dashboardData.order_growth || orderGrowth.value;

      // Update monthly sales chart if data available
      if (dashboardData.monthly_sales) {
        monthlySalesData.value.datasets[0].data = dashboardData.monthly_sales;
      }

      // Update monthly target if data available
      if (dashboardData.target_percentage) {
        monthlyTargetPercentage.value = dashboardData.target_percentage;
      }
      if (dashboardData.target_growth) {
        monthlyTargetGrowth.value = dashboardData.target_growth;
      }
      if (dashboardData.daily_earnings) {
        monthlyEarnings.value = dashboardData.daily_earnings;
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Using default values already set
  }
});
</script>
