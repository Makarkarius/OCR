<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan, mdiPlus } from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';

const usersModel = defineModel('users')
const show = defineModel('show')

const emit = defineEmits(['update:modelValue', 'close'])

const confirm = () => {
  usersModel.value = checkedRows.value
  close()
}

const cancel = () => {
  close()
}

const close = () => {
  show.value = false
  emit('close')
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && show.value) {
    cancel()
  }
})

const mainStore = useMainStore()

const clients = computed(() => {
  return mainStore.clients.map((client) => {
    client.checked = false;
    return client;
  })
})

const assessors = ref(clients.value)

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
  let normalized = event.toLowerCase();

  assessors.value = clients.value.filter(client => { 
    const name = client.name.toLowerCase(); 
    return name.includes(normalized);
  })
}

</script>

<template>
  <OverlayLayer v-show="show" @overlay-click="cancel">
    <CardBox
      v-show="show"
      class="shadow-lg h-modal w-8/12 md:w-1/2 lg:w-7/12 z-50"
      is-modal
      :has-component-layout="false"
      :has-table="true"
    >

      <FormField class="mb-0 py-0 rounded-2xl overflow-hidden">
        <FormControl v-model="searchText" placeholder="Super cool model" borderless @update:model-value="search($event)" />
      </FormField>

      <div class="overflow-scroll relative h-full max-h-[50vh]">
        <table>
          <tbody>
            <tr v-for="client in assessors" :key="client.id">
              <TableCheckboxCell v-model="client.checked" @checked="checked($event, client)" />
              <td data-label="Name">
                {{ client.name }}
              </td>
              <td data-label="Login">
                {{ client.login }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <BaseButtons>
          <BaseButton label="Confirm" color="info" @click="confirm" />
          <BaseButton label="Cancel" color="danger" outline @click="cancel" />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
