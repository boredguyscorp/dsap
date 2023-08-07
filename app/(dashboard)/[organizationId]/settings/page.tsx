import { Suspense } from 'react'

import { OrganizationName } from './_components/organization-name'
import { DeleteOrganization } from './_components/delete-organization'
import { getOrganizationDataById } from '@/actions/business'

type SettingsPageProps = { params: { organizationId: string } }

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col gap-5'>
          <OrganizationName organizationId='org_123' currentName='' />
          <DeleteOrganization isSuspense />
        </div>
      }
    >
      <OrganizationGeneralSettings params={params} />
    </Suspense>
  )
}

async function OrganizationGeneralSettings({ params }: SettingsPageProps) {
  const orgData = await getOrganizationDataById(params.organizationId)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <div className='flex flex-col gap-5'>
      <OrganizationName organizationId={orgData.id} currentName={orgData.name} />
      <DeleteOrganization isSuspense={false} />
    </div>
  )

  // return (
  //   <Tabs defaultValue='general'>
  //     <TabsList className='mb-2 w-full justify-start'>
  //       <TabsTrigger value='general'>General</TabsTrigger>
  //       <TabsTrigger value='members'>Members</TabsTrigger>
  //     </TabsList>
  //     <TabsContent value='general' className='space-y-4'>
  //       <OrganizationName organizationId={orgData.id} currentName={orgData.name} />
  //       <OrganizationImage orgId={org.id} name={org.name} image={org.imageUrl} />
  //     </TabsContent>
  //     <TabsContent value='members' className='flex flex-col space-y-4'>
  //       <Dialog>
  //         <DialogTrigger asChild>
  //           <Button className='self-end'>Invite member</Button>
  //         </DialogTrigger>
  //         <DialogContent>{/* <InviteMemberForm /> */}</DialogContent>
  //       </Dialog>

  //       <Suspense fallback={<LoadingCard title='Members' description='' />}>
  //       <OrganizationMembers membersPromise={api.organization.listMembers.query()} />
  //       </Suspense>
  //     </TabsContent>
  //   </Tabs>
  // )
}
