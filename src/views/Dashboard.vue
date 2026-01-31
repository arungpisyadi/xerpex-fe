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
        <div
          class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
            >
              <UserCircleIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Customers</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ customerCount }}
              </h4>
              <span
                :class="[
                  'text-sm font-medium',
                  customerGrowth >= 0 ? 'text-meta-3' : 'text-meta-5',
                ]"
              >
                {{ customerGrowth >= 0 ? '+' : '' }}{{ customerGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div
          class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
            >
              <BoxIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Bookings</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ bookingsCount }}
              </h4>
              <span
                :class="[
                  'text-sm font-medium',
                  bookingsGrowth >= 0 ? 'text-meta-3' : 'text-meta-5',
                ]"
              >
                {{ bookingsGrowth >= 0 ? '+' : '' }}{{ bookingsGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div
          class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
            >
              <SurveyIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Surveys</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ surveysCount }}
              </h4>
              <span
                :class="['text-sm font-medium', surveysGrowth >= 0 ? 'text-meta-3' : 'text-meta-5']"
              >
                {{ surveysGrowth >= 0 ? '+' : '' }}{{ surveysGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-3">
        <div
          class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
            >
              <DocsIcon class="fill-primary dark:fill-white w-6 h-6" />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Quotations</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                {{ quotesCount }}
              </h4>
              <span
                :class="['text-sm font-medium', quotesGrowth >= 0 ? 'text-meta-3' : 'text-meta-5']"
              >
                {{ quotesGrowth >= 0 ? '+' : '' }}{{ quotesGrowth }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Revenue Bar Chart -->
      <!-- <div class="col-span-12 xl:col-span-4">
        <div
          class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">Monthly Revenue</h4>
              </div>
            </div>
            <div class="flex">
              <button class="text-gray-500">
                <HorizontalDots class="fill-current" />
              </button>
            </div>
          </div>

          <div>
            <div id="monthlyRevenueChart" class="mx-auto flex justify-center">
              <bar-chart-one :data="monthlyRevenueData" />
            </div>
          </div>
        </div>
      </div> -->

      <!-- This Month Target Chart -->
      <div class="col-span-12 xl:col-span-6">
        <div
          class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-3">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">This Month Target</h4>
              </div>
            </div>
            <div class="flex">
              <button class="text-gray-500">
                <HorizontalDots class="fill-current" />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-5">Target For {{ getCurrentMonthName() }} {{ new Date().getFullYear() }}</p>

          <div>
            <div id="monthlyTargetChart" class="mx-auto flex justify-center">
              <radial-chart-one
                :percentage="currentMonthPerformance?.performance_percentage || 0"
                :growth="currentMonthPerformance?.growth_percentage || 0"
                :earnings="currentMonthPerformance?.current_revenue || 0"
              />
            </div>
          </div>

          <!-- <div class="text-center mt-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              You earn {{ formatCurrency(currentMonthPerformance?.current_revenue || 0) }} today, it's {{ (currentMonthPerformance?.growth || 0) > 0 ? 'higher' : 'lower' }} than last month.
            </p>
          </div> -->

          <div class="flex flex-col gap-4 mt-6">
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">This Month Target</p>
              <p class="text-base font-semibold">
                {{ formatNumber(currentMonthPerformance?.target_amount || 0) }}
              </p>
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">This Month Revenue</p>
              <p class="text-base font-semibold">
                {{ formatNumber(currentMonthPerformance?.current_revenue || 0) }}
              </p>
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">Today's Revenue</p>
              <p class="text-base font-semibold">
                {{ formatNumber(currentMonthPerformance?.today_revenue || 0) }}
              </p>
            </div>
          </div>

          <div id="revenues_per_sales" class="flex flex-col gap-4 mt-6">
            <!-- Monthly Revenue Per Sales Table -->
            <p class="text-base text-center text-gray-700 mb-1">Revenues Per Sales</p>
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="max-w-full overflow-x-auto custom-scrollbar">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="px-5 py-3 text-left w-1/3 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Sales Name</p>
                      </th>
                      <th class="px-5 py-3 text-right w-1/3 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Revenues</p>
                      </th>
                      <th class="px-5 py-3 text-right w-1/3 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Target</p>
                      </th>
                      <!-- <th class="px-5 py-3 text-right w-1/4 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Percentage</p>
                      </th> -->
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                      v-for="(sales, index) in monthlyRevenuePerSalesData?.sales_performance || []"
                      :key="index"
                      class="border-t border-gray-100 dark:border-gray-800"
                    >
                      <td class="px-5 py-4 sm:px-6">
                        <p class="text-gray-800 text-[10px] dark:text-white/90 font-medium">
                          {{ sales.sales_person_name }}<br>
                          <span :class="[
                            'text-[9px] font-medium',
                            getPercentage(sales.revenues, sales.target) >= 100 ? 'text-green-500' : 'text-red-500'
                          ]">
                            ({{ getPercentage(sales.revenues, sales.target) }}%)
                          </span>
                        </p>
                      </td>
                      <td class="px-5 py-4 sm:px-6 text-right">
                        <p class="text-gray-500 text-[10px] dark:text-gray-400">
                          {{ formatCurrency(sales.revenues) }}
                        </p>
                      </td>
                      <td class="px-5 py-4 sm:px-6 text-right">
                        <p class="text-gray-500 text-[10px] dark:text-gray-400">
                          {{ formatCurrency(sales.target) }}
                        </p>
                      </td>
                      <!-- <td class="px-5 py-4 sm:px-6 text-right">
                        <p
                          :class="[
                            'text-[9px] font-medium',
                            getPercentage(sales.revenues, sales.target) >= 100 ? 'text-meta-3' : 'text-meta-5'
                          ]"
                        >
                          {{ getPercentage(sales.revenues, sales.target) }}%
                        </p>
                      </td> -->
                    </tr>
                    <tr v-if="!monthlyRevenuePerSalesData?.sales_performance?.length" class="border-t border-gray-100 dark:border-gray-800">
                      <td colspan="4" class="px-5 py-4 sm:px-6 text-center text-gray-500">
                        No sales performance data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Yearly Target Chart -->
      <div class="col-span-12 xl:col-span-6">
        <div
          class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-3">
            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
              <div class="flex min-w-47.5">
                <h4 class="text-xl font-semibold text-black dark:text-white">Yearly Target</h4>
              </div>
            </div>
            <div class="flex">
              <button class="text-gray-500">
                <HorizontalDots class="fill-current" />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-5">Target tahunan sales</p>

          <div>
            <div id="yearlyTargetChart" class="mx-auto flex justify-center">
              <radial-chart-one
                :percentage="currentYearPerformance?.performance_percentage || 0"
                :growth="currentYearPerformance?.growth || 0"
                :earnings="currentYearPerformance?.current_revenue || 0"
              />
            </div>
          </div>

          <!-- <div class="text-center mt-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              You earn {{ formatCurrency(currentYearPerformance?.current_achievement || 0) }} this year, it's {{ (currentYearPerformance?.growth || 0) > 0 ? 'higher' : 'lower' }} than last year.
            </p>
          </div> -->

          <div class="flex flex-col gap-4 mt-6">
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">Target</p>
              <p class="text-base font-semibold">
                {{ formatNumber(currentYearPerformance?.target_amount || 0) }}
              </p>
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">Revenue</p>
              <p class="text-base font-semibold">
                {{ formatNumber(currentYearPerformance?.current_revenue || 0) }}
              </p>
            </div>
            <div class="text-left">
              <!-- <p class="text-xs text-gray-500 mb-1">Today</p> -->
              <p class="text-base font-semibold">
                <!-- {{ currentYearPerformance?.today_sales || 0 }} -->
                  &nbsp;
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Chart -->
      <!-- <div class="col-span-12">
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
      </div> -->

      <!-- Booking Calendar -->
      <div class="col-span-12">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <BookingCalendar
            :auto-fetch="true"
            :full-width="true"
            @booking-clicked="handleBookingClick"
          />
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
// import BarChartOne from '../components/charts/BarChart/BarChartOne.vue'
// import LineChartOne from '../components/charts/LineChart/LineChartOne.vue'
import RadialChartOne from '../components/charts/RadialChart/RadialChartOne.vue'
import BookingCalendar from '@/components/calendar/BookingCalendar.vue'
import { TargetsService } from '../services/targets.service'
import { KpiService } from '../services/kpi.service'
import { formatNumber, formatCurrency } from '../utils/number-formatter'
import {
  UserCircleIcon,
  BoxIcon,
  CalenderIcon as CalendarIcon,
  DocsIcon,
  SurveyIcon,
  HorizontalDots,
} from '../icons'

const router = useRouter()

// Reactive data for API responses
// const targetsOverview = ref(null);
const userPerformances = ref(null)
const companyPerformance = ref(null)
const loading = ref(true)
const error = ref(null)

// New reactive variables for dashboard data
const monthlyRevenueData = ref({
  labels: [],
  datasets: [],
})
const currentMonthPerformance = ref(null)
const currentYearPerformance = ref(null)
const monthlyRevenuePerSalesData = ref(null)

// Indonesian month names mapping
const indonesianMonths = {
  1: 'Januari',
  2: 'Februari',
  3: 'Maret',
  4: 'April',
  5: 'Mei',
  6: 'Juni',
  7: 'Juli',
  8: 'Agustus',
  9: 'September',
  10: 'Oktober',
  11: 'November',
  12: 'Desember',
}

// Current month and year
const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()

// Current month name in Indonesian
const getCurrentMonthName = () => {
  return indonesianMonths[currentMonth]
}

// Calculate percentage of revenue against target
const getPercentage = (revenue, target) => {
  if (!target || target === 0) return '0.00'
  const percentage = (revenue / target) * 100
  return percentage.toFixed(2)
}

// Metrics derived from API data
const customerCount = ref(0)
const customerGrowth = ref(0)
const bookingsCount = ref(0)
const bookingsGrowth = ref(0)
const surveysCount = ref(0)
const surveysGrowth = ref(0)
const quotesCount = ref(0)
const quotesGrowth = ref(0)

// Monthly Sales Chart data (from userPerformances)
const monthlySalesData = ref({
  labels: [],
  datasets: [],
})

// Handle booking click navigation
const handleBookingClick = (bookingId) => {
  router.push(`/bookings/${bookingId}`)
}

// Fetch dashboard data
onMounted(async () => {
  try {
    // Fetch KPI data using the new KPI service with proper authorization
    const [
      customersData,
      bookingsData,
      surveysData,
      quotesData,
      monthlyRevenue,
      currentMonthPerf,
      currentYearPerf,
      monthlyRevenuePerSales,
    ] = await Promise.all([
      KpiService.getCustomersKpi(),
      KpiService.getBookingsKpi(),
      KpiService.getSurveysKpi(),
      KpiService.getQuotesKpi(),
      KpiService.getMonthlyRevenue(currentYear),
      KpiService.getCurrentMonthPerformance(),
      KpiService.getCurrentYearPerformance(),
      KpiService.getMonthlyRevenuePerSales(currentMonth, currentYear),
    ])

    monthlyRevenueData.value = monthlyRevenue.monthly_data
    currentMonthPerformance.value = currentMonthPerf
    currentYearPerformance.value = currentYearPerf
    monthlyRevenuePerSalesData.value = monthlyRevenuePerSales

    // Update KPI metrics from new endpoints
    // console.log(customersData);
    customerCount.value = customersData.previous_month_total || 0
    customerGrowth.value = customersData.growth_percentage || 0
    bookingsCount.value = bookingsData.previous_month_total || 0
    bookingsGrowth.value = bookingsData.growth_percentage || 0
    surveysCount.value = surveysData.previous_month_total || 0
    surveysGrowth.value = surveysData.growth_percentage || 0
    quotesCount.value = quotesData.previous_month_total || 0
    quotesGrowth.value = quotesData.growth_percentage || 0

    loading.value = false
  } catch (err) {
    error.value = err.message || 'Failed to load dashboard data'
    loading.value = false
  }
})
</script>
