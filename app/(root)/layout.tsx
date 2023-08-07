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

      <section className='relative flex min-h-[calc((100%-5rem))] flex-col items-center justify-center text-center text-white '>
        <div className='video-docker absolute left-0 top-0 h-full w-full overflow-hidden'>
          <video autoPlay muted loop className='absolute z-10 min-h-full w-auto min-w-full max-w-none'>
            <source src='/_static/video/banner-video.mp4' type='video/webm' />
          </video>
        </div>

        <div className='video-content z-10 space-y-2'>
          <h1 className='m-5 rounded-sm bg-teal-500 bg-opacity-50 p-3 text-4xl font-bold md:p-5 md:text-5xl xl:text-7xl'>
            "One Cause, One Voice, One Future"
          </h1>
          <h3 className='text-[20px] font-light md:text-2xl xl:text-3xl'>{siteConfig.name}</h3>
        </div>

        <div className='z-10 mt-5 flex justify-center space-x-4 '>
          <Link href={url.app.signup} className={cn(buttonVariants({ variant: 'main', size: 'lg' }), 'min-h-[100px]')}>
            Become a Member
          </Link>
        </div>
      </section>

      <main className='relative'>{children}</main>

      <SiteFooter className='mt-16' />
    </div>
  )
}
