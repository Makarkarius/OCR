<script setup>
import UserList from '@/components/UserList.vue'
import { useMainStore } from '@/stores/main'
import { onBeforeMount } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import { useNotificationsStore } from '@/stores/notifications'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const fetchUsers = async () => {
  try {
    await mainStore.fetchAllUsers()
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

onBeforeMount(async () => {
  await fetchUsers()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox hasComponentLayout class='min-h-[80vh]'>
        <UserList :users='mainStore.users' withAll @update='fetchUsers' />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
