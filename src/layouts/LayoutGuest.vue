<script setup>
import { onMounted, ref } from 'vue'
import { isAuthentificated } from '@/globals.js'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'

const mainStore = useMainStore()

const router = useRouter()

onMounted(() => {
    if (isAuthentificated(mainStore.user)) {
        router.push("/models")
    }
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
    <slot />
  </div>
</template>
