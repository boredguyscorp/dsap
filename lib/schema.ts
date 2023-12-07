import { conventionEnum, typeEnum } from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
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

// MEMBERSHIP FORM
const owType = ['single', 'partnership', 'corporation'] as const
export type Ownership = (typeof owType)[number]

// const owRegDetails = z.object({
//   docNo: z.string({ required_error: 'Document No. is required.' }).min(1, { message: 'Please enter Document No.' }),
//   docDateIssued: z.date({ required_error: 'Document date issued is required.' }),
//   docDateExpiry: z.date({ required_error: 'Document date expiry is required.' }),
//   docUrlAttachment: z.string({ required_error: 'Document attachment is required.' }).min(1, { message: 'Please attached Document.' })
// })

// const owTypeEnum = z.enum(owType)
// const singleProp = z.object({
//   type: z.literal(owTypeEnum.enum.single),
//   dtiNo: z.string({ required_error: 'DTI No. is required.' }).min(1, { message: 'Please enter DTI No.' }),
//   dtiDateIssued: z.date({ required_error: 'DTI date issued is required.' }),
//   dtiDateExpiry: z.date({ required_error: 'DTI date expiry is required.' }),
//   dtiUrlAttachment: z.string({ required_error: 'DTI attachment is required.' }).min(1, { message: 'Please attached DTI File.' })
// })

// const corporatePartnershipSchema = z.object({
//   cpNo: z.string({ required_error: 'SEC No. is required.' }).min(1, { message: 'Please enter SEC No.' }),
//   cpDateIssued: z.date({ required_error: 'SEC date issued is required.' }),
//   cpDateExpiry: z.date({ required_error: 'SEC date expiry is required.' }),
//   cpUrlAttachment: z.string({ required_error: 'SEC attachment is required.' }).min(1, { message: 'Please attached SEC File.' })
// })

// const corporate = corporatePartnershipSchema.extend({ type: z.literal(owTypeEnum.enum.corporation) })
// const partnership = corporatePartnershipSchema.extend({ type: z.literal(owTypeEnum.enum.partnership) })

// const corporate = z.object({
//   type: z.literal(owTypeEnum.enum.corporation),
// })

const generalInfo = z.object({
  drugStoreName: z.string({ required_error: 'Drugstore Name is required.' }).min(1, { message: 'Please enter Drugstore name.' }),
  address: z.string({ required_error: 'Please enter Address.' }),
  emailAdd: z.string({ required_error: 'Email Address is required.' }).min(1, { message: 'Please enter Email Address.' }),
  mobileNo: z.string({ required_error: 'Mobile No. is required.' }).min(1, { message: 'Please enter Mobile No.' }),
  telNo: z.string().nullish(),
  ownershipType: z.string({ required_error: 'Please select a ownership type' }),
  membershipType: z.string({ required_error: 'Please select a membership type' }),
  drugstoreClass: z.string({ required_error: 'Please select a drugstore classification' }).default('regular')
})

const dsProfile = z.object({
  dpSetup: z.string().optional(),
  dpLocation: z.string().optional(),
  dpStoreHours: z.string().optional(),
  dpInvSystem: z.string().optional()
})

const ownerProfile = z.object({
  opFirstName: z.string({ required_error: 'Owner First Name is required.' }).min(1, { message: 'Please enter Owner first name.' }),
  opLastName: z.string({ required_error: 'Owner First Name is required.' }).min(1, { message: 'Please enter Owner last name.' }),
  opMiddleName: z.string().optional(),
  opAddress: z.string().optional(),
  opBirthday: z.date().optional(),
  opEmail: z.string().optional(),
  opTelNo: z.string().optional(),
  opCellNo: z.string().optional(),
  opStatus: z.string().optional(),
  opGender: z.string().optional()
})

const registrationDetails = z.object({
  fdaLtoNo: z.string({ required_error: 'FDA LTO No. is required.' }).min(1, { message: 'Please enter FDA LTO No.' }),
  fdaDateIssued: z.date({ required_error: 'FDA LTO date issued is required.' }),
  fdaDateExpiry: z.date({ required_error: 'FDA LTO date expiry is required.' }),
  fdaUrlAttachment: z.string({ required_error: 'FDA LTO attachment is required.' }).min(1, { message: 'Please attached FDA LTO File.' }),
  bpNo: z.string({ required_error: 'Business Permit No. is required.' }).min(1, { message: 'Please enter Business Permit No.' }),
  bpDateIssued: z.date({ required_error: 'Business Permit date issued is required.' }),
  bpDateExpiry: z.date({ required_error: 'Business Permit date expiry is required.' }),
  bpUrlAttachment: z
    .string({ required_error: 'Business Permit attachment is required.' })
    .min(1, { message: 'Please attached Business Permit File.' }),
  docNo: z.string({ required_error: 'Document No. is required.' }).min(1, { message: 'Please enter Document No.' }),
  docDateIssued: z.date({ required_error: 'Document date issued is required.' }),
  docDateExpiry: z.date({ required_error: 'Document date expiry is required.' }),
  docUrlAttachment: z.string({ required_error: 'Document attachment is required.' }).min(1, { message: 'Please attached Document.' })
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const MemberRegistrationFormSchema = [generalInfo, dsProfile, ownerProfile, registrationDetails]
export const MemberRegistrationMergeSchema = generalInfo.merge(dsProfile).merge(ownerProfile).merge(registrationDetails)

export type MemberGeneralInfo = z.infer<typeof generalInfo>
export type MemberDrugStoreProfile = z.infer<typeof dsProfile>
export type MemberOwnerProfile = z.infer<typeof ownerProfile>
export type MemberRegistrationDetails = z.infer<typeof registrationDetails>
export type MemberRegistrationForm = MemberGeneralInfo & MemberDrugStoreProfile & MemberOwnerProfile & MemberRegistrationDetails

// NATIONAL CONVENTION
export const title = ['Select Title', 'Mr.', 'Mrs.', 'Ms.', 'Rph.', 'Dr.'] as const

export const ConventionRegistrationFormSchema = z.object({
  // convention: z.enum(conventionEnum),
  // type: z.enum(typeEnum),
  convention: z.string(),
  type: z.string(),
  title: z.string().optional(),
  firstName: z.string({ required_error: 'First Name is required.' }).min(1, { message: 'Please enter First Name.' }),
  middleName: z.string().optional(),
  lastName: z.string({ required_error: 'Last Name is required.' }).min(1, { message: 'Please enter Last Name.' }),
  contactNo: z.string({ required_error: 'Contact No. is required.' }).min(1, { message: 'Please enter Contact No.' }),
  emailAdd: z.string({ required_error: 'Email Address is required.' }).min(1, { message: 'Please enter Email Address.' }).email(),
  address: z
    .object({ street: z.string().optional(), brgy: z.string().optional(), city: z.string().optional(), province: z.string().optional() })
    .optional(),
  drugstoreInfo: z
    .object({
      establishment: z.string().optional(),
      chapter: z.string().optional(),
      owner: z.string().optional(),
      mainAddress: z.string().optional()
    })
    .optional(),
  proofOfPaymentUrl: z.string().min(1, { message: 'Proof of payment is required.' })
  // proofOfPaymentUrl: z.string({ required_error: 'Proof of Payment is required.' }).min(1, { message: 'Please enter Proof of Payment.' })
})

export type ConventionRegistrationForm = z.infer<typeof ConventionRegistrationFormSchema>
