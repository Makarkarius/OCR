<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useMainStore} from '@/stores/main'
import CardBox from '@/components/CardBox.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';

const mainStore = useMainStore()

const usersModel = defineModel('users', {
  type: Array
})

const isVisible = defineModel('isVisible', {
  type: Boolean
})

const emit = defineEmits(['update:modelValue', 'close'])

const confirm = () => {
  usersModel.value = checkedRows.value
  close()
}

const cancel = () => {
  close()
}

const close = () => {
  isVisible.value = false
  emit('close')
}

const users = computed(() => {
  return mainStore.users.map((user) => {
    user.checked = false
    return user
  })
})

let assessors = ref([])

const checkedRows = ref([])

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, assessor) => {
  if (isChecked) {
    checkedRows.value.push(assessor);
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === assessor.id);
  }
}

const searchText = ref("")

const search = (event) => {
  console.log(assessors)
  let normalized = event.toLowerCase();

  assessors.value = users.value.filter(client => {
    const name = client.name.toLowerCase();
    return name.includes(normalized);
  })
}

const keyHandler = (e) => {
  if (e.key === 'Escape' && isVisible.value) {
    cancel()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', keyHandler)
  await mainStore.fetchUsers()
  assessors.value = users.value
})

onUnmounted(() => {
  window.removeEventListener('keydown', keyHandler)
})

</script>

<template>
  <OverlayLayer v-show="isVisible" @overlay-click="cancel">
    <CardBox
      class="shadow-lg h-modal w-8/12 md:w-1/2 lg:w-7/12 z-50"
      is-modal
      :has-component-layout="false"
      :has-table="true"
    >

      <FormField class="mb-0 py-0 rounded-2xl overflow-hidden">
        <FormControl v-model="searchText" placeholder="Super cool model" borderless
                     @update:model-value="search($event)"/>
      </FormField>

      <div class="overflow-scroll relative min-h-[50h] max-h-[50vh]">
        <table>
          <tbody>
          <tr v-for="client in assessors" :key="client.id">
            <TableCheckboxCell v-model="client.checked" @checked="checked($event, client)"/>
            <td data-label="Name">
              {{ client.name }}
            </td>
            <td data-label="Login">
              {{ client.surname }}
            </td>
            <td data-label="ID">
              {{ client.id }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <BaseButtons>
          <BaseButton label="Confirm" color="info" @click="confirm"/>
          <BaseButton label="Cancel" color="danger" outline @click="cancel"/>
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
