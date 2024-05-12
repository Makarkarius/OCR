<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { documentTypes, userRoles } from '@/config'
import ModelForm from '@/components/ModelForm.vue'

const mainStore = useMainStore()
const router = useRouter()

const form = ref({
  name: '',
  description: '',
  rawReferenceDocument: new File([''], 'placeholder'),
  rawOtherDocuments: [],
  assessors: []
})

const createModel = async () => {
  if (form.value.rawReferenceDocument?.name === 'placeholder' || form.value.rawReferenceDocument?.name === '') {
    alert('Upload reference document')
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

    await mainStore.model.create()
    await mainStore.model.addDocuments([form.value.rawReferenceDocument], documentTypes.template)
    await mainStore.model.addDocuments(form.value.rawOtherDocuments, documentTypes.dataset)
    await mainStore.model.fetch()

    await router.push('/labeler/' + mainStore.model.getPreviewURL())
  } catch (error) {
    if (error.message) {
      console.log(error.message)
    } else {
      console.error(error)
    }
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
