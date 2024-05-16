<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CardBox from '@/components/CardBox.vue'
import Labeler from '@/components/Labeler.vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { ref } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const router = useRouter()

const labels = ref([])

const patchDocument = async () => {
  try {
    const labelNames = new Set()
    labels.value.forEach((label) => {
      const name = label.labelName
      if (name === '') {
        throw new Error('All labels must have names!')
      }
      if (labelNames.has(name)) {
        throw new Error('Labels have same names!')
      }
      labelNames.add(name)
    })
    await mainStore.document.patch({
      isLabeled: true,
      assessor: mainStore.user.id,
      labels: labels.value
    })
    notificationsStore.renderMsg('Document was updated!', notificationsStore.types.success)
    await router.push('/models/' + mainStore.document.projectId)
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

</script>

<template>
  <div>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton title='Document labeling' main />
        <CardBox class='h-[75vh] max-h-[75vh]' hasComponentLayout isTransparent>
          <Labeler v-model:labels='labels' @submit='patchDocument' />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
