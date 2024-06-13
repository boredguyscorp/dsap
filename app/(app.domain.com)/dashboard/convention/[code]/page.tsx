import db from '@/lib/db'
import { Prisma, Registration } from '@prisma/client'

import { searchParamsSchema } from '../_components/schema'
import { ActionButton } from '../_components/action-button'
import { DashboardShell } from '../../../_components/dashboard-shell'
// import { TasksTableShell } from './_components/tasks-table-shell'
import { RegistrationTableShell } from '../_components/registration-table'
import { Convention, conventions } from '../_components/constant'
import { notFound } from 'next/navigation'
import { ChapterList, getChapters } from '@/actions/fetchers'
import { Suspense } from 'react'
import { DataTableLoading } from '@/components/data-table/data-table-loading'
import { RegistrationStatCard } from '../_components/stats'

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
  params: { code: string }
}

export default async function IndexPage({ searchParams, params }: IndexPageProps) {
  const { code } = params
  const convention = conventions.find((row) => row.code === code)

  if (!convention) throw notFound()

  // Parse search params using zod schema
  const { page, per_page, sort, firstName, status, drugstoreInfo, type, showStat, priority, operator } =
    searchParamsSchema.parse(searchParams)

  const searchVal = firstName

  // Fallback page for invalid page numbers
  const pageAsNumber = Number(page)
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  // Number of items per page
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [column, order] = (sort?.split('.') as [keyof Registration | undefined, 'asc' | 'desc' | undefined]) ?? ['title', 'desc']

  const statuses = (status?.split('.') as Registration['status'][]) ?? []
  const chapterFilter = drugstoreInfo?.split('.') ?? []
  const regFeeType = type?.split('.') ?? []

  const whereSearchVal: Prisma.RegistrationWhereInput['OR'] = []

  const orderByVal: Prisma.RegistrationOrderByWithRelationInput = {
    [column as keyof Prisma.RegistrationOrderByWithRelationInput]: order
  }

  if (searchVal) {
    whereSearchVal.push(
      { code: { contains: searchVal } },
      { firstName: { contains: searchVal } },
      { lastName: { contains: searchVal } },
      { emailAdd: { contains: searchVal } },
      { contactNo: { contains: searchVal } },
      { drugstoreInfo: { path: '$.establishment', string_contains: searchVal.toLowerCase() } },
      { drugstoreInfo: { path: '$.establishment', string_contains: searchVal.toUpperCase() } }
    )
  }

  const statusFilterVal: Prisma.RegistrationWhereInput['OR'] = []

  statuses.forEach((el) => {
    statusFilterVal.push({ status: { equals: el } })
  })

  const chapterFilterVal: Prisma.RegistrationWhereInput['OR'] = []

  chapterFilter.forEach((el) => {
    chapterFilterVal.push({ drugstoreInfo: { path: '$.chapter', string_contains: el } })
  })

  const regFeeTypeFilterVal: Prisma.RegistrationWhereInput['OR'] = []

  regFeeType.forEach((el) => {
    regFeeTypeFilterVal.push({ type: { equals: el } })
  })

  const whereVal: Prisma.RegistrationWhereInput = {
    AND: [
      {
        AND: [
          { convention: convention.code },
          { OR: whereSearchVal },
          { OR: statusFilterVal },
          { OR: chapterFilterVal },
          { OR: regFeeTypeFilterVal }
        ]
      }
    ]
  }

  const allRegistration = db.registration.findMany({
    skip: offset,
    take: limit,
    where: whereVal,
    orderBy: orderByVal
  })

  const allRegistrationUnPaginated = db.registration.findMany({
    where: whereVal,
    orderBy: orderByVal
  })

  const totalRegistration = db.registration.count({
    where: whereVal
  })

  const chapters = getChapters()

  const registrationPromise = Promise.all([allRegistration, totalRegistration, chapters])

  const statistics = showStat === 'true'

  let statisticsPromise

  if (statistics) {
    const statCount = db.registration.groupBy({ by: ['status'], _count: true, where: whereVal })
    statisticsPromise = Promise.all([statCount])
  }

  return (
    <DashboardShell
      title={convention.code + ' DSAP National Convention' + ' ' + convention.date}
      description={`${convention.title} [${convention.description}]`}
      className='mb-0'
      headerAction={<Await promise={allRegistrationUnPaginated}>{(data) => <ActionButton registrations={data} />}</Await>}
    >
      <div className='pb-8 pt-6 md:py-8'>
        {statistics && (
          <Suspense fallback={<RegistrationStatCard skeleton />}>
            <Await promise={statisticsPromise}>
              {(data) => {
                const approved = data[0].find((r) => r.status === 'approved')?._count ?? 0
                const pending = data[0].find((r) => r.status === 'pending')?._count ?? 0
                const rejected = data[0].find((r) => r.status === 'rejected')?._count ?? 0
                const total = approved + pending + rejected

                const stats = {
                  total,
                  approved,
                  pending,
                  rejected
                }

                return (
                  <div className='mb-6'>
                    <RegistrationStatCard {...stats} skeleton={false} />
                  </div>
                )
              }}
            </Await>
          </Suspense>
        )}

        <Suspense fallback={<DataTableLoading columnCount={4} />}>
          <Await promise={registrationPromise}>
            {(data) => {
              const [allRegistration, totalRegistration, chapters] = data

              const pageCount = Math.ceil(totalRegistration / limit)

              return (
                <RegistrationTableShell data={allRegistration} pageCount={pageCount} chapters={chapters} conventionCode={convention.code} />
              )
            }}
          </Await>
        </Suspense>
      </div>
    </DashboardShell>
  )
}

async function Await<T>({ promise, children }: { promise: Promise<T> | undefined; children: (value: T) => JSX.Element }) {
  if (!promise) return null

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 3000)
  // })

  const data = await promise

  return children(data)
}
