<script setup>
import { useMainStore } from '@/stores/main'
import UserAvatar from '@/components/UserAvatar.vue'

const mainStore = useMainStore()
</script>

<template>
  <UserAvatar :username="mainStore.user.name" :avatar="mainStore.user.avatarURL">
    <slot />
  </UserAvatar>
</template>
