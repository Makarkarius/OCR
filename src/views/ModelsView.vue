<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ModelCard from '@/components/ModelCard.vue'
import { computed, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import BaseFloatingButton from '@/components/BaseFloatingButton.vue';
import { mdiPlus } from '@mdi/js';

const mainStore = useMainStore()

const {models} = storeToRefs(mainStore)

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="model in models">
            <ModelCard :name="model.name" :description="model.description" :preview-u-r-l="model.preview" :all-trend="model.trends?.all" :filled-trend="model.trends?.filled" />
        </template>

        <BaseFloatingButton :icon="mdiPlus" :rounded-full="true" color="contrast" icon-size="100%" class="h-12 w-12" to="/models/new" />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
