<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiFileDocumentPlus, mdiLabel } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import AssessorList from '@/components/AssessorList.vue'

const mainStore = useMainStore()
// const router = useRouter()
const route = useRoute()

const getModel = async (id) => {
  await mainStore.model.fetch(id)
}

onMounted(async () => {
  await getModel(route.params.id)
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon='mdiFileDocumentPlus' :title='mainStore.model.name' main />
      <CardBox hasComponentLayout>
        <div class='flex flex-row'>
          <div class='relative min-h-56 basis-4/6'>
            <FormField label='Model name'>
              <FormControl v-model='mainStore.model.name' :icon='mdiLabel' />
            </FormField>

            <FormField label='Desciption'>
              <FormControl
                v-model='mainStore.model.description'
                type='textarea'
                placeholder="That's my super cool model!"
              />
            </FormField>
          </div>

          <div
            class='relative m-3 h-56 w-2/6 basis-2/6 border-solid border-2 rounded-md overflow-hidden'
          >
            <!--            <embed-->
            <!--              v-if="model.rawReferenceDocument?.type === 'application/pdf'"-->
            <!--              class="h-56 w-full object-contain"-->
            <!--              :src="getURL(form.rawReferenceDocument)"-->
            <!--            />-->
            <!--            <img-->
            <!--              v-else-->
            <!--              class="h-56 w-full object-contain"-->
            <!--              :src="getURL(form.rawReferenceDocument)"-->
            <!--            />-->
          </div>
        </div>

        <div class='flex flex-row justify-between max-h-96 overflow-hidden'>
          <div class='basis-5/12 relative'>
            <div class='grid grid-flow-row grid-cols-4'>
              <template v-for='document in mainStore.model.documents' :key='document.id'>
                <!--                <embed-->
                <!--                  v-if="document.type === 'application/pdf'"-->
                <!--                  class="size-20 object-contain"-->
                <!--                  :src="getURL(document)"-->
                <!--                />-->
                <img class='size-20 object-contain' :src='document.urlPath' />
              </template>
            </div>
          </div>

          <AssessorList
            v-model:assessors='mainStore.model.participants'
            class='basis-5/12 h-80 max-h-full overflow-scroll'
          />
        </div>

        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type='Create' color='info' label='Submit' @click='submit()' />
            <BaseButton type='Reset' color='info' outline label='Reset' @click='reset()' />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
