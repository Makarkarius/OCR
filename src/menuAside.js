import {
  mdiAccountCircle,
  mdiAlertCircle,
  mdiFileCompare,
  mdiLock,
  mdiMonitorDashboard,
  mdiResponsive,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiVectorSquarePlus,
  mdiViewList
} from '@mdi/js'

export default [
  {
    to: '/',
    icon: mdiMonitorDashboard,
    label: 'Dashboard'
  },
  {
    to: '/models',
    label: 'Models',
    icon: mdiFileCompare
  },
  {
    to: '/labeler',
    label: 'Labeler',
    icon: mdiVectorSquarePlus
  },
  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/error',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  }
]
