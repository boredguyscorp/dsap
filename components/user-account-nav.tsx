'use client'

import Link from 'next/link'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
// import { UserAvatar } from '@/components/user-avatar'
import dynamic from 'next/dynamic'
import { appDashboardMenuItems } from '@/constants/menu'
import { useParams, usePathname } from 'next/navigation'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAvatar = dynamic(() => import('@/components/user-avatar'), {
  ssr: false,
  loading: () => <div className='h-8 w-8 animate-pulse rounded-full bg-muted-foreground/70' />
})

export function UserAccountNav({ user }: UserAccountNavProps) {
  const path = usePathname()

  const params = useParams()

  if (!params || !path) return

  const pathname = path.replace(`/${params.organizationId}`, '').replace(`/${params.businessId}`, '') || '/'

  // const organizationParamData = useMemo(() => {
  //   if (params.organizationId === 'dashboard') {
  //     return organizationData.find((item) => item.isDefault === true)
  //   }

  //   return organizationData.find((item) => item.id === params.organizationId)
  // }, [params.organizationId, organizationData])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* <span className='flex h-8 w-8 items-center justify-center rounded-full bg-red-500'>&nbsp;</span> */}
        <UserAvatar user={{ name: user.name || null, image: user.image || null }} className='h-8 w-8' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && <p className='w-[200px] truncate text-sm text-muted-foreground'>{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        {appDashboardMenuItems.map((menu) => {
          // const pathRef = menu.href === '/' ? '/dashboard' : params.organizationId + menu.href

          // let fullPath = `/${params.organizationId}${menu.href}`

          return (
            <DropdownMenuItem key={menu.href} asChild>
              <Link href={menu.href}>{menu.title}</Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/user/account'>Manage Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/`
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
