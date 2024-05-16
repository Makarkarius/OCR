<script setup>
import { useRouter } from 'vue-router'
import { isPDF } from '@/misc'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiDownload } from '@mdi/js'

const router = useRouter()

const documents = defineModel('documents', {
  type: [Array, FileList],
  required: true
})

const uploadDocuments = defineModel('uploadDocuments', {
  type: [Array, FileList],
  default: []
})

const emit = defineEmits(['upload', 'download'])

const upload = () => {
  emit('upload')
}

const download = () => {
  emit('download')
}

</script>

<template>
  <div class='relative'>
    <FormFilePicker
      v-model='uploadDocuments'
      class='absolute w-9 top-1.5 right-1.5 z-10'
      color='contrast'
      accept='image/png, image/jpeg'
      @update:modelValue='upload'
      isMultiple
    />

    <BaseButton
      class='absolute top-1.5 left-1.5 z-10'
      :icon='mdiDownload'
      color='contrast'
      @click='download'
    />

    <div class='mt-[4px]'>
      <table>
        <thead>
        <tr class='w-14'>
          <th></th>
          <th>Data</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='document in documents' :key='document.id'>
          <td class='w-14 p-1'>
            <div class='border-b-0 object-cover size-14 cursor-pointer'>
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
          <td data-label='Data' class='text-center'>
            <template v-if='document.data || document.labels?.length > 0'>
              Extracted
            </template>
            <template v-else>
              Not extracted
            </template>
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

table thead, th, tr {
  @apply sticky
}
</style>
