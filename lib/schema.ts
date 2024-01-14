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
  chapter: z.string({ required_error: 'Chapter is required.' }).min(1, { message: 'Please select Chapter.' }),
  address: z.string({ required_error: 'Address is required.' }).min(1, { message: 'Please enter Address.' }),
  emailAdd: z.string({ required_error: 'Email Address is required.' }).min(1, { message: 'Please enter Email Address.' }).email(),
  mobileNo: z.string({ required_error: 'Mobile No. is required.' }).min(1, { message: 'Please enter Mobile No.' }),
  telNo: z.string().nullish(),
  ownershipType: z.string({ required_error: 'Ownership type is required.' }).min(1, { message: 'Please select a ownership type.' }),
  membershipType: z.string({ required_error: 'Membership type is required.' }).min(1, { message: 'Please select a membership type.' }),
  drugstoreClass: z
    .string({ required_error: 'Drugstore classification is required.' })
    .min(1, { message: 'Please select a drugstore classification.' })
})

export const dsEducAttSchema = z.object({
  collegeUniv: z.string().optional(),
  course: z.string().optional(),
  yearGrad: z.coerce.number().optional()
})

const dpPharmacistSchema = z.object({
  dsClass: z.literal('single'),
  dpPhImageUrl: z.string({ required_error: 'Pharmacist Photo is required.' }).min(1, { message: 'Please attached Pharmacist Photo.' }),
  dpPhLastName: z.string({ required_error: 'Last Name is required.' }).min(1, { message: 'Please enter first name.' }),
  dpPhFirstName: z.string({ required_error: 'First Name is required.' }).min(1, { message: 'Please enter first name.' }),
  dpPhMiddleName: z.string().optional(),
  dpPhAddress: z.string().optional(),
  dpPhBirthday: z.date().optional(),
  dpPhEmail: z.string().optional(),
  dpPhTelNo: z.string().optional(),
  dpPhCellNo: z.string().optional(),
  dpPhStatus: z.string().optional(),
  dpPhGender: z.string().optional(),
  dpPhNameInCert: z
    .string({ required_error: 'Name in PRC Certificate is required.' })
    .min(1, { message: 'Please enter Name in PRC Certificate.' }),
  dpPhOtherName: z.string().optional(),
  dpPhLicenseNo: z.string(),
  dpPhDateIssued: z.string(),
  dpPhExpDate: z.string(),
  dpPhEducCollege: dsEducAttSchema.optional(),
  dpPhEducMasters: dsEducAttSchema.optional(),
  dpPhEducDoctorate: dsEducAttSchema.optional(),
  dpPhEducSpecialProg: dsEducAttSchema.optional(),
  dpPhEducOthers: dsEducAttSchema.optional(),
  dpPhAsImageUrl: z
    .string({ required_error: 'Pharmacy Asst. Photo is required.' })
    .min(1, { message: 'Please attached Pharmacy Asst. Photo.' }),
  dpPhAsLastName: z.string({ required_error: 'PA Last Name is required.' }).min(1, { message: 'Please enter PA last name.' }),
  dpPhAsFirstName: z.string({ required_error: 'PA First Name is required.' }).min(1, { message: 'Please enter PA first name.' }),
  dpPhAsMiddleName: z.string().optional(),
  dpPhAsAddress: z.string().optional(),
  dpPhAsBirthday: z.date().optional(),
  dpPhAsEmail: z.string().optional(),
  dpPhAsTelNo: z.string().optional(),
  dpPhAsCellNo: z.string().optional(),
  dpPhAsStatus: z.string().optional(),
  dpPhAsGender: z.string().optional(),
  dpPhAsEmployer: z.string().optional(),
  dpPhAsEmployerAddress: z.string().optional(),
  dpPhAsEducPrimary: dsEducAttSchema.optional(),
  dpPhAsEducSecondary: dsEducAttSchema.optional(),
  dpPhAsEducCollege: dsEducAttSchema.optional(),
  dpPhAsEducMasters: dsEducAttSchema.optional(),
  dpPhAsEducDoctorate: dsEducAttSchema.optional(),
  dpPhAsEducSpecialProg: dsEducAttSchema.optional(),
  dpPhAsEducOthers: dsEducAttSchema.optional(),
  dpPhAsAttachmentCOEUrl: z
    .string({ required_error: 'Pharmacy Asst. COE is required.' })
    .min(1, { message: 'Please attached Pharmacy Asst. COE.' }),
  dpPhAsAttachmentDiplomaUrl: z
    .string({ required_error: 'Pharmacy Asst. Diploma is required.' })
    .min(1, { message: 'Please attached Pharmacy Asst. Diploma.' }),
  dpPhAsAttachmentCOAUrl: z
    .string({ required_error: 'Pharmacy Asst. Certificate of Attendance is required.' })
    .min(1, { message: 'Please attached Pharmacy Asst. Certificate of Attendance.' })
})

