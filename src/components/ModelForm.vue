<script setup>
import { computed, onMounted } from 'vue'
import { getDocumentURL } from '@/misc'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import CardBox from '@/components/CardBox.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import UserList from '@/components/UserList.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiFileDocumentPlus, mdiLabel } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

const form = defineModel('form', {
  required: true,
  type: Object
})

const emit = defineEmits(['submit'])

const otherDocuments = computed(() => {
  if (form.value.rawOtherDocuments === null || form.value.rawOtherDocuments.length === 0) {
    return []
  }

  return Array.from(form.value.rawOtherDocuments)
})

onMounted(async () => {
  await mainStore.fetchUsers()
})

const submit = () => {
  emit('submit')
}

const reset = () => {
  form.value.name = ''
  form.value.description = ''
  form.value.assessors = []
  form.value.rawReferenceDocument = new File([''], 'placeholder')
  form.value.rawOtherDocuments = []
}

</script>

<template>
  <CardBox form @submit.prevent='submit' class='text-nowrap'>
    <SectionTitleLineWithButton :icon='mdiFileDocumentPlus' title='Model creation' main />
    <div class='grid grid-cols-2 gap-2 p-1'>
      <!-- row 1 -->
      <div class='relative basis-4/6'>
        <FormField label='Model name'>
          <FormControl v-model='form.name' :icon='mdiLabel' placeholder='Super cool model' />
        </FormField>

        <FormField label='Description'>
          <FormControl
            v-model='form.description'
            type='textarea'
            placeholder="That's my super cool model!"
          />
        </FormField>
      </div>

      <div class='relative max-w-full border-solid rounded-md overflow-hidden text-center'>
        <b>Upload template image</b>
        <embed
          v-if="form.rawReferenceDocument?.type === 'application/pdf'"
          class='h-56 w-full object-contain border-2 rounded-md'
          :src='getDocumentURL(form.rawReferenceDocument)'
        />
        <img
          v-else
          class='h-56 w-full object-contain border-2 rounded-md'
          :src='getDocumentURL(form.rawReferenceDocument)'
        />

        <FormFilePicker
          v-model='form.rawReferenceDocument'
          class='size-9 max-w-full absolute top-8 right-2'
          color='contrast'
          accept='image/png, image/jpeg'
        />
      </div>

      <!-- row 2 -->
      <div class='relative text-center font-bold pb-4 overflow-clip'>
        Choose assessors
        <UserList
          v-model:users='form.assessors'
          v-model:allUsers='mainStore.users'
          class='basis-5/12 min-h-[30vh] max-h-[30vh] overflow-scroll border-2'
          withSearch
        />
      </div>

      <div
        class='relative max-w-full overflow-hidden text-center font-bold overflow-clip'>
        Upload documents for future labeling
        <div
          class='flex min-h-[30vh] flex-row flex-wrap justify-around gap-2 p-1 border-2 rounded-md max-h-[30vh] overflow-scroll'>
          <template v-for='document in otherDocuments'>
            <embed
              v-if="document.type === 'application/pdf'"
              class='size-20 object-contain rounded-md'
              :src='getDocumentURL(document)'
            />
            <img v-else class='h-20 object-fill rounded-md' :src='getDocumentURL(document)' />
          </template>
        </div>

        <FormFilePicker
          v-model='form.rawOtherDocuments'
          :is-multiple='true'
          class='size-9 max-w-full absolute top-8 right-2'
          color='contrast'
          accept='image/png, image/jpeg'
        />
      </div>
    </div>

    <template #footer>
      <BaseButtons class='w-full justify-end'>
        <BaseButton color='info' label='Submit' @click='submit()' />
        <BaseButton color='info' outline label='Reset' @click='reset()' />
      </BaseButtons>
    </template>
  </CardBox>
</template>
