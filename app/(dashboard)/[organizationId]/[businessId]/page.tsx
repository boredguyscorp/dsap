import { DashboardShell } from '../../_components/dashboard-shell'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import { Overview } from './_components/overview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findBusinessById } from '@/actions/business'

export default async function DashboardPage({ params }: { params: { organizationId: string; businessId: string } }) {
  const { businessId } = params

  const businessData = await findBusinessById(businessId)

  return (
    <DashboardShell title={businessData.name} description='Get an overview of how the business is going'>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='analytics' disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value='reports' disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value='notifications' disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>$45,231.89</div>
                <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Subscriptions</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+2350</div>
                <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                <CreditCard className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+12,234</div>
                <p className='text-xs text-muted-foreground'>+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
                <Activity className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+573</div>
                <p className='text-xs text-muted-foreground'>+201 since last hour</p>
              </CardContent>
            </Card>
          </div>
          {/* <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'> */}
          <div>
            <Card className='col-span-7 md:col-span-2 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview />
              </CardContent>
            </Card>

            {/* <Suspense
              fallback={
                <LoadingCard
                  title='Recent Ingestions'
                  description='Loading recent ingestions...'
                  className='col-span-7 md:col-span-2 lg:col-span-3'
                />
              }
            >
            </Suspense> */}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

// function IngestionCard(props: { businessId: string; organizationId: string; ingestion: RouterOutputs['ingestion']['list'][number] }) {
//   const { ingestion } = props
//   const { adds, subs } = ingestion

//   const N_SQUARES = 5
//   const addSquares = Math.round((adds / (adds + subs)) * N_SQUARES)

//   const truncatedHash = ingestion.hash.slice(0, 15)

//   return (
//     <Link href={`/${props.organizationId}/${props.businessId}/ingestions/${ingestion.id}`}>
//       <div className='flex items-center rounded p-1 hover:bg-muted'>
//         <div className='space-y-1'>
//           <p className='text-sm font-medium leading-none'>{truncatedHash}</p>
//           <p className='text-sm text-muted-foreground'>{formatRelative(ingestion.createdAt, new Date())}</p>
//         </div>
//         <div className='ml-auto flex flex-col items-center text-sm'>
//           <div>
//             +{adds} -{subs}
//           </div>
//           <div className='flex gap-[2px]'>
//             {new Array(N_SQUARES).fill(null).map((_, i) => (
//               <span
//                 key={i}
//                 className={cn('inline-block h-2 w-2', i < addSquares ? 'bg-green-500' : 'bg-red-500', adds + subs === 0 && 'bg-gray-200')}
//               />
//             ))}
//           </div>
//         </div>

//         <Icons.ChevronRight className='ml-2 h-4 w-4' />
//       </div>
//     </Link>
//   )
// }

// async function RecentIngestions(props: { businessId: string; organizationId: string }) {
//   const ingestions = await api.ingestion.list.query({
//     businessId: props.businessId,
//     limit: 5
//   })

//   return (
//     <Card className='col-span-7 md:col-span-2 lg:col-span-3'>
//       <CardHeader>
//         <CardTitle>Recent Ingestions</CardTitle>
//         <CardDescription>
//           {ingestions.length} ingestion{ingestions.length > 1 ? 's' : null} recorded this period.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {ingestions.map((ingestion) => (
//           <IngestionCard key={ingestion.id} ingestion={ingestion} businessId={props.businessId} organizationId={props.organizationId} />
//         ))}
//       </CardContent>
//       <CardFooter>
//         <Button size='sm' className='ml-auto'>
//           View all
//           <Icons.ChevronRight className='ml-1 h-4 w-4' />
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }
