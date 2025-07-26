<template>
  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div id="radialChartOne" class="min-w-full">
      <VueApexCharts type="radialBar" height="320" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  percentage: {
    type: Number,
    default: 75.55
  },
  growth: {
    type: Number,
    default: 10
  },
  earnings: {
    type: Number,
    default: 3287
  }
})

const series = ref([props.percentage])

const chartOptions = ref({
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'radialBar',
    offsetY: -20,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '70%',
        background: 'transparent',
      },
      track: {
        background: '#e7e7e7',
        strokeWidth: '97%',
        margin: 5, // margin is in pixels
        dropShadow: {
          enabled: false,
          top: 2,
          left: 0,
          color: '#999',
          opacity: 1,
          blur: 2
        }
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: '22px',
          fontWeight: 600,
          formatter: function (val) {
            return val + '%'
          }
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#ABE5A1'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: 'round'
  },
  colors: ['#465FFF'],
})
</script>
