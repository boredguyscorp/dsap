import db from '@/lib/db'
import { Tasks } from '@prisma/client'

import { searchParamsSchema } from './_components/schema'
import { ActionButton } from './_components/action-button'
import { DashboardShell } from '../../_components/dashboard-shell'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { Convention, conventions } from './_components/constant'
import BlurImage from '@/components/shared/blur-image'

import url from '@/constants/url'
// import { TasksTableShell } from './_components/tasks-table-shell'
// import { MembershipTableShell } from './_components/membership-table'

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  return (
    <DashboardShell
      title='Convention & Registration'
      description='DSAP National Convention & Event'
      className='mb-0'
      // headerAction={<ActionButton />}
    >
      <div className='mt-10 grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {conventions.map((convention) => (
          <ConventionCardSkeleton key={convention.code} convention={convention} />
        ))}
      </div>
    </DashboardShell>
  )
}

function ConventionCardSkeleton({ convention }: { convention: Convention }) {
  return (
    <Link href={`/convention/${convention.code}/`} className='group'>
      <Card className='overflow-hidden group-hover:border-primary'>
        <div className='relative mt-10 h-64'>
          {/* //!TODO  - src should be coming from cloud storage */}
          <BlurImage
            fill
            src={`${url.protocol}:${url.home}${convention.img}`}
            alt='No links yet'
            className='pointer-events-none relative object-contain object-center'
          />
        </div>

        <CardHeader className='flex flex-row items-center justify-between p-4'>
          <div className='flex w-full flex-col gap-1'>
            <span className='text-xs font-semibold'>{convention.code.toUpperCase() + ' DSAP National Convention'}</span>
            <CardTitle className='overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-tight'>{convention.title}</CardTitle>
            <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground'>{convention.description}</p>
            <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground'>{convention.date}</p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
