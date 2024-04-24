<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'

import axios from 'axios'
import { SERVER_URL } from '@/globals.js'
import { mdiAccount, mdiAsterisk, mdiDomain } from '@mdi/js'

import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const mainStore = useMainStore()

const form = reactive({
  email: 'makar1252@mail.ru',
  password: 'password',
  company: 'yandex'
})

const isRegister = ref(false)

const switchType = () => {
  isRegister.value ^= true
}

const router = useRouter()

const login = () => {
  axios
    .post(
      SERVER_URL + '/security/login',
      {
        email: form.email,
        password: form.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((result) => {
      mainStore.setUser({
        email: form.email,
        token: result?.data?.type + ' ' + result?.data?.accessToken,
        id: result?.data?.id
      })

      router.push('/models')
    })
    .catch((error) => {
      alert(error.message)
    })
}

const register = () => {
  axios
    .post(
      SERVER_URL + '/security/register',
      {
        email: form.email,
        password: form.password,
        company: form.company
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((result) => {
      console.log(result)
      login()
    })
    .catch((error) => {
      alert(error.message)
    })
}

const submit = () => {
  if (isRegister.value) {
    register()
  } else {
    login()
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField :label="isRegister ? 'Register' : 'Login'" help="Please enter your email">
          <FormControl v-model="form.email" :icon="mdiAccount" name="email" autocomplete="email" />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
          />
        </FormField>

        <FormField v-if="isRegister" label="Company" help="Please enter your company">
          <FormControl
            v-model="form.company"
            :icon="mdiDomain"
            name="company"
            autocomplete="organization"
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
            <BaseButton type="submit" color="info" :label="isRegister ? 'Register' : 'Login'" />
            <BaseButton
              type="button"
              color="danger"
              :label="isRegister ? 'To login' : 'To registration'"
              @click="switchType"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