export const dpChainClassDetailsSchema = z.object({
  branchName: z.string({ required_error: 'Branch Name is required.' }).min(1, { message: 'Please enter Branch name.' }),
  address: z.string().nullish(),
  emailAdd: z.string().nullish(),
  mobileNo: z.string().nullish(),
  telNo: z.string().nullish(),
  fdaLtoNo: z.string().nullish(),
  fdaDateIssued: z.string().nullish(),
  fdaDateExpiry: z.string().nullish(),
  fdaUrlAttachment: z.string().nullish(),
  docNo: z.string().nullish(),
  docDateIssued: z.string().nullish(),
  docDateExpiry: z.string().nullish(),
  docUrlAttachment: z.string().nullish(),
  managerOic: z.string().nullish(),
  dpPhLastName: z.string().nullish(),
  dpPhFirstName: z.string().nullish(),
  dpPhMiddleName: z.string().nullish(),
  dpPhAddress: z.string().nullish(),
  dpPhNameInCert: z.string().nullish(),
  dpPhOtherName: z.string().nullish(),
  dpPhLicenseNo: z.string().nullish(),
  dpPhDateIssued: z.string().nullish(),
  dpPhExpDate: z.string().nullish(),
  dpPhAsLastName: z.string().nullish(),
  dpPhAsFirstName: z.string().nullish(),
  dpPhAsMiddleName: z.string().nullish(),
  dpPhAsAddress: z.string().nullish(),
  dpDateEstablished: z.string().nullish(),
  dpSetup: z.string().optional(),
  dpLocation: z.string().optional(),
  dpStoreHours: z.string().optional(),
  dpInvSystem: z.string().optional()
})

const dpChainSchema = z.object({
  dsClass: z.literal('chain'),
  dpBranches: z.array(dpChainClassDetailsSchema)
})

const dpDSClassOthers = z.object({
  dsClass: z.literal('others')
})

const dpDSClassDetails = z.discriminatedUnion('dsClass', [dpPharmacistSchema, dpChainSchema, dpDSClassOthers]).optional()

const dsProfile = z.object({
  dpDateEstablished: z.string({ required_error: 'Date Established is required.' }).min(1, { message: 'Please enter date established.' }),
  dpSetup: z.string().optional(),
  dpLocation: z.string().optional(),
  dpStoreHours: z.string().optional(),
  dpInvSystem: z.string().optional(),
  dpDSClassDetails
})

const opDsapMemberOwner = z.object({
  opDsapMemberType: z.literal('owner')
})

const opDsapMemberRep = z.object({
  opDsapMemberType: z.literal('representative'),
  opRepFormUrl: z.string({ required_error: 'Please attached Authorized Representative form' }),
  opRepPhotoUrl: z.string({ required_error: 'Please select Authorized Representative photo' })
})

const opDsapMember = z.discriminatedUnion('opDsapMemberType', [opDsapMemberOwner, opDsapMemberRep], {
  required_error: 'Please select who will be the DSAP Member.'
})

const ownerProfile = z.object({
  opFirstName: z.string({ required_error: 'Owner First Name is required.' }).min(1, { message: 'Please enter Owner first name.' }),
  opLastName: z.string({ required_error: 'Owner Last Name is required.' }).min(1, { message: 'Please enter Owner last name.' }),
  opMiddleName: z.string().optional(),
  opPhImageUrl: z.string({ required_error: 'Owner Photo is required.' }).min(1, { message: 'Please attached Owner Photo.' }),
  opAddress: z.string().optional(),
  opBirthday: z.date().optional(),
  opEmail: z.string().optional(),
  opTelNo: z.string().optional(),
  opCellNo: z.string().optional(),
  opStatus: z.string().optional(),
  opGender: z.string().optional(),
  opEducCollege: dsEducAttSchema.optional(),
  opEducMasters: dsEducAttSchema.optional(),
  opEducDoctorate: dsEducAttSchema.optional(),
  opEducSpecialProg: dsEducAttSchema.optional(),
  opEducOthers: dsEducAttSchema.optional(),
  opDsapMember
  // opDsapMember: z.string({ required_error: 'Please select who will be the DSAP Member.' })
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
  docNo: z.string({ required_error: 'Document SEC/DTI No. is required.' }).min(1, { message: 'Please enter Document SEC/DTI No.' }),
  docDateIssued: z.date({ required_error: 'Document date issued is required.' }),
  docDateExpiry: z.date({ required_error: 'Document date expiry is required.' }),
  docUrlAttachment: z.string({ required_error: 'Document attachment is required.' }).min(1, { message: 'Please attached Document.' })
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

const uploadPayment = z.object({
  proofOfPaymentUrl: z.string().optional()
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const MemberRegistrationFormSchema = [generalInfo, dsProfile, ownerProfile, registrationDetails]
export const MemberRegistrationMergeSchema = generalInfo.merge(dsProfile).merge(ownerProfile).merge(registrationDetails)

export type MemberGeneralInfo = z.infer<typeof generalInfo>
export type MemberDrugStoreProfile = z.infer<typeof dsProfile>
export type MemberOwnerProfile = z.infer<typeof ownerProfile>
export type MemberRegistrationDetails = z.infer<typeof registrationDetails>
export type MemberProofOfPayment = z.infer<typeof uploadPayment>
export type MemberRegistrationForm = MemberGeneralInfo &
  MemberDrugStoreProfile &
  MemberOwnerProfile &
  MemberRegistrationDetails &
  MemberProofOfPayment

export type DrugstoreChainClassDetails = z.infer<typeof dpChainClassDetailsSchema>

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
