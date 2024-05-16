import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mdiAlertCircleOutline, mdiCheckCircleOutline } from '@mdi/js'
import { UnauthorizedError } from '@/errors'
import { capitalize } from '@/misc'
import { notificationExpirationTime } from '@/config'

export const useNotificationsStore = defineStore('notifications', () => {
  const types = {
    white: 'white',
    light: 'light',
    dark: 'contrast',
    info: 'info',
    success: 'success',
    danger: 'danger',
    warning: 'warning'
  }

  class Notification {
    constructor() {
      this.visible = false
      this.timeoutID = null
      this.reset()
    }

    reset() {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }

      this.text = ''
      this.type = types.info
      this.icon = ''
      this.timeoutID = null
    }

    show(text = '', type = types.info, icon = '', timeout = 0) {
      this.visible = true
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
        this.timeoutID = null
      }

      this.text = text
      this.type = type
      this.icon = icon

      if (!icon) {
        switch (type) {
          case types.success:
            this.icon = mdiCheckCircleOutline
            break
          case types.info:
          case types.warning:
          case types.danger:
            this.icon = mdiAlertCircleOutline
            break
        }
      }

      if (timeout > 0) {
        this.timeoutID = setTimeout(() => {
          this.hide()
        }, timeout)
      }
    }

    hide() {
      this.visible = false
      this.reset()
    }
  }

  const notification = ref(new Notification())

  const renderError = (err) => {
    let errText = 'Something went wrong!'
    if (err instanceof UnauthorizedError) {
      errText = 'Unauthorized!'
    } else if (err.message) {
      errText = err.message
    }

    notification.value.show(capitalize(errText), types.danger, mdiAlertCircleOutline, 8000)
  }

  const renderMsg = (msg, type = '', icon = '', timeout = notificationExpirationTime) => {
    notification.value.show(capitalize(msg), type, icon, timeout)
  }

  const hide = () => {
    notification.value.hide()
  }

  return {
    notification,
    types,
    hide,
    renderError,
    renderMsg
  }
})
