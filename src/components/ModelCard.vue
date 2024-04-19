<script setup>
import { computed, ref } from 'vue'
import { mdiChartBar, mdiPencil, mdiTrashCan } from '@mdi/js'
import CardBoxModal from './CardBoxModal.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentHeadImage from './CardBoxComponentHeadImage.vue'
import BaseButton from './BaseButton.vue'
import CardBoxComponentTitle from './CardBoxComponentTitle.vue'
import CardBoxWidget from './CardBoxWidget.vue'
import ModelCardComponentTitle from './/ModelCardComponentTitle.vue'

const props = defineProps({
  previewURL: {
    type: String,
    default: '../../public/pic.jpg'
  },
  name: {
    type: String,
    default: 'Model name'
  },
  description: {
    type: String,
    default: 'Model description'
  },
  allTrend: {
    type: Object,
    default: {
      trend: 0,
      number: 0
    }
  },
  filledTrend: {
    type: Object,
    default: {
      trend: 0,
      number: 0
    }
  }
})

const isDeleteModalActive = ref(false)

const getTrendType = (trend) => {
  let val = parseInt(trend)

  if (val === 0) {
    return 'stable'
  }
  if (val > 0) {
    return 'up'
  }
  if (val < 0) {
    return 'down'
  }

  return null
}

const getTrendValue = (trend) => {
  return trend + '%'
}

</script>

<template>
  <CardBoxModal v-model="isDeleteModalActive" button="danger" button-label="Yes" :has-cancel="true" :title="`Are you sure you want to delete ` + name + ` model?`">
  </CardBoxModal>

  <CardBox class="overflow-hidden shadow-md p-4" :has-component-layout="true">
    <ModelCardComponentTitle :title="name">
      <div class="grid grid-cols-3 gap-1">
        <BaseButton :icon="mdiChartBar" color="whiteDark" rounded-full @click="isDeleteModalActive = true" />
        <BaseButton :icon="mdiPencil" color="whiteDark" rounded-full @click="isDeleteModalActive = true" />
        <BaseButton :icon="mdiTrashCan" color="whiteDark" rounded-full @click="isDeleteModalActive = true" />
      </div>
    </ModelCardComponentTitle>

    <div class="space-y-3">
        <p class="line-clamp-1">{{ description }}</p>

        <div class="grid grid-cols-2 justify-between">
          <CardBoxWidget
            :trend="getTrendValue(allTrend.trend)"
            :trend-type="getTrendType(allTrend.trend)"
            color="text-emerald-500"
            :number="allTrend.number"
            label="Documents"
          />
          <CardBoxWidget
            :trend="getTrendValue(filledTrend.trend)"
            :trend-type="getTrendType(filledTrend.trend)"
            color="text-emerald-500"
            :number="filledTrend.number"
            label="Filled"
          />
        </div>

        <progress class="flex self-center w-full" max="100" :value="100 * filledTrend.number / (allTrend.number === 0 ? 1 : allTrend.number)">
        </progress>

        <div class="relative w-full h-48 overflow-hidden rounded-md">
            <img :src="previewURL" class="object-fill grayscale relative m-auto" />
        </div>
    </div>

    <template #footer>
    </template>
  </CardBox>
</template>
