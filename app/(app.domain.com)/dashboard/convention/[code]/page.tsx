import db from '@/lib/db'
import { Tasks } from '@prisma/client'

import { searchParamsSchema } from '../_components/schema'
import { ActionButton } from '../_components/action-button'
import { DashboardShell } from '../../../_components/dashboard-shell'
// import { TasksTableShell } from './_components/tasks-table-shell'
import { RegistrationTableShell } from '../_components/registration-table'
import { conventions } from '../_components/constant'
import { notFound } from 'next/navigation'

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
  const { page, per_page, sort, title, status, priority, operator } = searchParamsSchema.parse(searchParams)

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
  const [column, order] = (sort?.split('.') as [keyof Tasks | undefined, 'asc' | 'desc' | undefined]) ?? ['title', 'desc']

  const statuses = (status?.split('.') as Tasks['status'][]) ?? []

  const priorities = (priority?.split('.') as Tasks['priority'][]) ?? []

  // Transaction is used to ensure both queries are executed in a single transaction
  const { allRegistration, totalRegistration } = await db.$transaction(async (tx) => {
    const allRegistration = await tx.registration.findMany({ skip: offset, take: limit })
    const totalRegistration = await tx.registration.count()

    return {
      allRegistration,
      totalRegistration
    }
  })

  const pageCount = Math.ceil(totalRegistration / limit)

  return (
    <DashboardShell
      title={convention.code + ' DSAP National Convention' + ' ' + convention.date}
      description={`${convention.title} [${convention.description}]`}
      className='mb-0'
      headerAction={<ActionButton />}
    >
      <div className='pb-8 pt-6 md:py-8'>
        <RegistrationTableShell data={allRegistration} pageCount={pageCount} />
      </div>
    </DashboardShell>
  )
}
