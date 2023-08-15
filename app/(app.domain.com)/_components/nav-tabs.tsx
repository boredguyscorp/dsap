'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { useTheme } from 'next-themes'
import { appDashboardMenuItems } from '@/constants/menu'

export default function NavTabs() {
  const path = usePathname()

  const params = useParams()
  const { theme } = useTheme()

  if (!params || !path) return

  const parentPath = '/' + path.split('/')[1]

  // const organizationSlugId = 'dashboard'

  // const pathname = path.replace(`/${organizationSlugId}`, '').replace(`/${params.businessId}`, '') || '/'

  const items = appDashboardMenuItems
  if (!items?.length) {
    return null
  }

  return (
    <>
      <div className='-mb-0.5 mt-2 flex h-12 items-center justify-start space-x-2 overflow-hidden overflow-x-auto  bg-transparent '>
        {items.map(({ title, href }) => {
          let isCurrPath = parentPath === href
          // if (href !== '/') {
          //   console.log({ path, href })
          //   isCurrPath = path.includes(href)
          // }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'border-b-2  border-transparent p-1 font-normal hover:text-black',
                isCurrPath && 'border-black font-medium ',
                isCurrPath && theme === 'dark' && 'border-white ',
                theme === 'dark' && 'hover:text-white'
              )}
            >
              <div className='rounded-md px-3 py-2 transition-all duration-75 hover:bg-accent '>
                <p className='whitespace-nowrap text-sm'>{title}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
