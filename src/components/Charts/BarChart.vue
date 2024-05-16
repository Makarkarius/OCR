<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, PointElement, Tooltip } from 'chart.js'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const root = ref(null)

let chart

Chart.register(BarElement, PointElement, BarController, LinearScale, CategoryScale, Tooltip, Legend)

onMounted(() => {
  chart = new Chart(root.value, {
    type: 'bar',
    data: props.data,
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: true
        },
        x: {
          display: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
})

const chartData = computed(() => props.data)

watch(chartData, (data) => {
  if (chart) {
    chart.data = data
    chart.update()
  }
})
</script>

<template>
  <canvas ref='root' />
</template>
