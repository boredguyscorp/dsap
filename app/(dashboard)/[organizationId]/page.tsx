import Link from 'next/link'

import { DashboardShell } from '../_components/dashboard-shell'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getRandomPatternStyle } from '@/lib/generate-pattern'

import PlanBadge from '@/components/plan-badge'
import { OrganizationDataBusinessEntity, getOrganizationDataById } from '@/actions/business'
import { BusinessForm } from './_components/create-business-form'
import { notFound } from 'next/navigation'
import NoRecordPlaceholder from '../_components/no-record-placeholder'
import Badge from '@/components/custom/badge'

// import { cookies } from 'next/headers'
// import Form from '@/app/(auth)/(routes)/sign-in/[[...sign-in]]/form'
// import FormCookie from '@/app/(auth)/(routes)/sign-in/[[...sign-in]]/form'
// // import { setCookie } from '@/actions/cookie'
// export async function getOrgData(): Promise<any> {
//   const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
//   if (!userId) return undefined

//   // TODO: TEMPORARY... IT SHOULD BE IN THE ROUTE HANDLER
//   const requestHeaders = new Headers()
//   requestHeaders.append('x-user', userId)

//   const res = await fetch('http://localhost:3000/api/organization', {
//     method: 'GET',
//     headers: requestHeaders
//   })

//   return res.json()
// }

type OrganizationPageProps = { params: { organizationId: string } }

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  // console.log('111')
  // const res = await getOrgData()

  // console.log('after getOrgData')

  // console.log('🚀 -> OrganizationPage -> res:', res)

  // const cookieStore = cookies()
  // const orgId = cookieStore.get('userId')
  // console.log('🚀 -> OrganizationPage -> cookieStore:', cookieStore.getAll())
  // console.log('🚀 -> DashboardMainNav:', orgId)
  // console.log(cookieStore.getAll())

  const organizationData = await getOrganizationDataById(params.organizationId)
  // console.log('🚀 -> OrganizationPage -> organizationData:', organizationData)

  // if (!organizationData) {
  //   // TODO: show modal for creating organization
  //   // notFound()
  // }

  const organizationSlugId = params.organizationId === 'dashboard' ? organizationData.id : params.organizationId

  // const businessData = await getBusinessData(organizationData.id)
  const businessData = organizationData.business
  const limitReached = false

  // console.log('222')

  function DialogFormBusiness() {
    return (
      <Dialog>
        <DialogTrigger asChild disabled={limitReached}>
          {limitReached ? (
            <Button className='min-w-max'>Organization limit reached</Button>
          ) : (
            <Button className='aspect-square min-w-max p-1 md:aspect-auto md:px-4 md:py-2'>
              <Icons.add className='block h-5 w-5 md:hidden' />
              <span className='hidden md:block'>Create a new business</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new business</DialogTitle>
            <DialogDescription>Fill out the form below to create your new business</DialogDescription>
          </DialogHeader>

          <BusinessForm organizationId={organizationSlugId} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell title='Business' description='Business for this organization will show up here' headerAction={<DialogFormBusiness />}>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {businessData.map((business) => (
          <li key={business.id}>
            <BusinessCard organizationId={organizationSlugId} business={business} />
          </li>
        ))}
      </ul>

      {businessData.length === 0 && (
        <NoRecordPlaceholder
          title='No business found.'
          description='Create a new business to get started.'
          ActionLinkButton={() => <DialogFormBusiness />}
        />
      )}
    </DashboardShell>
  )
}

function BusinessCard(props: { organizationId: string; business: OrganizationDataBusinessEntity }) {
  const { business } = props
  const locationData = business.location

  return (
    <Link href={`/${props.organizationId}/${business.id}`}>
      <Card className='overflow-hidden'>
        <div className='h-32' style={getRandomPatternStyle(business.id)} />
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{business.name}</span>
            <Badge text={`${locationData.length} Location`} variant={locationData.length > 0 ? 'default' : 'secondary'} />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
