import { mdiLogout } from '@mdi/js'

export default [
  {
    isCurrentUser: true,
    // icon: mdiAccount,
    label: 'My Profile',
    to: '/profile'
  },
  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    isLogout: true
  }
]
