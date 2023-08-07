import SiteFooter from '@/components/footer'

// import { LandingNav } from './_components/landing-nav'
import { LandingNav } from './_components/landing-nav'
import { getCurrentUser } from '@/lib/session'
import HomePageWrapper from '@/components/shared/home-page-wrapper'
import Link from 'next/link'
import url from '@/constants/url'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '../config'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: MarketingLayoutProps) {
  // CHECK IF USER EXIST.. THEN REDIRECT TO DASHBOARD
  // if (userId) {
  //   const organization = await db.organization.findFirst({
  //     where: {
  //       userId
  //     }
  //   })

  //   if (organization) {
  //     redirect(`/${organization.id}`)
  //   }
  // }

  const user = await getCurrentUser()

  return (
    <div className='flex min-h-screen flex-col'>
      {/* <HomePageWrapper> */}
      <header className='supports-backdrop-blur:bg-background/60 fixed top-0 z-40 w-full border-b bg-background/95 px-3 py-2 backdrop-blur 2xl:px-20'>
        <LandingNav userId={user?.id} />
      </header>
      {/* </HomePageWrapper> */}

      <main className='relative'>{children}</main>

      <SiteFooter className='mt-16' />
    </div>
  )
}
