<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { computed, reactive } from 'vue';
import { useMainStore } from '@/stores/main';
import { mdiFileDocumentPlus, mdiGithub, mdiLabel } from '@mdi/js';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import FormFilePicker from '@/components/FormFilePicker.vue';

const mainStore = useMainStore()

// const fetch = () => {
//   console.log('fetching');
//   mainStore.fetchSampleModels;
//   console.log(mainStore.models[0])
//   setTimeout(() => {fetch()}, 1000)
// }
// fetch()

const form = reactive({
  name: '',
  description: '',
  referenceFile: null,
})

const submit = () => {
  //
}

const referenceImg = computed(() => {
  if (form.referenceFile === null) {
    return 'https://cdn.fishki.net/upload/post/2021/04/13/3706843/1_4138a9e6897e576c8fa94fe8efcff36f.jpg';
  }
  return URL.createObjectURL(form.referenceFile);
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiFileDocumentPlus" title="Model creation" main />
      <CardBox form @submit.prevent="submit">

        <div class="flex flex-row">
          <div class="relative max-h-56 basis-4/6">
            <FormField label="Model name">
              <FormControl v-model="form.name" :icon="mdiLabel" placeholder="Super cool model" />
            </FormField>

            <FormField label="Desciption">
              <FormControl v-model="form.description" type="textarea" placeholder="That's my super cool model!" />
            </FormField>
          </div>

          <div class="relative m-3 max-h-56 w-2/6 basis-2/6">
            <img id="display_image" class="w-full h-full rounded-md relative object-contain" :src="referenceImg" />
            <FormFilePicker v-model="form.referenceFile" label="Upload" class="h-1/6 max-w-full absolute top-2 right-2" color="contrast" :is-round-icon="true" />
          </div>
        </div>

        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="Create" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
