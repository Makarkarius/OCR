<script setup>
import { reactive } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiAsterisk, mdiFormTextboxPassword, mdiMail } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useNotificationsStore } from '@/stores/notifications'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const profileForm = reactive({
  name: mainStore.user.name,
  surname: mainStore.user.surname,
  email: mainStore.user.email
})

const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

const updateUser = async () => {
  try {
    await mainStore.user.patch({
      email: profileForm.email,
      name: profileForm.name,
      surname: profileForm.surname
    })
    notificationsStore.renderMsg('Profile was updated!', notificationsStore.types.success)
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

const updatePassword = async () => {
  try {
    if (passwordForm.password !== passwordForm.password_confirmation) {
      notificationsStore.renderError(new Error('Passwords does not match!'))
      return
    }
    if (passwordForm.password.length === 0) {
      notificationsStore.renderError(new Error('Password can\'t be empty!'))
      return
    }

    await mainStore.user.patchPassword(passwordForm.password_current, passwordForm.password)

    passwordForm.password_current = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''

    notificationsStore.renderMsg('Password was updated!', notificationsStore.types.success)
  } catch (err) {
    notificationsStore.renderError(err)
  }
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <CardBox is-form @submit.prevent=''>

          <FormField label='Name' help='Your name'>
            <FormControl
              v-model='profileForm.name'
              :icon='mdiAccount'
              name='username'
              required
              autocomplete='given-name'
            />
          </FormField>
          <FormField label='Surname' help='Your surname'>
            <FormControl
              v-model='profileForm.surname'
              :icon='mdiAccount'
              name='username'
              required
              autocomplete='family-name'
            />
          </FormField>
          <FormField label='E-mail' help='Your e-mail'>
            <FormControl
              v-model='profileForm.email'
              :icon='mdiMail'
              type='email'
              name='email'
              required
              autocomplete='email'
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton color='info' type='submit' label='Submit' @click='updateUser' />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent=''>
          <FormField label='Current password' help='Your current password'>
            <FormControl
              v-model='passwordForm.password_current'
              :icon='mdiAsterisk'
              name='password_current'
              type='password'
              required
              autocomplete='current-password'
            />
          </FormField>

          <FormField label='New password' help='New password'>
            <FormControl
              v-model='passwordForm.password'
              :icon='mdiFormTextboxPassword'
              name='password'
              type='password'
              required
              autocomplete='new-password'
            />
          </FormField>

          <FormField label='Confirm password' help='New password one more time'>
            <FormControl
              v-model='passwordForm.password_confirmation'
              :icon='mdiFormTextboxPassword'
              name='password_confirmation'
              type='password'
              required
              autocomplete='new-password'
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type='submit' color='info' label='Submit' @click='updatePassword' />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
