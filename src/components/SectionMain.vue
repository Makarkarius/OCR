<script setup>
import { containerMaxW } from '@/config.js'
import PopupBar from '@/components/PopupBar.vue'</script>

<template>
  <section class='relative p-6' :class='containerMaxW'>
    <PopupBar />
    <slot />
  </section>
</template>
