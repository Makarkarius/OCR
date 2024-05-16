<script setup>
import { watch } from 'vue'

defineProps({
  type: {
    type: String,
    default: 'td'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dataLabel: {
    type: String,
    default: 'HHEHEHE'
  }
})

const checked = defineModel()

const emit = defineEmits(['checked'])

watch(checked, (newVal) => {
  emit('checked', newVal)
})
</script>

<template>
  <component :is='type' class='lg:w-1' :data-label='dataLabel'>
    <label class='checkbox'>
      <input v-model='checked' type='checkbox' :disabled='disabled' />
      <span class='check' :class='disabled ? "cursor-default" : "cursor-pointer"' />
    </label>
  </component>
</template>
