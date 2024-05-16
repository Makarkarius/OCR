import { mdiAccountCircle, mdiChartBar, mdiFileCompare, mdiHumanQueue } from '@mdi/js'

const menuAsideUser = [
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/models',
    label: 'Models',
    icon: mdiFileCompare
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: mdiChartBar
  }
]

const menuAsideAdmin = [
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/models',
    label: 'Models',
    icon: mdiFileCompare
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: mdiChartBar
  },
  {
    to: '/users',
    label: 'Users',
    icon: mdiHumanQueue
  }
]

export {
  menuAsideUser,
  menuAsideAdmin
}

