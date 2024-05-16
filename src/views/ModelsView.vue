<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ModelCard from '@/components/ModelCard.vue'
import { useMainStore } from '@/stores/main'
import BaseFloatingButton from '@/components/BaseFloatingButton.vue'
import { mdiPlus, mdiPlusCircleOutline } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import { computed, onMounted, ref } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import CardBoxModal from '@/components/CardBoxModal.vue'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const router = useRouter()

const isEmpty = computed(() => mainStore.models.length === 0)

const deleteModal = ref({
  visible: false,
  model: null
})

const fetchModels = async () => {
  try {
    await mainStore.fetchModels()
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

onMounted(async () => {
  await fetchModels()
})

const toModelCreation = () => {
  router.push('/models/new')
}

const toModelAnalytics = (model) => {
  router.push('/analytics/' + model.id)
}

const showDeleteModal = (model) => {
  deleteModal.value.model = model
  deleteModal.value.visible = true
}

const deleteModel = async () => {
  try {
    const modelName = deleteModal.value.model.name
    await deleteModal.value.model.delete()
    await fetchModels()
    notificationsStore.renderMsg('Model ' + modelName + 'was deleted!', notificationsStore.types.success)
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

</script>

<template>
  <CardBoxModal
    v-model='deleteModal.visible'
    button='danger'
    button-label='Yes'
    :hasCancel='true'
    :title='`Are you sure you want to delete ` + deleteModal.model?.name + ` model?`'
    @confirm='deleteModel'
  />

  <LayoutAuthenticated>
    <SectionMain>
      <CardBox
        v-if='isEmpty'
        hasComponentLayout
        class='h-[80vh] hover:bg-blue-100 transition-colors duration-200 cursor-pointer text-blue-200 hover:text-blue-300'
        @click='toModelCreation'
      >
        <div class='font-bold text-4xl m-auto'>
          <BaseIcon
            :path='mdiPlusCircleOutline'
            w='w-full'
            h='w-full'
            size='80'
          />
        </div>
      </CardBox>

      <CardBox v-else hasComponentLayout class='min-h-[80vh]' isTransparent>
        <div v-if='isEmpty' class='font-bold text-center h-full'>You have no models</div>
        <div class='grid gap-6 mb-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <template v-for='model in mainStore.models' :key='model.projectId'>
            <ModelCard
              :model='model'
              :allDocuments='{ trend: 0, number: 0 }'
              :filledDocuments='{ trend: 0, number: 0 }'
              @delete='showDeleteModal'
              @analytics='toModelAnalytics'
            />
          </template>

          <BaseFloatingButton
            :icon='mdiPlus'
            :rounded-full='true'
            color='contrast'
            icon-size='100%'
            class='h-12 w-12'
            to='/models/new'
          />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
