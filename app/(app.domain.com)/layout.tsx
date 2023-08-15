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

  return (
    <div className='min-h-screen bg-background'>
      <>
        <DashboardNavMain />
        <main className='min-h-[calc(100vh-14rem)] flex-1 space-y-4'>{children}</main>
      </>
    </div>
  )
}
