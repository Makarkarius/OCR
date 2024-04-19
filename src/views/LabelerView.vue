<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import Labeler from '@/components/Labeler.vue'

</script>

<template>
  <div>
    <LayoutAuthenticated>
      <SectionMain>
        <CardBox class="h-[80vh] max-h-[80vh]" hasComponentLayout>
          <Labeler />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
