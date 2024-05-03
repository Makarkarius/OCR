<script setup>
import {ref} from 'vue'
import {mdiPlus} from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserSearch from '@/components/UserSearch.vue'

const assessorsModel = defineModel("assessors", {
  default: [],
  type: Array
})

const isUserSearchModalActive = ref(false)

</script>

<template>
  <div>
    <UserSearch v-model:isVisible="isUserSearchModalActive" v-model:users="assessorsModel"/>

    <table>
      <thead>
      <tr>
        <th>
          <BaseButton
            color="info"
            :icon="mdiPlus"
            small
            @click="isUserSearchModalActive = true"
          />
        </th>
        <th>Name</th>
        <th>Login</th>
        <!-- <th /> -->
      </tr>
      </thead>
      <tbody>
      <tr v-for="assessor in assessorsModel" :key="assessor.id">
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :username="assessor.name" class="w-24 h-24 mx-auto lg:w-6 lg:h-6"/>
        </td>
        <td data-label="Name">
          {{ assessor.name }}
        </td>
        <td data-label="Login">
          {{ assessor.login }}
        </td>
        <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="removeAssessor(assessorsModel, (item) => { return assessor.id === item.id })
              "
            />
          </BaseButtons>
        </td> -->
      </tr>
      </tbody>
    </table>
  </div>
</template>
