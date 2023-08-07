import { notFound, redirect } from 'next/navigation'

import DashboardNavMain from './_components/dashboard-nav-main'
import { getOrganizationData } from '@/actions/business'

import { OrganizationForm } from './_components/create-organization-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import NoRecordPlaceholder from './_components/no-record-placeholder'
import { getCurrentUser } from '@/lib/session'
import url from '@/constants/url'

type DashboardProps = {
  children: React.ReactNode
  params: { organizationId: string }
}

export default async function DashboardLayout({ children }: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    // const res = await fetch('http://localhost:3000/api/test', {
    //   method: 'POST'
    // })
    // console.log('🚀 -> DashboardLayout -> res:', res.json())

    // console.log('USER notFound in DashboardLayout')
    redirect(`${url.app.signin}`)
    // return notFound()
  }

  // if (!user) {
  //   console.log('redirect in DashboardLayout')
  //   redirect('/sign-in')
  // }

  // if (!userId) redirect('/sign-in')

  const organizationData = await getOrganizationData()
  const hasRecord = organizationData && organizationData.length > 0

  return (
    // <div className='min-h-screen overflow-auto rounded-[0.5rem] bg-background'>

    // <div className={`min-h-screen w-full bg-background`}>
    //   <DashboardMainNav />
    //   <div>{children}</div>
    // </div>

    <div className='min-h-screen bg-background'>
      <>
        <DashboardNavMain organizationData={organizationData} />
        <main className='min-h-[calc(100vh-14rem)] flex-1 space-y-4'>
          {hasRecord ? (
            children
          ) : (
            <NoRecordPlaceholder
              title='No organization found.'
              description='Create a new organization to start managing your business.'
              ActionLinkButton={() => (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='aspect-square min-w-max p-1 md:aspect-auto md:px-4 md:py-2'>
                      <Icons.add className='block h-5 w-5 md:hidden' />
                      <span className='hidden md:block'>Create organization</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new organization to get started.</DialogTitle>
                      <DialogDescription>Fill out the form below to create your new organization</DialogDescription>
                    </DialogHeader>

                    <OrganizationForm userId={user.id} />
                  </DialogContent>
                </Dialog>
              )}
            />
          )}
        </main>
      </>
    </div>
  )
}
