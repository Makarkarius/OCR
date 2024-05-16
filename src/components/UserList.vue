<script setup>
import { ref } from 'vue'
import UserSearch from '@/components/UserSearch.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiPlus } from '@mdi/js'
import UserListItem from '@/components/UserListItem.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import { useMainStore } from '@/stores/main'
import { useNotificationsStore } from '@/stores/notifications'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const props = defineProps({
  withSearch: {
    type: Boolean,
    default: false
  },
  withAll: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update'])

const users = defineModel('users', {
  type: Array,
  required: true
})

const allUsers = defineModel('allUsers', {
  type: Array,
  default: []
})

const isUserSearchModalActive = ref(false)

const isDeleteModalActive = ref(false)
const selectedUser = ref(null)

const showDeleteModal = (user) => {
  selectedUser.value = user
  isDeleteModalActive.value = true
}

const showSearchModal = () => {
  isUserSearchModalActive.value = true
}

const deleteModel = async (user) => {
  try {
    await selectedUser.value.delete()
  } catch (err) {
    notificationsStore.renderError(err)
  }
  emit('update')
}
</script>

<template>
  <div class='relative rounded-md overflow-hidden'>
    <UserSearch
      v-if='withSearch'
      v-model:isVisible='isUserSearchModalActive'
      v-model:selectedUsers='users'
      v-model:allUsers='allUsers'
    />

    <CardBoxModal
      v-if='withAll'
      v-model='isDeleteModalActive'
      button='danger'
      button-label='Yes'
      :hasCancel='true'
      :title='`Are you sure you want to delete user ` + selectedUser?.email'
      @confirm='deleteModel'
    />

    <BaseButton
      v-if='withSearch'
      color='contrast'
      :icon='mdiPlus'
      @click='showSearchModal'
      class='size-9 absolute right-1.5 top-1.5 z-10'
    />

    <table>
      <thead>
      <tr>
        <th class='lg:w-6'>
        </th>
        <th>Name</th>
        <th>Login</th>
        <template v-if='withAll'>
          <th>Role</th>
          <th>Company</th>
          <th />
        </template>
      </tr>
      </thead>
      <tbody>
      <UserListItem
        :user='user'
        v-for='user in users'
        :key='user.id'
        :withAll='withAll'
        @delete='showDeleteModal'
        :disabled='user.id === mainStore.user.id'
      />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tr {
  @apply text-wrap break-all;
}
</style>
