import { z } from 'zod'

export const statusEnum = ['todo', 'in-progress', 'done', 'canceled'] as const
export const labelEnum = ['bug', 'feature', 'enhancement', 'documentation'] as const
export const priorityEnum = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof statusEnum)[number]
export type TaskLabel = (typeof labelEnum)[number]
export type TaskPriority = (typeof priorityEnum)[number]

export const updateTaskStatusSchema = z.object({
  id: z.string(),
  status: z.enum(statusEnum)
})

export const updateTaskPrioritySchema = z.object({
  id: z.string(),
  priority: z.enum(priorityEnum)
})
