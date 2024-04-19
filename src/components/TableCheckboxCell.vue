<script setup>
import { ref, watch } from 'vue'

defineProps({
  type: {
    type: String,
    default: 'td'
  }
})

const checked = defineModel()

const emit = defineEmits(['checked'])

watch(checked, (newVal) => {
  emit('checked', newVal)
})
</script>

<template>
  <component :is="type" class="lg:w-1">
    <label class="checkbox">
      <input v-model="checked" type="checkbox" />
      <span class="check" />
    </label>
  </component>
</template>
