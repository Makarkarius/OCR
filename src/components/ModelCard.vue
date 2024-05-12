<script setup>
import { ref } from 'vue'
import { mdiChartBar, mdiTrashCan } from '@mdi/js'
import CardBoxModal from './CardBoxModal.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from './BaseButton.vue'
import ModelCardComponentTitle from './/ModelCardComponentTitle.vue'
import { useRouter } from 'vue-router'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { userRoles } from '@/config'
import PillTag from '@/components/PillTag.vue'

const router = useRouter()

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  allDocuments: {
    type: Object,
    default: {
      trend: 0,
      number: 0
    }
  },
  filledDocuments: {
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

const deleteModel = async () => {
  try {
    await props.model.delete()
    emit('update')
  } catch (err) {
    console.error(err)
  }
}

const showDeleteModal = (e) => {
  e.stopPropagation()
  isDeleteModalActive.value = true
}

const toModel = () => {
  router.push('/models/' + props.model.id)
}
</script>

<template>
  <!--TODO: move upper to view-->
  <CardBoxModal
    v-model='isDeleteModalActive'
    button='danger'
    button-label='Yes'
    :hasCancel='true'
    :title='`Are you sure you want to delete ` + model.name + ` model?`'
    @confirm='deleteModel'
  />

  <CardBox
    class='overflow-hidden shadow-md p-4 hover:scale-105 transition-scale duration-500 cursor-pointer'
    :hasComponentLayout='true'
    @click='toModel'
  >
    <ModelCardComponentTitle :title='model.name'>
      <BaseButtons v-if='model.userRole === userRoles.manager' no-wrap classAddon='-mt-3'>
        <BaseButton
          :icon='mdiChartBar'
          color='whiteDark'
          rounded-full
        />
        <BaseButton
          :icon='mdiTrashCan'
          color='whiteDark'
          rounded-full
          @click='showDeleteModal($event)'
        />
      </BaseButtons>
    </ModelCardComponentTitle>

    <div class='space-y-3'>
      <p class='line-clamp-1'>{{ model.description }}</p>

      <div class='grid grid-cols-2 justify-between'>
        <CardBoxWidget
          :trend='getTrendValue(allDocuments.trend)'
          :trend-type='getTrendType(allDocuments.trend)'
          color='text-emerald-500'
          :number='model.datasetDocuments'
          label='Dataset'
        />
        <CardBoxWidget
          :trend='getTrendValue(filledDocuments.trend)'
          :trend-type='getTrendType(filledDocuments.trend)'
          color='text-emerald-500'
          :number='model.labeledDocuments'
          label='Labeled'
        />
      </div>

      <progress
        class='flex self-center w-full'
        max='100'
        :value='(100 * model.labeledDocuments) / (model.datasetDocuments === 0 ? 1 : model.datasetDocuments)'
      />

      <div class='relative w-full max-h-[16vh] overflow-hidden rounded-md'>
        <PillTag
          v-if='!model.isTemplateLabeled'
          class='absolute right-1.5 top-1.5 z-10'
          color='danger'
          label='No labels'
          small
        />
        <img :src='model.previewURL' class='object-fill grayscale relative m-auto' alt='Model template document' />
      </div>
    </div>

    <template #footer></template>
  </CardBox>
</template>
