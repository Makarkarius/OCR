<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  mdiCalendarText,
  mdiChartPie,
  mdiFileDocumentCheckOutline,
  mdiFileDocumentOutline
} from '@mdi/js'
import { datasetObject } from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { documentTypes } from '@/config'
import { formatDate, formatFullDate } from '@/misc'
import CardBoxEvent from '@/components/CardBoxEvent.vue'
import BarChart from '@/components/Charts/BarChart.vue'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const { modelAnalytics } = storeToRefs(mainStore)

const route = useRoute()

const chartData = ref(null)
const barChartData = ref(null)

const fillChartData = () => {
  chartData.value = documentsData.value
  barChartData.value = assessorsData.value
}

const datasetDocuments = computed(() => {
  return modelAnalytics.value.documents.filter((document) => {
    return document.type === documentTypes.dataset || document.type === documentTypes.template
  })
})

const labeledDocuments = computed(() => {
  return modelAnalytics.value.documents.filter((document) => {
    return document.isLabeled
  })
})

const documentsData = computed(() => {
  const labels = []
  const totalData = []
  const labeledData = []

  const creationByDate = new Map()
  const labeledByDate = new Map()

  let startDate
  let endDate = new Date()
  endDate.setDate(endDate.getDate() + 2)
  modelAnalytics.value.documents.forEach((document) => {
    const creationDate = new Date(Date.parse(document.createdAt))
    const dateString = formatDate(creationDate)

    if (!startDate) {
      startDate = creationDate
    }
    if (creationDate.getTime() < startDate.getTime()) {
      startDate = creationDate
    }

    if (creationByDate.has(dateString)) {
      creationByDate.set(dateString, creationByDate.get(dateString) + 1)
    } else {
      creationByDate.set(dateString, 1)
    }

    if (!document.labeledAt) {
      return
    }
    const labelDate = new Date(Date.parse(document.labeledAt))
    const labelDateString = formatDate(labelDate)
    if (labeledByDate.has(labelDateString)) {
      labeledByDate.set(labelDateString, labeledByDate.get(labelDateString) + 1)
    } else {
      labeledByDate.set(labelDateString, 1)
    }
  })

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = formatDate(date)
    labels.push(dateString)

    let cnt = 0
    if (totalData.length > 0) {
      cnt += totalData[totalData.length - 1]
    }
    if (creationByDate.has(dateString)) {
      cnt += creationByDate.get(dateString)
    }
    totalData.push(cnt)

    cnt = 0
    if (labeledData.length > 0) {
      cnt += labeledData[labeledData.length - 1]
    }
    if (labeledByDate.has(dateString)) {
      cnt += labeledByDate.get(dateString)
    }
    labeledData.push(cnt)
  }

  return {
    labels,
    datasets: [
      datasetObject('info', totalData, 'Total'),
      datasetObject('danger', labeledData, 'Labeled')
    ]
  }
})

const assessorsData = computed(() => {
  const labelCountByUser = new Map()
  modelAnalytics.value.participants.forEach((user) => {
    labelCountByUser.set(user.surname + ' ' + user.name, 0)
  })

  const filtered = modelAnalytics.value.documents.filter((document) => {
    return document.isLabeled
  })

  filtered.forEach((document) => {
    const assessor = document.assessors[document.assessors.length - 1]
    const key = assessor.surname + ' ' + assessor.name
    labelCountByUser.set(key, labelCountByUser.get(key) + 1)
  })

  const labels = []
  const data = []
  for (let entry of labelCountByUser) {
    labels.push(entry[0])
    data.push(entry[1])
  }
  return {
    labels,
    datasets: [
      datasetObject('primary', data, 'Labeled documents')
    ]
  }
})

const lastEvents = computed(() => {
  let events = []

  const filtered = modelAnalytics.value.documents.filter((document) => {
    return document.isLabeled
  })

  const sorted = filtered.sort((a, b) => {
    const dateA = Date.parse(a.labeledAt)
    const dateB = Date.parse(b.labeledAt)
    return dateA > dateB ? -1 : 1
  })

  sorted.forEach((document) => {
    const date = new Date(Date.parse(document.labeledAt))

    events.push({
      text: 'labeled document',
      date: formatFullDate(date),
      assessor: document.assessors[document.assessors.length - 1]
    })
  })

  if (events.length > 8) {
    events = events.slice(0, 8)
  }

  return events
})

onMounted(async () => {
  try {
    await modelAnalytics.value.fetch(route.params.id)
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
          :icon='mdiAccountMultiple'
          :number='modelAnalytics.participants.length'
          label='Participants'
        />
        <CardBoxWidget
          color='text-blue-500'
          :icon='mdiFileDocumentOutline'
          :number='modelAnalytics.documents.length'
          label='Documents'
        />
        <!--        <CardBoxWidget-->
        <!--          color='text-blue-500'-->
        <!--          :icon='mdiFileDocumentOutline'-->
        <!--          :number='datasetDocuments.length'-->
        <!--          label='Dataset documents'-->
        <!--        />-->
        <CardBoxWidget
          color='text-orange-500'
          :icon='mdiFileDocumentCheckOutline'
          :number='labeledDocuments.length'
          label='Labeled documents'
        />
        <!--        <CardBoxWidget-->
        <!--          color='text-red-500'-->
        <!--          :icon='mdiFileDocumentCheckOutline'-->
        <!--          :number='labeledDocuments.length'-->
        <!--          label='Free documents'-->
        <!--        />-->
      </div>

      <SectionTitleLineWithButton :icon='mdiCalendarText' title='Last events' />
      <div class='grid gap-x-16 mb-0 md:grid-cols-2'>
        <CardBoxEvent
          v-for='event in lastEvents'
          :key='event.assessor.date'
          :date='event.date'
          :assessor='event.assessor'
          :event='event.text'
        />
      </div>

      <SectionTitleLineWithButton :icon='mdiChartPie' title='Documents' />
      <CardBox class='mb-4'>
        <div v-if='chartData'>
          <LineChart :data='chartData' class='h-96' />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon='mdiAccountMultiple' title='Participants activity' />
      <CardBox class='mb-4'>
        <div v-if='barChartData'>
          <BarChart :data='barChartData' class='h-96' />
        </div>
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
