<script setup>
import { ref } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserSearch from '@/components/UserSearch.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiPlus } from '@mdi/js'

const assessors = defineModel('assessors', {
  default: [],
  type: Array
})

const isUserSearchModalActive = ref(false)
</script>

<template>
  <div class='rounded-md border-2'>
    <UserSearch
      v-model:isVisible='isUserSearchModalActive'
      v-model:selectedUsers='assessors'
    />

    <BaseButton
      color='contrast'
      :icon='mdiPlus'
      @click='isUserSearchModalActive = true'
      class='absolute right-3 top-9 z-10'
    />

    <table>
      <thead>
      <tr>
        <th class='lg:w-6'>
        </th>
        <th>Name</th>
        <th>Login</th>
        <!-- <th /> -->
      </tr>
      </thead>
      <tbody>
      <tr v-for='assessor in assessors' :key='assessor.id'>
        <td class='border-b-0 lg:w-6'>
          <UserAvatar :username='assessor.name' class='w-24 h-24 mx-auto lg:w-6 lg:h-6' />
        </td>
        <td data-label='Name'>
          {{ assessor.surname + ' ' + assessor.name }}
        </td>
        <td data-label='Login'>
          {{ assessor.email }}
        </td>
        <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="removeAssessor(assessors, (item) => { return assessor.id === item.id })
              "
            />
          </BaseButtons>
        </td> -->
      </tr>
      </tbody>
    </table>
  </div>
</template>
