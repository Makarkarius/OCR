<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiAsterisk, mdiDomain } from '@mdi/js'

import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'

const mainStore = useMainStore()
const router = useRouter()

const form = reactive({
  email: 'makar1252@mail.ru',
  password: 'password',
  passwordSubmit: 'password',
  company: 'yandex'
})

const isRegister = ref(false)
const isAuthError = ref(false)
const authError = ref('')

const switchType = () => {
  isRegister.value ^= true
}

const renderError = (message) => {
  authError.value = message
  isAuthError.value = true
}

const submit = async () => {
  try {
    if (isRegister.value) {
      if (form.password !== form.passwordSubmit) {
        renderError('Passwords does not match!')
        return
      }
      await mainStore.user.register('Kal', 'Kalich', form.email, form.password, form.company)
    } else {
      await mainStore.user.login(form.email, form.password, form.company)
    }
    await router.push('/models')
  } catch (e) {
    renderError(e.message)
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot='{ cardClass }' bg='purplePink'>
      <CardBox :class='cardClass' is-form @submit.prevent='submit'>
        <NotificationBarInCard color='danger' v-if='isAuthError'>
          <span><b class='capitalize'>{{ authError }}</b></span>
        </NotificationBarInCard>

        <FormField :label="isRegister ? 'Register' : 'Login'" help='Enter email'>
          <FormControl v-model='form.email' :icon='mdiAccount' name='email' autocomplete='email' />
        </FormField>

        <FormField label='Password' help='Enter password'>
          <FormControl
            v-model='form.password'
            :icon='mdiAsterisk'
            type='password'
            name='password'
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
          />
        </FormField>

        <FormField v-if='isRegister' help='Submit password'>
          <FormControl
            v-model='form.passwordSubmit'
            :icon='mdiAsterisk'
            type='password'
            name='password-submit'
            autocomplete='new-password'
          />
        </FormField>

        <FormField v-if='isRegister' label='Company' help='Enter company'>
          <FormControl
            v-model='form.company'
            :icon='mdiDomain'
            name='company'
            autocomplete='organization'
          />
        </FormField>

        <!-- <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        /> -->

        <template #footer>
          <BaseButtons>
            <BaseButton type='submit' color='info' :label="isRegister ? 'Register' : 'Login'" />
            <BaseButton
              type='button'
              color='danger'
              :label="isRegister ? 'To login' : 'To registration'"
              @click='switchType'
            />
          </BaseButtons>
        </template>

        <!-- <NotificationBar color="danger" :icon="mdiAlertCircle" :outline="notificationsOutline">
          <b>Danger state</b>. NotificationBar
          <template #right>
            <BaseButton
              label="Button"
              :color="notificationsOutline ? 'danger' : 'white'"
              :outline="notificationsOutline"
              rounded-full
              small
            />
          </template>
        </NotificationBar> -->
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
