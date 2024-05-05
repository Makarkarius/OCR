<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiFileDocumentPlus, mdiLabel } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import AssessorList from '@/components/AssessorList.vue'
import axios from 'axios'
import { SERVER_URL } from '@/globals.js'

const mainStore = useMainStore()
const router = useRouter()

const form = reactive({
  name: '',
  description: '',
  documents: [],
  rawReferenceDocument: new File([''], 'placeholder'),
  rawOtherDocuments: [],
  assessors: []
})

let projectID = ''

const getDocumentID = async () => {
  try {
    const response = await axios.get(SERVER_URL + '/v1/project/' + projectID, {
      headers: {
        'Authorization': mainStore.user.token
      }
    })

    console.log(response)

    let docID = response?.data?.document[0]?.id

    return docID
  } catch (error) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    }
  }
}

const addDocument = async (doc) => {
  const formData = new FormData()
  formData.append('documents', doc)

  await axios({
    method: 'post',
    url: SERVER_URL + '/v1/project/' + projectID + ':upload-documents',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': mainStore.user.token
    }
  }).catch((error) => {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    }
  })
}

const createModel = async () => {
  try {
    let assessors = []
    for (let i in form.assessors) {
      assessors.push({
        userID: form.assessors[i].id,
        role: 'assessor'
      })
    }

    let response = await axios.post(
      SERVER_URL + '/v1/project',
      {
        name: form.name,
        description: form.description,
        participants: assessors
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    projectID = response?.data?.id

    await addDocument(form.rawReferenceDocument)

    for (let i = 0; i < form.rawOtherDocuments.length; i++) {
      await addDocument(form.rawOtherDocuments[i])
    }

    let documentID = await getDocumentID()

    router.push('/labeler/' + documentID)
  } catch (error) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    }
  }
}

const submit = () => {
  if (form.rawReferenceDocument?.name === 'placeholder' || form.rawReferenceDocument?.name === '') {
    alert('Upload reference document')
    return
  }

  createModel()
}

const reset = () => {
  form.rawReferenceDocument = new File([''], 'placeholder')
  form.assessors = []
  form.rawOtherDocuments = []
}

const otherDocuments = computed(() => {
  if (form.rawOtherDocuments === null || form.rawOtherDocuments.length === 0) {
    return []
  }

  return Array.from(form.rawOtherDocuments)
})

const getURL = (document) => {
  return URL.createObjectURL(document)
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon='mdiFileDocumentPlus' title='Model creation' main />
      <CardBox form @submit.prevent='submit'>
        <div class='flex flex-row'>
          <div class='relative min-h-56 basis-4/6'>
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

          <div
            class='relative m-3 h-56 w-2/6 basis-2/6 border-solid border-2 rounded-md overflow-hidden'
          >
            <embed
              v-if="form.rawReferenceDocument?.type === 'application/pdf'"
              class='h-56 w-full object-contain'
              :src='getURL(form.rawReferenceDocument)'
            />
            <img
              v-else
              class='h-56 w-full object-contain'
              :src='getURL(form.rawReferenceDocument)'
            />

            <FormFilePicker
              v-model='form.rawReferenceDocument'
              class='h-1/6 max-w-full absolute top-2 right-2'
              color='contrast'
              :is-round-icon='true'
              accept='image/png, image/jpeg, .pdf'
            />
          </div>
        </div>

        <div class='flex flex-row justify-between max-h-96 overflow-hidden'>
          <div class='basis-5/12 relative'>
            <div class='grid grid-flow-row grid-cols-4'>
              <template v-for='document in otherDocuments'>
                <embed
                  v-if="document.type === 'application/pdf'"
                  class='size-20 object-contain'
                  :src='getURL(document)'
                />
                <img v-else class='size-20 object-contain' :src='getURL(document)' />
              </template>
            </div>

            <FormFilePicker
              v-model='form.rawOtherDocuments'
              :is-multiple='true'
              class='h-1/6 max-w-full absolute top-2 right-2'
              color='contrast'
              :is-round-icon='true'
              accept='image/png, image/jpeg, .pdf'
            />
          </div>

          <AssessorList
            v-model='form.assessors'
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
