<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CardBox from '@/components/CardBox.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { damerauLevenshtein } from '@/misc'

const allUsers = defineModel('allUsers', {
  type: Array,
  required: true
})

const selectedUsers = defineModel('selectedUsers', {
  type: Array,
  required: true
})

const isVisible = defineModel('isVisible', {
  type: Boolean
})

const emit = defineEmits(['update:modelValue'])

onMounted(async () => {
  window.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  window.removeEventListener('keydown', keyHandler)
})

const confirm = () => {
  // selectedUsers.value = checkedRows.value
  close()
}

const cancel = () => {
  close()
}

const close = () => {
  isVisible.value = false
}

const users = computed({
  get: () => {
    let result = allUsers.value.map((user) => {
      const found = selectedUsers.value.find((selectedUser) => {
        return selectedUser.id === user.id
      })
      user.checked = !!found
      user.filtered = false
      return user
    })
    result = result.sort((a, b) => {
      if (a.surname !== b.surname) {
        return a.surname > b.surname ? 1 : -1
      }
      return 0
    })
    return result
  },
  set: () => {
  }
})

const check = (isChecked, user) => {
  if (isChecked) {
    selectedUsers.value.push(user)
  } else {
    selectedUsers.value = selectedUsers.value.filter((selectedUser) => {
      return selectedUser.id !== user.id
    })
  }
}

const searchText = ref('')

const search = () => {
  const normalizedSearch = searchText.value.toLowerCase()

  users.value.map(user => {
    const name = user.name.toLowerCase()
    const surname = user.surname.toLowerCase()

    const searchCoef = 30
    const nameDist = damerauLevenshtein(name, normalizedSearch) / (1 + normalizedSearch.length / searchCoef)
    const surnameDist = damerauLevenshtein(surname, normalizedSearch) / (1 + normalizedSearch.length / searchCoef)

    user.filtered =
      nameDist > name.length &&
      surnameDist > surname.length
  })
}

const keyHandler = (e) => {
  if (e.key === 'Escape' && isVisible.value) {
    cancel()
  }
}

</script>

<template>
  <OverlayLayer v-show='isVisible' @overlay-click='cancel'>
    <CardBox
      class='shadow-lg h-modal max-w-[90vw] z-50'
      is-modal
      :has-component-layout='false'
      :has-table='true'
    >

      <FormField class='mb-0 py-0 rounded-2xl overflow-hidden'>
        <FormControl v-model='searchText' placeholder='Super cool model' borderless
                     @update:model-value='search($event)' />
      </FormField>

      <div class='overflow-scroll relative min-h-[50h] max-h-[50vh]'>
        <table>
          <tbody>
          <tr v-for='user in users' :key='user.id'>
            <!--            <div v-if='!user.filtered'>-->
            <TableCheckboxCell v-model='user.checked' @checked='check($event, user)' />
            <td data-label='Name'>
              {{ user.surname + ' ' + user.name }}
            </td>
            <td data-label='Login'>
              {{ user.email }}
            </td>
            <!--            <td data-label='ID'>-->
            <!--              {{ user.id }}-->
            <!--            </td>-->
            <!--            </div>-->
          </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <BaseButtons>
          <BaseButton label='Confirm' color='info' @click='confirm' />
          <BaseButton label='Cancel' color='danger' outline @click='cancel' />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>

<style scoped>
td {
  @apply text-wrap
}
</style>
