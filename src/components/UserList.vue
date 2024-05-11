<script setup>
import { ref } from 'vue'
import UserSearch from '@/components/UserSearch.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiPlus } from '@mdi/js'
import UserListItem from '@/components/UserListItem.vue'

const props = defineProps({
  withSearch: {
    type: Boolean,
    default: false
  }
})

const constUsers = defineModel('constUsers', {
  type: Array,
  default: []
})

const users = defineModel('users', {
  type: Array,
  required: true
})

const allUsers = defineModel('allUsers', {
  type: Array,
  default: []
})

const isUserSearchModalActive = ref(false)
</script>

<template>
  <div class='relative rounded-md overflow-hidden'>
    <UserSearch
      v-if='withSearch'
      v-model:isVisible='isUserSearchModalActive'
      v-model:selectedUsers='users'
      v-model:allUsers='allUsers'
    />

    <BaseButton
      v-if='withSearch'
      color='contrast'
      :icon='mdiPlus'
      @click='isUserSearchModalActive = true'
      class='absolute right-2.5 top-2.5 z-10'
    />

    <table>
      <thead>
      <tr>
        <th class='lg:w-6'>
        </th>
        <th>Name</th>
        <th>Login</th>
      </tr>
      </thead>
      <tbody>
      <UserListItem :user='user' v-for='user in constUsers' :key='user.id' />
      <UserListItem :user='user' v-for='user in users' :key='user.id' />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tr {
  @apply text-wrap break-all;
}
</style>
