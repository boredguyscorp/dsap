'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { LucideProps } from 'lucide-react'
import { Icons } from '@/components/shared/icons'
import logo from 'public/images/logo.png'

import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/app/config'
import Image from 'next/image'

const font = Poppins({
  weight: '700',
  subsets: ['latin']
})
export default function Logo({ size = 100, textSize }: { size?: number; textSize?: string }) {
  const { theme } = useTheme()

  return (
    <div className='flex items-center space-x-2'>
      <Image src={logo} width={size || 100} height={size || 100} alt='dsap logo' className='mr-2' />

      {/* <Icons.logo className={size || 'h-8 w-8'} circleColor={theme || 'light'} /> */}
      {/* <span className={cn('hidden text-2xl font-black sm:block', font.className, textSize && 'text-lg')}>{siteConfig.name}</span> */}
    </div>
  )
}
