<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ModelCard from '@/components/ModelCard.vue'
import { useMainStore } from '@/stores/main'
import BaseFloatingButton from '@/components/BaseFloatingButton.vue'
import { mdiPlus, mdiPlusCircleOutline } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import { computed, onBeforeMount } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { useRouter } from 'vue-router'

const mainStore = useMainStore()
const router = useRouter()

const isEmpty = computed(() => mainStore.models.length === 0)

console.log(mainStore.models)

onBeforeMount(async () => {
  await mainStore.fetchModels()
})

const toModelCreation = () => {
  router.push('/models/new')
}

</script>

<template>
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
              @update='mainStore.fetchModels'
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
