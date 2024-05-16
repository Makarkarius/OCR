<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccountMultiple, mdiChartPie, mdiDomain, mdiFileCompare } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { datasetObject, randomChartColor } from '@/components/Charts/chart.config'
import { formatDate } from '@/misc'
import DoughnutChart from '@/components/Charts/DoughnutChart.vue'
import { userRoles } from '@/config'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const { users } = storeToRefs(mainStore)

const chartData = ref(null)
const doughnutChartData = ref(null)

const fillChartData = () => {
  chartData.value = modelsData.value
  doughnutChartData.value = documentsData.value
}

const models = computed(() => {
  return mainStore.models.filter((model) => {
    return model.userRole === userRoles.manager || model.userRole === userRoles.admin
  })
})

const modelsData = computed(() => {
  const labels = []
  const data = []

  let startDate
  let endDate = new Date()
  endDate.setDate(endDate.getDate() + 2)
  const modelsByDate = new Map()
  models.value.forEach((model) => {
    const creationDate = new Date(Date.parse(model.createdAt))
    const dateString = formatDate(creationDate)

    if (!startDate) {
      startDate = creationDate
    }
    if (creationDate.getTime() < startDate.getTime()) {
      startDate = creationDate
    }

    if (modelsByDate.has(dateString)) {
      modelsByDate.set(dateString, modelsByDate.get(dateString) + 1)
    } else {
      modelsByDate.set(dateString, 1)
    }
  })

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = formatDate(date)
    labels.push(dateString)

    let cnt = 0
    if (data.length > 0) {
      cnt += data[data.length - 1]
    }
    if (modelsByDate.has(dateString)) {
      cnt += modelsByDate.get(dateString)
    }
    data.push(cnt)
  }

  return {
    labels,
    datasets: [
      datasetObject('primary', data, 'Models')
    ]
  }
})

const documentsData = computed(() => {
  const labels = []
  const data = []
  const colors = []

  models.value.forEach((model, idx) => {
    labels.push(model.name)
    data.push(model.totalDocuments)
    colors.push(randomChartColor(idx))
  })

  return {
    labels,
    datasets: [
      {
        fill: false,
        borderColor: 'rgb(59 130 246',
        borderWidth: 2,
        data: data,
        backgroundColor: colors
      }
    ]
  }
})

const totalDocuments = computed(() => {
  let cnt = 0
  models.value.forEach((model) => {
    cnt += model.totalDocuments
  })
  return cnt
})

onMounted(async () => {
  try {
    await Promise.all([mainStore.fetchModels(), mainStore.fetchUsers()])
    fillChartData()
  } catch (err) {
    notificationsStore.renderError(err)
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>

      <div class='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-4'>
        <CardBoxWidget
          color='text-emerald-500'
          :icon='mdiFileCompare'
          :number='models.length'
          label='Total models'
        />
        <CardBoxWidget
          color='text-blue-500'
          :icon='mdiAccountMultiple'
          :number='users.length + 1'
          label='Colleagues'
        />
        <CardBoxWidget
          color='text-red-500'
          :icon='mdiDomain'
          :text='mainStore.user.company'
          label='Company'
        />
      </div>

      <SectionTitleLineWithButton :icon='mdiChartPie' title='Models' />
      <CardBox class='mb-4'>
        <div v-if='chartData'>
          <LineChart :data='chartData' class='h-96' />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon='mdiChartPie' title='Documents'>
        <h1 class='leading-tight text-xl'>
          Total: {{ totalDocuments }}
        </h1>
      </SectionTitleLineWithButton>
      <CardBox class='mb-4'>
        <div v-if='doughnutChartData'>
          <DoughnutChart :data='doughnutChartData' class='h-96' />
        </div>
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
