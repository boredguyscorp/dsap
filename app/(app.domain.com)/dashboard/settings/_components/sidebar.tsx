'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

const organizationMenuItems = [
  {
    title: 'General',
    href: '/',
    icon: Icons.settings
  },
  {
    title: 'Members',
    href: '/members',
    icon: Icons.user
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: Icons.billing
  }
] as const

export function SidebarNav() {
  const params = useParams() as { organizationId: string; businessId: string }
  const path = usePathname()

  // remove the organizationId and businessId from the path when comparing active links in sidebar
  const pathname = path?.replace(`/${params.organizationId}/settings`, '') || '/'

  const items = organizationMenuItems
  if (!items?.length) {
    return null
  }

  return (
    <nav className='grid items-start gap-2'>
      {items.map(({ href, icon, title }) => {
        const Icon = icon

        let fullPath = `/${params.organizationId}/settings`
        if (params.businessId) {
          fullPath += `/${params.businessId}`
        }
        fullPath += href

        return (
          href && (
            <Link key={href} href={fullPath}>
              <span
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent ',
                  pathname === href ? 'bg-accent font-medium' : 'transparent font-normal'
                )}
              >
                <Icon className='mr-2 h-4 w-4' />
                <span>{title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
