'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { useTheme } from 'next-themes'
import { businessMenuItems, organizationMenuItems } from '@/constants/menu'

interface NavTabsProps {
  organizationData: Record<string, any>[]
  // align: 'center' | 'start' | 'end'
}

export default function NavTabs({ organizationData = [] }: NavTabsProps) {
  const path = usePathname()
  const params = useParams()
  const { theme } = useTheme()

  if (!params || !path) return

  const organizationParamData = useMemo(() => {
    if (params.organizationId === 'dashboard') {
      return organizationData.find((item) => item.isDefault === true)
    }

    return organizationData.find((item) => item.id === params.organizationId)
  }, [params.organizationId, organizationData])

  const organizationSlugId = params.organizationId === 'dashboard' ? organizationParamData?.id : params.organizationId

  const pathname = path.replace(`/${organizationSlugId}`, '').replace(`/${params.businessId}`, '') || '/'

  const items = params.businessId ? businessMenuItems : organizationMenuItems
  if (!items?.length) {
    return null
  }

  return (
    <>
      <div className='-mb-0.5 mt-2 flex h-12 items-center justify-start space-x-2 overflow-hidden overflow-x-auto  bg-transparent '>
        {items.map(({ title, href }) => {
          let fullPath = `/${organizationSlugId}`
          if (params.businessId) {
            fullPath += `/${params.businessId}`
          }
          fullPath += href

          let isCurrPath = pathname === '/dashboard' || pathname === href
          if (href !== '/') {
            isCurrPath = pathname.includes(href)
          }

          return (
            <Link
              key={href}
              href={fullPath}
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
