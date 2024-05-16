<script setup>
import CardBox from '@/components/CardBox.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  assessor: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  event: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  }
})

</script>

<template>
  <CardBox class='mb-6 last:mb-0 md:last:mb-6'>
    <BaseLevel>
      <BaseLevel type='justify-start'>
        <UserAvatar class='w-12 h-12 mr-6' :username='assessor.name' />
        <div className='text-center md:text-left overflow-hidden'>
          <h4 className='text-xl text-ellipsis'>
            {{ assessor.name }} {{ event }}
          </h4>
          <p className='text-gray-500 dark:text-slate-400'>{{ date }} {{ assessor.login }}</p>
        </div>
      </BaseLevel>
    </BaseLevel>
  </CardBox>
</template>
