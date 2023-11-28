// import { db } from '@/db'

// import { and, asc, desc, inArray, or, sql } from 'drizzle-orm'

import { Tasks } from '@prisma/client'

// import { filterColumn } from '@/lib/utils'

import { searchParamsSchema } from './_components/schema'
import { Shell } from './_components/shell'
import { TasksTableShell } from './_components/tasks-table-shell'
import db from '@/lib/db'
import { seedTasksAction } from '@/actions/tasks'
import { ActionButton } from './_components/action-button'
import { DashboardShell } from '../../_components/dashboard-shell'

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
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
  const { allTasks, totalTasks } = await db.$transaction(async (tx) => {
    const allTasks = await tx.tasks.findMany({ skip: offset, take: limit })
    const totalTasks = await tx.tasks.count()

    return {
      allTasks,
      totalTasks
    }
  })

  const pageCount = Math.ceil(totalTasks / limit)

  return (
    <DashboardShell title='Membership' description='Manage your member(s) data.' className='mb-0' headerAction={<ActionButton />}>
      <div className='pb-8 pt-6 md:py-8'>
        <TasksTableShell data={allTasks} pageCount={pageCount} />
      </div>
    </DashboardShell>
  )
}
