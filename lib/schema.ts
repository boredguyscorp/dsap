import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Invalid email.' }),
  username: z.string().min(1, { message: 'Please enter username.' }),
  password: z.string().min(1, { message: 'Please enter password.' })
})

export type SignUpDto = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Please enter username.' }),
  password: z.string().min(1, { message: 'Please enter password.' })
})

export type LoginDto = z.infer<typeof loginSchema>

export const createOrganizationSchema = z.object({
  name: z.string().min(1)
})

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

export const createBusinessSchema = z.object({
  name: z.string().min(1)
})

export type CreateBusinessDto = z.infer<typeof createBusinessSchema>

export const updateBusinessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1)
})

export type UpdateBusinessDto = z.infer<typeof updateBusinessSchema>

export const createLocationSchema = z.object({
  name: z.string().min(1, { message: 'Please enter name.' }),
  organizationId: z.string(),
  businessId: z.string()
})

export type CreateLocationDto = z.infer<typeof createLocationSchema>

export const createApiKeySchema = z.object({
  name: z.string().min(1, { message: 'Please enter name.' }),
  locationId: z.string(),
  businessId: z.string(),
  expiresIn: z.string()
})

export type CreateApiKeyDto = z.infer<typeof createApiKeySchema>

export const postPatchSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long'
    })
    .max(128, {
      message: 'Title must be less than 128 characters long'
    }),
  description: z.string().optional(),
  content: z.any(),
  isPublish: z.boolean().optional()
})

export type PostCreationRequest = z.infer<typeof postPatchSchema>

export const newMemberSchema = [
  z.object({
    drugStoreName: z.string().min(1, { message: 'Please enter Drugstore name.' }),
    address: z.string({ required_error: 'Please enter Address.' }),
    emailAdd: z.string().nullish(),
    telNo: z.string().nullish(),
    mobileNo: z.string().nullish(),
    ownershipType: z.string({ required_error: 'Please select a ownership type' }),
    membershipType: z.string({ required_error: 'Please select a membership type' }),
    drugstoreClassification: z.string({ required_error: 'Please select a drugstore classification' })
  }),
  z.object({
    fdaLtoNo: z.string({ required_error: 'Please enter Address.' }),
    fdaDateIssued: z.date({
      required_error: 'FDA Date Issued is required.'
    }),
    fdaDateExpiry: z.date({ required_error: 'FDA Date Expiry is required.' }),
    fdaUrlAttachment: z.string({ required_error: 'Please enter Address.' })
  }),
  z.object({
    ownerFirstName: z.string().min(1, { message: 'Please enter Owner first name.' }),
    ownerLastName: z.string().min(1, { message: 'Please enter Owner last name.' })
  }),
  z.object({
    test: z.string().min(1, { message: 'Please enter test.' })
  })
]
