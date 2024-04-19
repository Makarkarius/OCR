<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiFileDocumentPlus, mdiGithub, mdiLabel } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import AssessorList from '@/components/AssessorList.vue'
import UserSearch from '@/components/UserSearch.vue'
import axios from 'axios'
import { SERVER_URL } from '@/globals.js'

const router = useRouter()

const mainStore = useMainStore()

const form = reactive({
  name: '',
  description: '',
  rawReferenceDocument: new File([''], 'placeholder'),
  rawOtherDocuments: [],
  assessors: []
})

let projectID = ''

const getDocumentID = () => {
  let docID = ''

  console.log('projectID = ', projectID)
  axios
    .get(SERVER_URL + '/v1/project/' + projectID, {
      headers: {
        'Authorization': mainStore.user.token
      }
    })
    .then((result) => {
      console.log(result)

      docID = result?.data?.document[0]?.id
    })
    .catch((error) => {
      alert(error.message)
    })

  return docID
}

const addDocument = (doc) => {
  const formData = new FormData('documents', doc)

  axios
    .post(SERVER_URL + '/v1/project/' + projectID + ':upload-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': mainStore.user.token
      }
    })
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      alert(error.message)
    })
}

const createModel = () => {
  let assessors = []
  for (let i in form.assessors) {
    assessors.push({
      userID: form.assessors[i].id,
      role: 'assessor'
    })
  }
  console.log(assessors)

  axios
    .post(
      SERVER_URL + '/v1/project',
      {
        name: form.name,
        description: form.description,
        participants: assessors
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mainStore.user.token
        }
      }
    )
    .then((result) => {
      console.log(result)

      projectID = result?.data?.id
      mainStore.realModels.value.push(projectID)

      addDocument(form.rawReferenceDocument)
      for (let i in form.rawOtherDocuments) {
        addDocument(form.rawOtherDocuments[i])
      }

      let documentID = getDocumentID()
      router.push('/labeler/' + documentID)
    })
    .catch((error) => {
      alert(error.message)
    })
}

const submit = () => {
  router.push('/labeler/' + '49da0a1d-43c7-4a55-805b-d260e96e8039')
  return

  console.log(form)

  if (form.rawReferenceDocument?.name === 'placeholder' || form.rawReferenceDocument?.name === '') {
    alert('Upload reference document')
    return
  }
  if (form.rawOtherDocuments.length === 0) {
    alert('Upload at least one document')
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
      <SectionTitleLineWithButton :icon="mdiFileDocumentPlus" title="Model creation" main />
      <CardBox form @submit.prevent="submit">
        <div class="flex flex-row">
          <div class="relative min-h-56 basis-4/6">
            <FormField label="Model name">
              <FormControl v-model="form.name" :icon="mdiLabel" placeholder="Super cool model" />
            </FormField>

            <FormField label="Desciption">
              <FormControl
                v-model="form.description"
                type="textarea"
                placeholder="That's my super cool model!"
              />
            </FormField>
          </div>

          <div
            class="relative m-3 h-56 w-2/6 basis-2/6 border-solid border-2 rounded-md overflow-hidden"
          >
            <embed
              v-if="form.rawReferenceDocument?.type === 'application/pdf'"
              class="h-56 w-full object-contain"
              :src="getURL(form.rawReferenceDocument)"
            />
            <img
              v-else
              class="h-56 w-full object-contain"
              :src="getURL(form.rawReferenceDocument)"
            />

            <FormFilePicker
              v-model="form.rawReferenceDocument"
              class="h-1/6 max-w-full absolute top-2 right-2"
              color="contrast"
              :is-round-icon="true"
              accept="image/png, image/jpeg, .pdf"
            />
          </div>
        </div>

        <div class="flex flex-row justify-between max-h-96 overflow-hidden">
          <div class="basis-5/12 relative">
            <div class="grid grid-flow-row grid-cols-4">
              <template v-for="document in otherDocuments">
                <embed
                  v-if="document.type === 'application/pdf'"
                  class="size-20 object-contain"
                  :src="getURL(document)"
                />
                <img v-else class="size-20 object-contain" :src="getURL(document)" />
              </template>
            </div>

            <FormFilePicker
              v-model="form.rawOtherDocuments"
              :is-multiple="true"
              class="h-1/6 max-w-full absolute top-2 right-2"
              color="contrast"
              :is-round-icon="true"
              accept="image/png, image/jpeg, .pdf"
            />
          </div>

          <AssessorList
            v-model="form.assessors"
            class="basis-5/12 h-80 max-h-full overflow-scroll"
          />
        </div>

        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="Create" color="info" label="Submit" @click="submit()" />
            <BaseButton type="Reset" color="info" outline label="Reset" @click="reset()" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
