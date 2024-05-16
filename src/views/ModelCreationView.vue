<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { documentTypes, userRoles } from '@/config'
import ModelForm from '@/components/ModelForm.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { mdiProgressUpload } from '@mdi/js'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  rawReferenceDocument: new File([''], 'placeholder'),
  rawOtherDocuments: [],
  assessors: []
})

const createModel = async () => {
  if (form.value.name === '') {
    notificationsStore.renderError(new Error('Model must have a name and description!'))
    return
  }
  if (form.value.rawReferenceDocument?.name === 'placeholder' || form.value.rawReferenceDocument?.name === '') {
    notificationsStore.renderError(new Error('Upload reference document!'))
    return
  }

  try {
    const assessors = form.value.assessors.map((assessor) => {
      return {
        userId: assessor.id,
        role: userRoles.assessor
      }
    })

    mainStore.model.fill({
      name: form.value.name,
      description: form.value.description,
      participants: assessors
    })

    notificationsStore.renderMsg('Creating model', notificationsStore.types.warning, mdiProgressUpload, 0)
    await mainStore.model.create()
    await Promise.all([
      mainStore.model.addDocuments([form.value.rawReferenceDocument], documentTypes.template),
      mainStore.model.addDocuments(form.value.rawOtherDocuments, documentTypes.dataset)
    ])
    await mainStore.model.fetch()
    notificationsStore.renderMsg('Model was created!', notificationsStore.types.success)

    await router.push('/labeler/' + mainStore.model.getPreviewURL())
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <ModelForm v-model:form='form' @submit='createModel' />
    </SectionMain>
  </LayoutAuthenticated>
</template>
