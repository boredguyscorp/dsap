import * as z from 'zod'

export const searchParamsSchema = z.object({
  page: z.string().default('1'),
  per_page: z.string().default('10'),
  sort: z.string().optional(),
  drugStoreName: z.string().optional(),
  chapter: z.string().optional(),
  status: z.string().optional(),
  showStat: z.string().optional(),
  ownershipType: z.string().optional(),
  membershipType: z.string().optional()
})
