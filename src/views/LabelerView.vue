<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CardBox from '@/components/CardBox.vue'
import Labeler from '@/components/Labeler.vue'
import { useMainStore } from '@/stores/main'
import { useRoute, useRouter } from 'vue-router'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { ref } from 'vue'

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const labels = ref([])

const patchDocument = async () => {
  mainStore.document.id = route.params.id
  mainStore.document.isLabeled = true
  mainStore.document.labels = labels.value

  try {
    await mainStore.document.patch()
    console.log(mainStore.model)
    await router.push('/models/' + mainStore.model.id)
  } catch (err) {
    if (err.message) {
      console.log(err.message)
    } else {
      console.error(err)
    }
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
