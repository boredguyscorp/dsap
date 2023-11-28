'use server'

import { faker } from '@faker-js/faker'
import { z } from 'zod'

// import { Tasks, dbPortal } from '@bg/database/portal'
import {
  labelEnum,
  priorityEnum,
  statusEnum,
  updateTaskPrioritySchema,
  updateTaskStatusSchema
} from '@/app/(app.domain.com)/dashboard/membership/_components/tasks'
import db from '@/lib/db'
import { Tasks } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const updateTaskLabelSchema = z.object({
  id: z.string(),
  label: z.enum(labelEnum)
})

export async function seedTasksAction() {
  await db.tasks.deleteMany()

  const allTasks: Tasks[] = []

  for (let i = 0; i < 100; i++) {
    allTasks.push({
      id: faker.string.uuid(),
      code: `TASK-${faker.string.numeric({ length: { min: 4, max: 4 } })}`,
      title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
      status: faker.helpers.shuffle<Tasks['status']>(statusEnum)[0] ?? 'todo',
      label: faker.helpers.shuffle<Tasks['label']>(labelEnum)[0] ?? 'bug',
      priority: faker.helpers.shuffle<Tasks['priority']>(priorityEnum)[0] ?? 'low'
    })
  }

  await db.tasks.createMany({ data: allTasks })

  revalidatePath('/membership')
}

export type TaskUpdate = z.infer<typeof updateTaskLabelSchema>

export async function updateTaskLabelAction({ id, label }: TaskUpdate) {
  await db.tasks.update({ where: { id }, data: { label } })

  revalidatePath('/membership')
}

export async function deleteTask(id: string) {
  //   await db.delete(tasks).where(eq(tasks.id, id))
  await db.tasks.delete({ where: { id } })

  // Create a new task for the deleted one
  //   await generateTasks({ count: 1 })

  revalidatePath('/membership')
}

export async function updateTaskStatus({ id, status }: z.infer<typeof updateTaskStatusSchema>) {
  console.log('updateTaskStatusAction', id, status)

  //   await db.update(tasks).set({ status }).where(eq(tasks.id, id))

  await db.tasks.update({ where: { id }, data: { status } })

  revalidatePath('/membership')
}

export async function updateTaskPriority({ id, priority }: z.infer<typeof updateTaskPrioritySchema>) {
  console.log('updatePriorityAction', id, priority)

  //   await db.update(tasks).set({ priority }).where(eq(tasks.id, id))

  await db.tasks.update({ where: { id }, data: { priority } })

  revalidatePath('/membership')
}
