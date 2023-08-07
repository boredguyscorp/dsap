import type { Route } from 'next'
import url from '@/constants/url'

export const siteConfig = {
  code: 'DSAP',
  name: 'Drugstore Association of the Philippines Inc.',
  description: '"One Cause, One Voice, One Future"',
  url
}

export const navItems = [
  {
    href: '/event',
    title: 'Event',
    disabled: false
  },
  {
    href: '/convention',
    title: 'Convention',
    disabled: false
  },
  {
    href: '/news',
    title: 'News',
    disabled: false
  },
  {
    href: '/about-us',
    title: 'About',
    disabled: false
  },
  {
    href: '/contact-us',
    title: 'Contact',
    disabled: false
  }
] satisfies { href: Route; title: string; disabled: boolean }[]
