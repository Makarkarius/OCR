<script setup>
import BaseIcon from '@/components/BaseIcon.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  buttons: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: "https://i.pinimg.com/564x/e3/1c/62/e31c62a67764f41759856aa2d4bed57c.jpg"
  }
})

const emit = defineEmits(['button-click'])

const buttonClick = (event) => {
  emit('button-click', event)
}

</script>

<template>
  <div class="flex items-stretch border-b border-gray-100 dark:border-slate-800 overflow-hidden relative">
    <img :src="imageUrl" class="object-cover h-full grayscale absolute m-auto top-0 left-0" />
    <div class="flex items-center py-3 grow font-bold" :class="[icon ? 'px-4' : 'px-6']">
      {{ title }}
    </div>
    <template v-for="btn in buttons">
      <button
        v-if="buttonIcon"
        class="flex items-center p-2 justify-center ring-blue-700 focus:ring"
        @click="buttonClick"
      >
        <BaseIcon :path="buttonIcon" />
      </button>
    </template>
  </div>
</template>
