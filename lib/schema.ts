import { z } from 'zod'

export const signUpSchema = z.object({
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

// export const TokenPayloadSchema = z.object({
//   apiKey: z.string(),
//   businessId: z.string(),
//   iat: z.number(),
//   exp: z.number(),
//   iatDate: z.date(),
//   expDate: z.date()
// })

// export type TokenPayloadDto = z.infer<typeof TokenPayloadSchema>
