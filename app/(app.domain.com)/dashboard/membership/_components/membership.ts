import { z } from 'zod'

export const membershipStatusEnum = ['pending', 'approved', 'rejected', 'import', 'updated'] as const

// GENERAL INFORMATION
export const ownershipType = [
  { value: 'single proprietor', label: 'Single Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' }
] as const

export const membershipType = [
  { value: 'regular', label: 'Regular' },
  { value: 'associate', label: 'Associate' }
] as const

export const drugstoreClassType = [
  { category: 'regular', value: 'single', label: 'Single up to 3 outlets' },
  { category: 'regular', value: 'chain', label: 'Chain' },
  { category: 'regular', value: 'others', label: 'Others' },
  { category: 'associate', value: 'distributor', label: 'Distributor' },
  { category: 'associate', value: 'wholesaler', label: 'Wholesaler' },
  { category: 'associate', value: 'franchisor', label: 'Franchisor' },
  { category: 'associate', value: 'franchisee', label: 'Franchisee' },
  { category: 'associate', value: 'others', label: 'Others' }
] as const

// DRUGSTORE PROFILE
export const dpSetup = [
  { value: 'counter type', label: 'Counter Type' },
  { value: 'service', label: 'Service' }
] as const

export const dpLocation = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'market', label: 'Market' },
  { value: 'mall', label: 'Mall' },
  { value: 'neighborhood', label: 'Neighborhood' }
] as const

export const dpStoreHours = [
  { value: '24 Hrs', label: '24 Hours' },
  { value: 'others', label: 'Others' }
] as const

export const dpInvSystem = [
  { value: 'pos', label: 'POS' },
  { value: 'stock card', label: 'Stock Card' },
  { value: 'stock control book', label: 'Stock Control Book' },
  { value: 'others', label: 'Others' }
] as const

//OWNERS PROFILE
export const opStatus = [
  { value: '', label: '' },
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'ww', label: 'Widowed/Widower' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'others', label: 'Others' }
] as const

export type MembershipStatus = (typeof membershipStatusEnum)[number]
export type OwnershipType = (typeof ownershipType)[number]
export type MembershipType = (typeof membershipType)[number]
export type DrugstoreClassType = (typeof drugstoreClassType)[number]

export const updateMembershipStatusSchema = z.object({
  id: z.string(),
  status: z.enum(membershipStatusEnum)
})

export type UpdateMembershipStatus = z.infer<typeof updateMembershipStatusSchema>
