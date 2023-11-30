import { Icons } from '@/components/shared/icons'

export const appDashboardMenuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Icons.post
  },
  {
    title: 'Control Panel',
    href: '/cpanel',
    icon: Icons.settings
  },
  {
    title: 'Membership',
    href: '/membership',
    icon: Icons.user
  },
  {
    title: 'Convention',
    href: '/convention',
    icon: Icons.media
  },
  // {
  //   title: 'Registration',
  //   href: '/registration',
  //   icon: Icons.edit
  // },
  {
    title: 'Election',
    href: '/election',
    icon: Icons.post
  }
] as const
