<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiTrashCan } from '@mdi/js'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  withAll: {
    type: Boolean,
    default: false
  },
  disabled: Boolean
})

const emit = defineEmits(['delete', 'update'])

const deleteUser = () => {
  emit('delete', props.user)
}

const updateRole = (role) => {
  const updatedUser = props.user
  updatedUser.role = role
  emit('update', updatedUser)
}
</script>

<template>
  <!--TODO: move upper to view-->
  <tr>
    <td class='border-b-0 lg:w-6'>
      <UserAvatar :username='user.name' class='w-24 h-24 mx-auto lg:w-6 lg:h-6' />
    </td>
    <td data-label='Name'>
      {{ user.surname + ' ' + user.name }}
    </td>
    <td data-label='Login'>
      {{ user.email }}
    </td>
    <template v-if='withAll'>
      <td data-label='Role'>
        <!--        <FormField>-->
        <!--          <FormControl-->
        <!--            type='select'-->
        <!--            :options='["", userRoles.user, userRoles.admin]'-->
        <!--            v-model='user.role'-->
        <!--            placeholder='Name'-->
        <!--            :disabled='disabled'-->
        <!--            @update:modelValue='updateRole'-->
        <!--          />-->
        <!--        </FormField>-->
        {{ user.role }}
      </td>
      <td data-label='Company'>
        {{ user.company }}
      </td>
      <td>
        <BaseButtons type='justify-start lg:justify-center' no-wrap>
          <BaseButton
            color='danger'
            :icon='mdiTrashCan'
            @click='deleteUser'
            :disabled='disabled'
            small
          />
        </BaseButtons>
      </td>
    </template>
  </tr>
</template>
