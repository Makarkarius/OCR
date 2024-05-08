<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiFileDocument } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import { documentTypes, userRoles } from '@/config'
import { storeToRefs } from 'pinia'
import UserAvatar from '@/components/UserAvatar.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import { isPDF } from '@/misc'
import LineChart from '@/components/Charts/LineChart.vue'
import { sampleChartData } from '@/components/Charts/chart.config'

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const { model } = storeToRefs(mainStore)

onMounted(async () => {
  await getModel(route.params.id)
  isLoaded.value = true
})

const getModel = async (id) => {
  await model.value.fetch(id)
}

const isLoaded = ref(false)

const isManager = computed(() => {
  if (!model.value.participants || model.value.participants.length === 0) {
    return false
  }

  const user = model.value.participants.find((participant) => {
    return participant.id === mainStore.user.id
  })
  return user?.role === userRoles.manager
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
    if (a.type === b.type) {
      return a.name > b.name ? -1 : 1
    }
    return a.type > b.type ? -1 : 1
  })
  return sorted
})

const toLabeler = (id) => {
  router.push('/labeler/' + id)
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox form @submit.prevent='' class='relative text-nowrap md:w11/12 lg:w-10/12 mx-auto h-[80vh]'>
        <div v-if='isLoaded'>
          <div v-if='isManager'>
            <SectionTitleLineWithButton :icon='mdiFileDocument' :title='model.name' main />
            <div class='h-full px-2 mb-2'>
              <p class='text-2xl'>{{ model.description }}</p>
            </div>

            <div class='relative h-[35vh] max-h-[35vh] flex flex-row justify-between gap-2'>
              <div class='basis-4/12 border-gray-100 border-2 rounded-t-md'>
                <LineChart :data='sampleChartData()' />
              </div>

              <div class='basis-5/12 border-gray-100 border-2 rounded-t-md overflow-y-scroll'>
                <table>
                  <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for='assessor in model.participants' :key='assessor.id'>
                    <td class='border-b-0 lg:w-6'>
                      <UserAvatar :username='assessor.id' class='w-24 h-24 mx-auto lg:w-6 lg:h-6' />
                    </td>
                    <td data-label='Name'>
                      {{ assessor.surname + ' ' + assessor.name }}
                    </td>
                    <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
                      <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                          color="danger"
                          :icon="mdiTrashCan"
                          small
                          @click="removeAssessor(assessors, (item) => { return assessor.id === item.id })
                          "
                        />
                      </BaseButtons>
                    </td> -->
                  </tr>
                  </tbody>
                </table>
              </div>

              <div class='basis-4/12 w-full border-gray-100 border-2 rounded-t-md overflow-hidden flex justify-end'>
                <embed
                  v-if='isPDF(templateDocument?.urlPath)'
                  class='h-56 w-full object-cover'
                  :src='templateDocument?.urlPath'
                />
                <img
                  v-else
                  class='h-full object-cover'
                  :src='templateDocument?.urlPath'
                />
              </div>
            </div>

            <div class='h-full overflow-y-scroll rounded-b-md border-gray-100 border-[1px] '>
              <progress
                class='flex self-center h-[4px] w-full rounded-none'
                max='100'
                :value='(100 * (labeledDocuments === 0 ? 1 : labeledDocuments)) / (model.documents.length === 0 ? 1 : model.documents.length)'
              />
              <table class='text-center'>
                <thead>
                <tr>
                  <th></th>
                  <th class='text-center'>Assessor</th>
                  <th class='text-center'>Type</th>
                  <th class='text-center'>Labeled</th>
                  <th class='text-center'>Valid</th>
                  <th class='text-center'>Learnt</th>
                  <th class='text-center'>Created</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='document in sortedDocuments' :key='document.id'>
                  <td class='w-14 p-1'>
                    <div class='border-b-0 object-cover size-14 cursor-pointer' @click='toLabeler(document.id)'>
                      <embed
                        v-if='isPDF(document?.urlPath)'
                        class='h-full w-full object-contain border-2 rounded-md'
                        :src='document?.urlPath'
                      />
                      <img
                        v-else
                        class='h-full w-full object-cover border-2 border-gray-100 rounded-md'
                        :src='document?.urlPath'
                      />
                    </div>
                  </td>
                  <td data-label='Assessor' class='text-center'>
                    {{ document?.assessors[0]?.name }}
                  </td>
                  <td data-label='Type' class='text-center'>
                    {{ document?.type }}
                  </td>
                  <TableCheckboxCell v-model='document.isLabeled' disabled />
                  <TableCheckboxCell v-model='document.isValid' disabled />
                  <TableCheckboxCell v-model='document.isLearnt' disabled />
                  <td data-label='Created' class='text-center'>
                    {{ document?.createdAt }}
                  </td>
                  <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="removeAssessor(assessors, (item) => { return assessor.id === item.id })
                        "
                      />
                    </BaseButtons>
                  </td> -->
                </tr>
                </tbody>
              </table>
            </div>

            <!--        <template #footer>-->
            <!--          <BaseButtons>-->
            <!--            <BaseButton type='Create' color='info' label='Submit' @click='submit()' />-->
            <!--            <BaseButton type='Reset' color='info' outline label='Reset' @click='reset()' />-->
            <!--          </BaseButtons>-->
            <!--        </template>-->
          </div>

          <div v-else>


            <SectionTitleLineWithButton :icon='mdiFileDocument' :title='model.name' main />
            <div class='h-full px-2 mb-2'>
              <p class='text-2xl'>{{ model.description }}</p>
            </div>

            <progress
              class='flex self-center h-[4px] w-full mt-6 rounded-b-md'
              max='100'
              :value='(100 * (labeledDocuments === 0 ? 1 : labeledDocuments)) / (model.documents.length === 0 ? 1 : model.documents.length)'
            />

            <div class='h-full max-h-90 border-gray-100 border-2 overflow-y-scroll rounded-b-md'>
              <table class='text-center'>
                <thead>
                <tr>
                  <th></th>
                  <th class='text-center'>Assessor</th>
                  <th class='text-center'>Type</th>
                  <th class='text-center'>Labeled</th>
                  <th class='text-center'>Valid</th>
                  <th class='text-center'>Learnt</th>
                  <th class='text-center'>Created</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='document in sortedDocuments' :key='document.id'>
                  <td class='w-14 p-1'>
                    <div class='border-b-0 object-cover size-14 cursor-pointer' @click='toLabeler(document.id)'>
                      <embed
                        v-if='isPDF(document?.urlPath)'
                        class='h-full w-full object-contain border-2 rounded-md'
                        :src='document?.urlPath'
                      />
                      <img
                        v-else
                        class='h-full w-full object-cover border-2 border-gray-100 rounded-md'
                        :src='document?.urlPath'
                      />
                    </div>
                  </td>
                  <td data-label='Assessor' class='text-center'>
                    {{ document?.assessors[0]?.name }}
                  </td>
                  <td data-label='Type' class='text-center'>
                    {{ document?.type }}
                  </td>
                  <TableCheckboxCell v-model='document.isLabeled' disabled />
                  <TableCheckboxCell v-model='document.isValid' disabled />
                  <TableCheckboxCell v-model='document.isLearnt' disabled />
                  <td data-label='Created' class='text-center'>
                    {{ document?.createdAt }}
                  </td>
                  <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="removeAssessor(assessors, (item) => { return assessor.id === item.id })
                        "
                      />
                    </BaseButtons>
                  </td> -->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
