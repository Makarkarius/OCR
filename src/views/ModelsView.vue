<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ModelCard from '@/components/ModelCard.vue'
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import BaseFloatingButton from '@/components/BaseFloatingButton.vue'
import { mdiPlus } from '@mdi/js'

const mainStore = useMainStore()
mainStore.fetchModels()

onMounted(() => {
  
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <!-- <template v-for="model in mainStore.models">
            <ModelCard :name="model.name" :description="model.description" :previewURL="model.preview" :all-trend="model.trends?.all" :filled-trend="model.trends?.filled" />
        </template> -->

        <template v-for="model in mainStore.realModels">
          <ModelCard
            :id="model.projectId"
            :name="model.name"
            :description="model.description"
            :preview-URL="model.mainDocUrl"
            :all-trend="{ trend: 0, number: 0 }"
            :filled-trend="{ trend: 0, number: 0 }"
            @update="mainStore.fetchModels"
          />
        </template>

        <BaseFloatingButton
          :icon="mdiPlus"
          :rounded-full="true"
          color="contrast"
          icon-size="100%"
          class="h-12 w-12"
          to="/models/new"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
