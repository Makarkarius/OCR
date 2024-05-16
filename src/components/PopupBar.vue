<script setup>
import { computed } from 'vue'
import { mdiClose } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { colorsBgLight } from '@/colors'
import BaseIcon from '@/components/BaseIcon.vue'

const notificationsStore = useNotificationsStore()

const notificationColor = computed(() =>
  colorsBgLight[notificationsStore.notification.type]
)

const notification = computed(() => {
  return notificationsStore.notification
})

</script>

<template>
  <div class='custom fixed z-20 pointer-events-none'>
    <transition name='pop'>
      <div
        v-if='notification.visible'
        :class='notificationColor'
        class='min-w-[14vw] w-fit mx-auto p-1.5 border rounded-xl transition-colors duration-250 flex justify-between items-center gap-3 pointer-events-auto'
      >
        <div class='flex flex-row items-center shake'>
          <BaseIcon
            v-if='notification.icon'
            :path='notification.icon'
            w='w-10 md:w-5'
            h='h-10 md:h-5'
            size='24'
            class='md:mr-2'
          />
          <span class='text-left py-1.5'>{{ notification.text }}</span>
        </div>
        <BaseButton :icon='mdiClose' small rounded-full color='white' @click='notification.hide()' />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom {
  width: calc(100% - 3rem);
}

@media (min-width: 1280px) {
  .custom {
    width: calc(100% - 18rem);
  }
}

.pop-enter-active {
  animation: pop-in 0.3s;
}

.pop-leave-active {
  animation: pop-in 0.3s reverse;
}

@keyframes pop-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
