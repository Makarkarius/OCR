<script setup>
import { computed } from 'vue'
import { gradientBgPinkRed, gradientBgPurplePink } from '@/colors.js'

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: (value) => ['purplePink', 'pinkRed'].includes(value)
  }
})

const colorClass = computed(() => {
  switch (props.bg) {
    case 'purplePink':
      return gradientBgPurplePink
    case 'pinkRed':
      return gradientBgPinkRed
  }

  return ''
})
</script>

<template>
  <div class='flex min-h-screen items-center justify-center' :class='colorClass'>
    <slot cardClass='w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl' />
  </div>
</template>
