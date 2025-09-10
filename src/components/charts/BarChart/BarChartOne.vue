<template>
  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
      <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Props definition
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// Fallback data
const fallbackData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112]
}

// Computed property for series data - reactive to prop changes
const series = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return [{
      name: 'Revenue',
      data: fallbackData.data,
    }]
  }

  return [{
    name: 'Revenue',
    data: props.data,
  }]
})

// Computed property for categories - reactive to prop changes
const categories = computed(() => {
  return fallbackData.labels
})

// Chart options - using computed property to make it reactive
const chartOptions = computed(() => ({
  colors: ['#465fff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '90%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: categories.value,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return '$' + val.toString()
      },
    },
  },
}))
</script>
