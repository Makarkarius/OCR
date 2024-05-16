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
import UserList from '@/components/UserList.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import ModelDocumentsTable from '@/components/ModelDocumentsTable.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import ModelDocumentsFreeTable from '@/components/ModelDocumentsFreeTable.vue'

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
  mainStore.fetchUsers()
  await model.value.fetch(route.params.id)
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

const freeDocuments = computed(() => {
  if (!model.value.documents || model.value.documents.length === 0) {
    return model.value.documents
  }

  return model.value.documents.filter((document) => {
    return document.type === documentTypes.free
  })
})

const sortedDocuments = computed(() => {
  if (!model.value.documents || model.value.documents.length === 0) {
    return model.value.documents
  }

  let sorted = model.value.documents.slice()

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

  sorted = sorted.filter((document) => {
    return document.type !== documentTypes.free
  })

  if (!isManager.value) {
    sorted = sorted.filter((document) => {
      if (document.type === documentTypes.template) {
        return true
      }

      return !(document.isLabeled && document.assessors[0].id === mainStore.user.id)
    })
  }

  return sorted
})

const isDeleteModalActive = ref(false)

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

const uploadFreeDocuments = async () => {
  try {
    await model.value.addDocuments(form.value.documents, documentTypes.free)
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

  if (filteredUsers.length === 0) {
    return
  }

  try {
    await model.value.patch({
      participants: filteredUsers
    })
  } catch (err) {
    console.log(err)
  }
}

const showDeleteModel = async () => {
  isDeleteModalActive.value = true
}

const deleteModel = async () => {
  try {
    await mainStore.model.delete()
    await router.push('/models')
  } catch (err) {
    console.log(err)
  }
}

</script>

<template>
  <CardBoxModal
    v-model='isDeleteModalActive'
    button='danger'
    button-label='Yes'
    :hasCancel='true'
    :title='`Are you sure you want to delete ` + model.name + ` model?`'
    @confirm='deleteModel'
  />

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
              <div class='basis-4/12 text-center flex flex-col justify-between'>
                <div class='basis-1/12 font-bold'>Upload documents for data extraction</div>

                <ModelDocumentsFreeTable
                  class='overflow-y-scroll basis-11/12 rounded-t-md border-gray-100 border-2'
                  v-model:documents='freeDocuments'
                  v-model:uploadDocuments='form.documents'
                  @upload='uploadFreeDocuments'
                />
              </div>

              <div
                class='relative basis-4/12 overflow-y-clip overflow-x-scroll text-center flex flex-col justify-between'
              >
                <div class='basis-1/12 font-bold'>Assessors</div>
                <UserList
                  class='overflow-y-scroll border-gray-100 border-2 rounded-t-md rounded-b-none overflow-x-scroll w-full basis-11/12'
                  v-model:allUsers='mainStore.users'
                  v-model:users='form.participants'
                  withSearch
                />
              </div>

              <div
                class='basis-4/12 w-full overflow-hidden flex flex-col justify-between text-center'
              >
                <div class='basis-1/12 font-bold'>Template document</div>
                <div
                  class='border-gray-100 basis-11/12 border-2 rounded-t-md overflow-clip flex justify-center cursor-pointer '
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
            <BaseButton color='danger' outline label='Delete' @click='showDeleteModel' />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
