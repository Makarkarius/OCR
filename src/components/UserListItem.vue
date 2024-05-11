<script setup>
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

</script>

<template>
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
  </tr>
</template>
