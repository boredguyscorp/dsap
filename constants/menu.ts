import { Icons } from '@/components/shared/icons'

export const organizationMenuItems = [
  {
    title: 'Business',
    href: '/',
    icon: Icons.post
  },
  {
    title: 'Apps',
    href: '/apps',
    icon: Icons.laptop
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Icons.settings
  }
] as const

export const businessMenuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Icons.pieChart
  },
  {
    title: 'Location',
    href: '/location',
    icon: Icons.map
  },
  {
    title: 'API Key',
    href: '/api-key',
    icon: Icons.key
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Icons.settings
  }
] as const
