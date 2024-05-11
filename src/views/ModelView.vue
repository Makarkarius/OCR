<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiFileDocument } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import { documentTypes, userRoles } from '@/config'
import { storeToRefs } from 'pinia'
import { isPDF } from '@/misc'
import LineChart from '@/components/Charts/LineChart.vue'
import { sampleChartData } from '@/components/Charts/chart.config'
import UserList from '@/components/UserList.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import ModelDocumentsTable from '@/components/ModelDocumentsTable.vue'

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const { model } = storeToRefs(mainStore)

const isLoaded = ref(false)

const form = ref({
  documents: [],
  participants: []
})

onBeforeMount(async () => {
  await model.value.fetch(route.params.id)
  await mainStore.fetchUsers()
  form.value.participants = model.value.participants.slice()
  isLoaded.value = true
})

const isManager = computed(() => {
  if (!model.value.participants || model.value.participants.length === 0) {
    return false
  }

  const isManager = model.value.participants.find((participant) => {
    return participant.id === mainStore.user.id && participant.role === userRoles.manager
  })
  return !!isManager
})

const templateDocument = computed(() => {
  if (!model.value.documents || model.value.documents.length === 0) {
    return
  }
  return model.value.documents.find((d) =>
    d.type === documentTypes.template
  )
})

const labeledDocuments = computed(() => {
  if (!model.value.documents || model.value.documents.length === 0) {
    return 0
  }
  return model.value.documents.filter((doc) =>
    doc.isLabeled === true
  ).length
})

const sortedDocuments = computed(() => {
  if (!model.value.documents || model.value.documents.length === 0) {
    return model.value.documents
  }

  const sorted = model.value.documents.map(a => {
    return { ...a }
  })

  sorted.sort((a, b) => {
    if (a.isLabeled && !b.isLabeled) {
      return -1
    }
    if (!a.isLabeled && b.isLabeled) {
      return 1
    }
    if (a.type !== b.type) {
      return a.type > b.type ? -1 : 1
    }
    if (a.createdAt !== b.createdAt) {
      return a.createdAt > b.createdAt ? -1 : 1
    }
    return a.name > b.name ? 1 : -1
  })
  return sorted
})

const toLabeler = (id) => {
  router.push('/labeler/' + id)
}

const uploadDocuments = async () => {
  try {
    await model.value.addDocuments(form.value.documents, documentTypes.dataset)
    await model.value.fetch()
  } catch (err) {
    console.log(err)
  }
}

const saveModel = async () => {
  const filteredUsers = form.value.participants.filter((assessor) => {
    return !model.value.participants.find((user) => {
      return user.id === assessor.id
    })
  })

  try {
    await model.value.patch({
      participants: filteredUsers
    })
  } catch (err) {
    console.log(err)
  }
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox form @submit.prevent='' class='relative text-nowrap md:w-full lg:w-11/12 mx-auto min-h-[82vh]'>
        <div v-if='isLoaded'>
          <div v-if='isManager'>
            <SectionTitleLineWithButton :icon='mdiFileDocument' :title='model.name' main>
              <BaseButton v-if='isManager' color='contrast' label='Extract' />
            </SectionTitleLineWithButton>
            <div class='h-full px-2 mb-2'>
              <p class='text-2xl'>{{ model.description }}</p>
            </div>

            <div class='relative h-[35vh] max-h-[35vh] flex flex-row justify-between gap-2'>
              <div class='basis-4/12 border-gray-100 border-2 rounded-t-md'>
                <LineChart :data='sampleChartData()' />
              </div>

              <div class='relative basis-4/12 border-gray-100 border-2 rounded-t-md overflow-y-clip overflow-x-scroll'>
                <UserList
                  v-model:allUsers='mainStore.users'
                  v-model:users='form.participants'
                  class='overflow-y-scroll overflow-x-scroll h-full w-full'
                  withSearch
                />
              </div>

              <div
                class='basis-4/12 w-full border-gray-100 border-2 rounded-t-md overflow-hidden flex justify-center cursor-pointer'
                @click='toLabeler(templateDocument.id)'
              >
                <embed
                  v-if='isPDF(templateDocument?.urlPath)'
                  class='h-56 w-full object-cover'
                  :src='templateDocument?.urlPath'
                />
                <img
                  v-else
                  class='h-full object-cover'
                  :src='templateDocument?.urlPath'
                  alt='Template document preview' />
              </div>
            </div>

            <div class='relative h-full max-h-[25vh] rounded-b-md border-gray-100 border-[1px] overflow-hidden'>
              <ModelDocumentsTable
                class='overflow-y-scroll max-h-[25vh]'
                v-model:documents='sortedDocuments'
                v-model:uploadDocuments='form.documents'
                @upload='uploadDocuments'
                isManager
              />
            </div>
          </div>

          <div v-else>
            <SectionTitleLineWithButton :icon='mdiFileDocument' :title='model.name' main />
            <div class='h-full px-2 mb-2'>
              <p class='text-2xl'>{{ model.description }}</p>
            </div>

            <ModelDocumentsTable
              v-model:documents='sortedDocuments'
            />
          </div>
        </div>

        <template #footer>
          <BaseButtons v-if='isManager' class='w-full justify-end'>
            <BaseButton color='info' label='Save' @click='saveModel' />
            <BaseButton color='danger' outline label='Delete' @click='deleteModel' />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
