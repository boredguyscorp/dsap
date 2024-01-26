import db from '@/lib/db'
import { Tasks, Members, Prisma } from '@prisma/client'

import { searchParamsSchema } from './_components/schema'
import { ActionButton } from './_components/action-button'
import { DashboardShell } from '../../_components/dashboard-shell'
// import { TasksTableShell } from './_components/tasks-table-shell'
import { MembershipTableShell } from './_components/membership-table'
import { getChapters } from '@/actions/fetchers'
import { DataTableLoading } from '@/components/data-table/data-table-loading'
import { Suspense } from 'react'
import { Await } from '@/lib/utils'
import { MembershipStatCard } from './_components/stat'

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  // Parse search params using zod schema
  const { page, per_page, sort, drugStoreName, chapter, status, ownershipType, membershipType, showStat, code } =
    searchParamsSchema.parse(searchParams)

  const searchVal = drugStoreName

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
  // Example: "title.desc" => ["drugStoreName", "asc"]
  const [column, order] = (sort?.split('.') as [keyof Members | undefined, 'asc' | 'desc' | undefined]) ?? ['drugStoreName', 'asc']

  const statuses = (status?.split('.') as Members['status'][]) ?? []
  const chapterFilter = chapter?.split('.') ?? []
  const ownershipTypeFilter = ownershipType?.split('.') ?? []
  const membershipTypeFilter = membershipType?.split('.') ?? []

  const whereSearchVal: Prisma.MembersWhereInput['OR'] = []

  const orderByVal: Prisma.MembersOrderByWithRelationInput = {
    [column as keyof Prisma.MembersOrderByWithRelationInput]: order
  }

  if (searchVal) {
    whereSearchVal.push(
      { code: { contains: drugStoreName } },
      { opFirstName: { contains: searchVal } },
      { opLastName: { contains: searchVal } },
      { drugStoreName: { contains: searchVal } },
      { emailAdd: { contains: searchVal } },
      { mobileNo: { contains: searchVal } },
      { telNo: { contains: searchVal } }
    )
  }

  const statusFilterVal: Prisma.MembersWhereInput['OR'] = []

  statuses.forEach((el) => {
    statusFilterVal.push({ status: { equals: el } })
  })

  const chapterFilterVal: Prisma.MembersWhereInput['OR'] = []

  chapterFilter.forEach((el) => {
    chapterFilterVal.push({ memberChapter: { name: { equals: el } } })
  })

  const ownershipTypeFilterVal: Prisma.MembersWhereInput['OR'] = []

  ownershipTypeFilter.forEach((el) => {
    ownershipTypeFilterVal.push({ ownershipType: { equals: el } })
  })

  const membershipTypeFilterVal: Prisma.MembersWhereInput['OR'] = []

  membershipTypeFilter.forEach((el) => {
    membershipTypeFilterVal.push({
      membershipType: { equals: el }
    })
  })

  const whereVal: Prisma.MembersWhereInput = {
    AND: [
      {
        AND: [
          { OR: whereSearchVal },
          { OR: statusFilterVal },
          { OR: chapterFilterVal },
          { OR: ownershipTypeFilterVal },
          { OR: membershipTypeFilterVal }
        ]
      }
    ]
  }

  const allMembers = db.members.findMany({
    skip: offset,
    take: limit,
    where: whereVal,
    include: {
      memberChapter: { select: { id: true, code: true, name: true } }
    },
    orderBy: orderByVal
  })

  const totalMembers = db.members.count({ where: whereVal })

  const chapters = getChapters()

  const membersPromise = Promise.all([allMembers, totalMembers, chapters])

  const statistics = showStat === 'true'

  let statisticsPromise

  if (statistics) {
    const statCount = db.members.groupBy({ by: ['status'], _count: true, where: whereVal })
    statisticsPromise = Promise.all([statCount])
  }

  return (
    <DashboardShell
      title='Membership'
      description='Manage your member(s) data.'
      className='mb-0'
      headerAction={<Await promise={chapters}>{(data) => <ActionButton chapters={data} />}</Await>}
    >
      <div className='pb-8 pt-6 md:py-8'>
        {statistics && (
          <Suspense fallback={<MembershipStatCard skeleton />}>
            <Await promise={statisticsPromise}>
              {(data) => {
                const approved = data[0].find((r) => r.status === 'approved')?._count ?? 0
                const pending = data[0].find((r) => r.status === 'pending')?._count ?? 0
                const rejected = data[0].find((r) => r.status === 'rejected')?._count ?? 0
                const _import = data[0].find((r) => r.status === 'import')?._count ?? 0
                const updated = data[0].find((r) => r.status === 'updated')?._count ?? 0
                const total = approved + pending + rejected + _import + updated

                const stats = {
                  total,
                  approved,
                  pending,
                  rejected,
                  import: _import,
                  updated
                }

                return (
                  <div className='mb-6'>
                    <MembershipStatCard {...stats} skeleton={false} />
                  </div>
                )
              }}
            </Await>
          </Suspense>
        )}

        <Suspense fallback={<DataTableLoading columnCount={4} />}>
          <Await promise={membersPromise}>
            {(data) => {
              const [allMembers, totalMembers, chapters] = data

              const pageCount = Math.ceil(totalMembers / limit)

              return <MembershipTableShell data={allMembers} pageCount={pageCount} chapters={chapters} />
            }}
          </Await>
        </Suspense>
      </div>
    </DashboardShell>
  )
}
