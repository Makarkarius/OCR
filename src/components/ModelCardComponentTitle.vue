<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-2xl w-3/4 overflow-hidden whitespace-nowrap text-ellipsis">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>
