<script setup>
import { mdiBackburger, mdiForwardburger, mdiMenu } from '@mdi/js'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import menuNavBar from '@/menuNavBar.js'
import BaseIcon from '@/components/BaseIcon.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import { useMainStore } from '@/stores/main'
import { userRoles } from '@/config'
import { menuAsideAdmin, menuAsideUser } from '@/menuAside'

const layoutAsidePadding = 'xl:pl-60'

const mainStore = useMainStore()

const router = useRouter()

const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

const menuClick = (event, item) => {
  if (item.isLogout) {
    mainStore.user.reset()
    router.push('/login')
  }
}

const menuAside = computed(() => {
  return mainStore.user.role === userRoles.admin ? menuAsideAdmin : menuAsideUser
})

</script>

<template>
  <div
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded
    }"
  >
    <div
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class='pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100'
    >
      <NavBar
        :menu='menuNavBar'
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        @menu-click='menuClick'
      >
        <NavBarItemPlain
          display='flex lg:hidden'
          @click.prevent='isAsideMobileExpanded = !isAsideMobileExpanded'
        >
          <BaseIcon :path='isAsideMobileExpanded ? mdiBackburger : mdiForwardburger' size='24' />
        </NavBarItemPlain>
        <NavBarItemPlain display='hidden lg:flex xl:hidden' @click.prevent='isAsideLgActive = true'>
          <BaseIcon :path='mdiMenu' size='24' />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded='isAsideMobileExpanded'
        :is-aside-lg-active='isAsideLgActive'
        :menu='menuAside'
        @menu-click='menuClick'
        @aside-lg-close-click='isAsideLgActive = false'
      />
      <slot />
      <FooterBar></FooterBar>
    </div>
  </div>
</template>
