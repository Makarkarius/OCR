<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  ArcElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const root = ref(null)

let chart

Chart.register(ArcElement, PointElement, DoughnutController, LinearScale, CategoryScale, Tooltip, Legend)

onMounted(() => {
  chart = new Chart(root.value, {
    type: 'doughnut',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
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
