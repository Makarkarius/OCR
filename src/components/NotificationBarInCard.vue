<script setup>
import { colorsBgLight } from '@/colors.js'

defineProps({
  color: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col -mt-6 mb-3 -mr-[10px] -ml-[10px] animate-fade-in">
    <div :class="[colorsBgLight[color]]" class="rounded-t-2xl flex flex-col p-6 transition-colors">
      <slot />
    </div>
  </div>
</template>
