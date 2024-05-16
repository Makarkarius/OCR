<script setup>
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import { useRouter } from 'vue-router'
import { isPDF } from '@/misc'
import { computed } from 'vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiDownload } from '@mdi/js'

const router = useRouter()

const props = defineProps({
  isManager: {
    type: Boolean,
    default: false
  }
})

const documents = defineModel('documents', {
  type: [Array, FileList],
  required: true
})

const uploadDocuments = defineModel('uploadDocuments', {
  type: [Array, FileList],
  default: []
})

const emit = defineEmits(['upload', 'download', 'validate'])

const getName = (assessor) => {
  if (!assessor) {
    return ''
  }
  return assessor.surname + ' ' + assessor.name
}

const toLabeler = (id) => {
  router.push('/labeler/' + id)
}

const labeledDocuments = computed(() => {
  if (!documents.value || documents.value.length === 0) {
    return 0
  }
  return documents.value.filter((document) => document.isLabeled).length
})

const upload = () => {
  emit('upload')
}

const download = () => {
  emit('download')
}

const changeValid = (e, document) => {
  emit('validate', e, document)
}

</script>

<template>
  <div class='relative pt-[4px]'>
    <progress
      class='absolute flex self-center h-[4px] -mt-[4px] w-full rounded-none z-10'
      max='100'
      :value='(100 * (labeledDocuments === 0 ? 1 : labeledDocuments)) / (documents.length === 0 ? 1 : documents.length)'
    />

    <BaseButtons v-if='isManager' class='absolute right-1.5 top-2.5 z-10'>
      <FormFilePicker
        v-model='uploadDocuments'
        class='size-9 z-10'
        color='contrast'
        accept='image/png, image/jpeg'
        @update:modelValue='upload'
        isMultiple
      />
      <BaseButton
        class='size-9 z-10'
        :icon='mdiDownload'
        color='contrast'
        @click='download'
      />
    </BaseButtons>

    <div class='mt-[4px]'>
      <table>
        <thead>
        <tr>
          <th></th>
          <th>Assessor</th>
          <th>Type</th>
          <th>Labeled</th>
          <th>Valid</th>
          <th>Learnt</th>
          <th>Created</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='document in documents' :key='document.id'>
          <td class='w-14 p-1'>
            <div class='border-b-0 object-cover size-14 cursor-pointer' @click='toLabeler(document.id)'>
              <embed
                v-if='isPDF(document?.urlPath)'
                class='h-full w-full object-contain border-2 rounded-md'
                :src='document?.urlPath'
                alt='Model template document'
              />
              <img
                v-else
                class='h-full w-full object-cover border-2 border-gray-100 rounded-md'
                :src='document?.urlPath'
                alt='Model template document'
              />
            </div>
          </td>
          <td data-label='Assessor' class='text-center'>
            {{ getName(document.assessors?.at(0)) }}
          </td>
          <td data-label='Type' class='text-center'>
            {{ document?.type }}
          </td>
          <TableCheckboxCell data-label='Labeled' v-model='document.isLabeled' disabled />
          <TableCheckboxCell
            data-label='Valid'
            v-model='document.isValid'
            :disabled='!isManager'
            @checked='changeValid($event, document)'
          />
          <TableCheckboxCell data-label='Learnt' v-model='document.isLearnt' disabled />
          <td data-label='Created' class='text-center'>
            {{ document?.createdAt }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
th {
  @apply text-center;
}
</style>
