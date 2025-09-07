<template>
  <admin-layout>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span class="ml-2">Loading dashboard data...</span>
    </div>
    <div v-else-if="error" class="flex justify-center items-center h-64">
      <div class="text-red-500">{{ error }}</div>
    </div>
    <div v-else class="grid grid-cols-12 gap-4 md:gap-6">
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
              <bar-chart-one :data="monthlySalesData" />
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
              <radial-chart-one :percentage="monthlyTargetPercentage" :growth="monthlyTargetGrowth" :earnings="monthlyEarnings" />
            </div>
          </div>

          <div class="text-center mt-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              You earn ${{ monthlyEarnings }} today, it's {{ monthlyTargetGrowth >= 0 ? 'higher' : 'lower' }} than last month.
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Keep up your good work!
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-6">
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Target</p>
              <p class="text-base font-semibold flex items-center justify-center">
                ${{ targetsOverview?.ytd_metrics?.ytd_target || 0 }}
                <span :class="['ml-1', targetsOverview?.achievement_percentage >= 0 ? 'text-meta-3' : 'text-meta-5']">{{ targetsOverview?.achievement_percentage >= 0 ? '↑' : '↓' }}</span>
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Revenue</p>
              <p class="text-base font-semibold flex items-center justify-center">
                ${{ targetsOverview?.ytd_metrics?.ytd_achievement || 0 }}
                <span :class="['ml-1', targetsOverview?.ytd_metrics?.ytd_percentage >= 0 ? 'text-meta-3' : 'text-meta-5']">{{ targetsOverview?.ytd_metrics?.ytd_percentage >= 0 ? '↑' : '↓' }}</span>
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Today</p>
              <p class="text-base font-semibold flex items-center justify-center">
                ${{ targetsOverview?.current_month_achievement || 0 }}
                <span :class="['ml-1', targetsOverview?.achievement_percentage >= 0 ? 'text-meta-3' : 'text-meta-5']">{{ targetsOverview?.achievement_percentage >= 0 ? '↑' : '↓' }}</span>
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
              <line-chart-one :data="userPerformances?.chart_data" />
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
import { TargetsService } from '../services/targets.service';
import {
  UserCircleIcon,
  BoxIcon,
  CalenderIcon as CalendarIcon,
  DocsIcon,
  HorizontalDots
} from '../icons';

// Reactive data for API responses
const targetsOverview = ref(null);
const userPerformances = ref(null);
const companyPerformance = ref(null);
const loading = ref(true);
const error = ref(null);

// Metrics derived from API data
const customerCount = ref(0);
const customerGrowth = ref(0);
const orderCount = ref(0);
const orderGrowth = ref(0);

// Monthly Sales Chart data (from userPerformances)
const monthlySalesData = ref({
  labels: [],
  datasets: [],
});

// Monthly Target data (from companyPerformance and targetsOverview)
const monthlyTargetPercentage = ref(0);
const monthlyTargetGrowth = ref(0);
const monthlyEarnings = ref(0);

// Fetch dashboard data
onMounted(async () => {
  try {
    const currentYear = new Date().getFullYear();

    // Fetch data from APIs
    const [overview, performances, companyPerf] = await Promise.all([
      TargetsService.getTargetsOverview(),
      TargetsService.getUserPerformances(currentYear),
      TargetsService.getCompanyPerformance(currentYear)
    ]);

    targetsOverview.value = overview;
    userPerformances.value = performances;
    companyPerformance.value = companyPerf;

    // Update metrics
    customerCount.value = overview.active_users_count || 0;
    customerGrowth.value = overview.achievement_percentage || 0;
    orderCount.value = overview.current_month_achievement || 0;
    orderGrowth.value = overview.ytd_metrics?.ytd_percentage || 0;

    // Update chart data
    if (performances.chart_data) {
      monthlySalesData.value = performances.chart_data;
    }

    monthlyTargetPercentage.value = companyPerf.achievement_percentage || 0;
    monthlyTargetGrowth.value = overview.achievement_percentage || 0;
    monthlyEarnings.value = overview.current_month_achievement || 0;

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load dashboard data';
    loading.value = false;
  }
});
</script>
