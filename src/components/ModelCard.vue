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
import axios from 'axios'
import { SERVER_URL } from '@/globals.js'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'

const mainStore = useMainStore()
const router = useRouter()

const props = defineProps({
  id: {
    type: String,
    required: true
  },
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

const emit = defineEmits(['update'])

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

const deleteModel = () => {
  axios
    .delete(SERVER_URL + '/v1/project/' + props.id, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: mainStore.user.token
      }
    })
    .then((result) => {
      emit('update')
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    })
}

const showDeleteModal = (e) => {
  e.stopPropagation()
  isDeleteModalActive.value = true
}

const toModel = () => {
  router.push('/models/' + props.id)
}
</script>

<template>
  <CardBoxModal
    v-model="isDeleteModalActive"
    button="danger"
    button-label="Yes"
    :hasCancel="true"
    :title="`Are you sure you want to delete ` + name + ` model?`"
    @confirm="deleteModel"
  >
  </CardBoxModal>

  <CardBox
    class="overflow-hidden shadow-md p-4 hover:scale-105 transition-scale duration-500 cursor-pointer"
    :hasComponentLayout="true"
    @click="toModel"
  >
    <ModelCardComponentTitle :title="name">
      <div class="grid grid-cols-2 gap-1">
        <BaseButton
          :icon="mdiChartBar"
          color="whiteDark"
          rounded-full
        />
        <BaseButton
          :icon="mdiTrashCan"
          color="whiteDark"
          rounded-full
          @click="showDeleteModal($event)"
        />
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

      <progress
        class="flex self-center w-full"
        max="100"
        :value="(100 * filledTrend.number) / (allTrend.number === 0 ? 1 : allTrend.number)"
      ></progress>

      <div class="relative w-full h-48 overflow-hidden rounded-md">
        <img :src="previewURL" class="object-fill grayscale relative m-auto" />
      </div>
    </div>

    <template #footer> </template>
  </CardBox>
</template>
