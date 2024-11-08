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
//   docDateIssued: z.coerce.date({ required_error: 'Document date issued is required.' }),
//   docDateExpiry: z.coerce.date({ required_error: 'Document date expiry is required.' }),
//   docUrlAttachment: z.string({ required_error: 'Document attachment is required.' }).min(1, { message: 'Please attached Document.' })
// })

// const owTypeEnum = z.enum(owType)
// const singleProp = z.object({
//   type: z.literal(owTypeEnum.enum.single),
//   dtiNo: z.string({ required_error: 'DTI No. is required.' }).min(1, { message: 'Please enter DTI No.' }),
//   dtiDateIssued: z.coerce.date({ required_error: 'DTI date issued is required.' }),
//   dtiDateExpiry: z.coerce.date({ required_error: 'DTI date expiry is required.' }),
//   dtiUrlAttachment: z.string({ required_error: 'DTI attachment is required.' }).min(1, { message: 'Please attached DTI File.' })
// })

// const corporatePartnershipSchema = z.object({
//   cpNo: z.string({ required_error: 'SEC No. is required.' }).min(1, { message: 'Please enter SEC No.' }),
//   cpDateIssued: z.coerce.date({ required_error: 'SEC date issued is required.' }),
//   cpDateExpiry: z.coerce.date({ required_error: 'SEC date expiry is required.' }),
//   cpUrlAttachment: z.string({ required_error: 'SEC attachment is required.' }).min(1, { message: 'Please attached SEC File.' })
// })

// const corporate = corporatePartnershipSchema.extend({ type: z.literal(owTypeEnum.enum.corporation) })
// const partnership = corporatePartnershipSchema.extend({ type: z.literal(owTypeEnum.enum.partnership) })

// const corporate = z.object({
//   type: z.literal(owTypeEnum.enum.corporation),
// })

const generalInfo = z.object({
  code: z.string().optional(),
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
  dpPhBirthday: z.coerce.date().optional(),
  dpPhEmail: z.string().optional(),
  dpPhTelNo: z.string().optional(),
  dpPhCellNo: z.string().optional(),
  dpPhStatus: z.string().optional(),
  dpPhGender: z.string().optional(),
  dpPhNameInCert: z
    .string({ required_error: 'Name in PRC Certificate is required.' })
    .min(1, { message: 'Please enter Name in PRC Certificate.' }),
  dpPhOtherName: z.string().optional(),
  dpPhLicenseNo: z.string({ required_error: 'PRC License No. is required.' }).min(1, { message: 'Please enter PRC License Number.' }),
  dpPhDateIssued: z.coerce.date({ required_error: 'Date Issue is required.' }),
  dpPhExpDate: z.coerce.date({ required_error: 'Date Expiry Date is required.' }),
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
  dpPhAsBirthday: z.coerce.date().optional(),
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
  emailAdd: z.string().email().nullish(),
  mobileNo: z.string().nullish(),
  telNo: z.string().nullish(),
  fdaLtoNo: z.string().nullish(),
  fdaDateIssued: z.coerce.date().nullish(),
  fdaDateExpiry: z.coerce.date().nullish(),
  fdaUrlAttachment: z.string().nullish(),
  docNo: z.string().nullish(),
  docDateIssued: z.coerce.date().nullish(),
  docDateExpiry: z.coerce.date().nullish(),
  docUrlAttachment: z.string().nullish(),
  managerOic: z.string().nullish(),
  dpPhLastName: z.string().nullish(),
  dpPhFirstName: z.string().nullish(),
  dpPhMiddleName: z.string().nullish(),
  dpPhAddress: z.string().nullish(),
  dpPhNameInCert: z.string().nullish(),
  dpPhOtherName: z.string().nullish(),
  dpPhLicenseNo: z.string().nullish(),
  dpPhDateIssued: z.coerce.date().nullish(),
  dpPhExpDate: z.coerce.date().nullish(),
  dpPhAsLastName: z.string().nullish(),
  dpPhAsFirstName: z.string().nullish(),
  dpPhAsMiddleName: z.string().nullish(),
  dpPhAsAddress: z.string().nullish(),
  dpDateEstablished: z.coerce.date().nullish(),
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
  dpDateEstablished: z.coerce.date({ required_error: 'Date Established is required.' }),
  dpSetup: z.string().nullish(),
  dpLocation: z.string().nullish(),
  dpStoreHours: z.string().nullish(),
  dpInvSystem: z.string().nullish(),
  dpDSClassDetails
})

const opDsapMemberOwner = z.object({
  opDsapMemberType: z.literal('owner')
})

const opDsapMemberRep = z.object({
  opDsapMemberType: z.literal('representative'),
  opRepFormUrl: z
    .string({ required_error: 'Please attached Authorized Representative form.' })
    .min(1, { message: 'Please attached Authorized Representative form.' }),
  opRepPhotoUrl: z
    .string({ required_error: 'Please select Authorized Representative photo.' })
    .min(1, { message: 'Please select Authorized Representative photo.' })
})

const opDsapMember = z.discriminatedUnion('opDsapMemberType', [opDsapMemberOwner, opDsapMemberRep], {
  required_error: 'Please select who will be the DSAP Member.'
})

const ownerProfile = z.object({
  opFirstName: z.string({ required_error: 'Owner First Name is required.' }).min(1, { message: 'Please enter Owner first name.' }),
  opLastName: z.string({ required_error: 'Owner Last Name is required.' }).min(1, { message: 'Please enter Owner last name.' }),
  opMiddleName: z.string().nullish(),
  opPhImageUrl: z.string({ required_error: 'Owner Photo is required.' }).min(1, { message: 'Please attached Owner Photo.' }),
  opAddress: z.string().nullish(),
  opBirthday: z.coerce.date().nullish(),
  opEmail: z.string().nullish(),
  opTelNo: z.string().nullish(),
  opCellNo: z.string().nullish(),
  opStatus: z.string().nullish(),
  opGender: z.string().nullish(),
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
  fdaDateIssued: z.coerce.date({ required_error: 'FDA LTO date issued is required.' }),
  fdaDateExpiry: z.coerce.date({ required_error: 'FDA LTO date expiry is required.' }),
  fdaUrlAttachment: z.string({ required_error: 'FDA LTO attachment is required.' }).min(1, { message: 'Please attached FDA LTO File.' }),
  bpNo: z.string({ required_error: 'Business Permit No. is required.' }).min(1, { message: 'Please enter Business Permit No.' }),
  bpDateIssued: z.coerce.date({ required_error: 'Business Permit date issued is required.' }),
  bpDateExpiry: z.coerce.date({ required_error: 'Business Permit date expiry is required.' }),
  bpUrlAttachment: z
    .string({ required_error: 'Business Permit attachment is required.' })
    .min(1, { message: 'Please attached Business Permit File.' }),
  docNo: z.string({ required_error: 'Document SEC/DTI No. is required.' }).min(1, { message: 'Please enter Document SEC/DTI No.' }),
  docDateIssued: z.coerce.date({ required_error: 'Document date issued is required.' }),
  docDateExpiry: z.coerce.date({ required_error: 'Document date expiry is required.' }),
  docUrlAttachment: z.string({ required_error: 'Document attachment is required.' }).min(1, { message: 'Please attached Document.' })
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const uploadPayment = z.object({
  proofOfPaymentUrl: z.string().nullish()
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const MemberRegistrationFormSchema = [generalInfo, dsProfile, ownerProfile, registrationDetails]
export const MemberRegistrationMergeSchema = generalInfo
  .merge(dsProfile)
  .merge(ownerProfile)
  .merge(registrationDetails)
  .merge(uploadPayment)

// Membership Form optional schema without additional field checker
const _generalInfo = z.object({
  code: z.string().nullish(),
  drugStoreName: z.string().nullish(),
  chapter: z.string().nullish(),
  address: z.string().nullish(),
  emailAdd: z.string().nullish(),
  mobileNo: z.string().nullish(),
  telNo: z.string().nullish(),
  ownershipType: z.string().nullish(),
  membershipType: z.string().nullish(),
  drugstoreClass: z.string().nullish()
})

export const _dsEducAttSchema = z.object({
  collegeUniv: z.string().nullish(),
  course: z.string().nullish(),
  yearGrad: z.coerce.number().nullish()
})

const _dpPharmacistSchema = z.object({
  dsClass: z.literal('single'),
  dpPhImageUrl: z.string().nullish(),
  dpPhLastName: z.string().nullish(),
  dpPhFirstName: z.string().nullish(),
  dpPhMiddleName: z.string().nullish(),
  dpPhAddress: z.string().nullish(),
  dpPhBirthday: z.coerce.date().nullish(),
  dpPhEmail: z.string().nullish(),
  dpPhTelNo: z.string().nullish(),
  dpPhCellNo: z.string().nullish(),
  dpPhStatus: z.string().nullish(),
  dpPhGender: z.string().nullish(),
  dpPhNameInCert: z.string().nullish(),
  dpPhOtherName: z.string().nullish(),
  dpPhLicenseNo: z.string().nullish(),
  dpPhDateIssued: z.coerce.date().nullish(),
  dpPhExpDate: z.coerce.date().nullish(),
  dpPhEducCollege: _dsEducAttSchema.nullish(),
  dpPhEducMasters: _dsEducAttSchema.nullish(),
  dpPhEducDoctorate: _dsEducAttSchema.nullish(),
  dpPhEducSpecialProg: _dsEducAttSchema.nullish(),
  dpPhEducOthers: _dsEducAttSchema.nullish(),
  dpPhAsImageUrl: z.string().nullish(),
  dpPhAsLastName: z.string().nullish(),
  dpPhAsFirstName: z.string().nullish(),
  dpPhAsMiddleName: z.string().nullish(),
  dpPhAsAddress: z.string().nullish(),
  dpPhAsBirthday: z.coerce.date().nullish(),
  dpPhAsEmail: z.string().nullish(),
  dpPhAsTelNo: z.string().nullish(),
  dpPhAsCellNo: z.string().nullish(),
  dpPhAsStatus: z.string().nullish(),
  dpPhAsGender: z.string().nullish(),
  dpPhAsEmployer: z.string().nullish(),
  dpPhAsEmployerAddress: z.string().nullish(),
  dpPhAsEducPrimary: _dsEducAttSchema.nullish(),
  dpPhAsEducSecondary: _dsEducAttSchema.nullish(),
  dpPhAsEducCollege: _dsEducAttSchema.nullish(),
  dpPhAsEducMasters: _dsEducAttSchema.nullish(),
  dpPhAsEducDoctorate: _dsEducAttSchema.nullish(),
  dpPhAsEducSpecialProg: _dsEducAttSchema.nullish(),
  dpPhAsEducOthers: _dsEducAttSchema.nullish(),
  dpPhAsAttachmentCOEUrl: z.string().nullish(),
  dpPhAsAttachmentDiplomaUrl: z.string().nullish(),
  dpPhAsAttachmentCOAUrl: z.string().nullish()
})

export const _dpChainClassDetailsSchema = z.object({
  branchName: z.string().nullish(),
  address: z.string().nullish(),
  emailAdd: z.string().email().nullish(),
  mobileNo: z.string().nullish(),
  telNo: z.string().nullish(),
  fdaLtoNo: z.string().nullish(),
  fdaDateIssued: z.coerce.date().nullish(),
  fdaDateExpiry: z.coerce.date().nullish(),
  fdaUrlAttachment: z.string().nullish(),
  docNo: z.string().nullish(),
  docDateIssued: z.coerce.date().nullish(),
  docDateExpiry: z.coerce.date().nullish(),
  docUrlAttachment: z.string().nullish(),
  managerOic: z.string().nullish(),
  dpPhLastName: z.string().nullish(),
  dpPhFirstName: z.string().nullish(),
  dpPhMiddleName: z.string().nullish(),
  dpPhAddress: z.string().nullish(),
  dpPhNameInCert: z.string().nullish(),
  dpPhOtherName: z.string().nullish(),
  dpPhLicenseNo: z.string().nullish(),
  dpPhDateIssued: z.coerce.date().nullish(),
  dpPhExpDate: z.coerce.date().nullish(),
  dpPhAsLastName: z.string().nullish(),
  dpPhAsFirstName: z.string().nullish(),
  dpPhAsMiddleName: z.string().nullish(),
  dpPhAsAddress: z.string().nullish(),
  dpDateEstablished: z.coerce.date().nullish(),
  dpSetup: z.string().nullish(),
  dpLocation: z.string().nullish(),
  dpStoreHours: z.string().nullish(),
  dpInvSystem: z.string().nullish()
})

const _dpChainSchema = z.object({
  dsClass: z.literal('chain'),
  dpBranches: z.array(_dpChainClassDetailsSchema)
})

const _dpDSClassOthers = z.object({
  dsClass: z.literal('others')
})

const _dpDSClassDetails = z.discriminatedUnion('dsClass', [_dpPharmacistSchema, _dpChainSchema, _dpDSClassOthers]).optional()

const _dsProfile = z.object({
  dpDateEstablished: z.coerce.date().nullish(),
  dpSetup: z.string().nullish(),
  dpLocation: z.string().nullish(),
  dpStoreHours: z.string().nullish(),
  dpInvSystem: z.string().nullish(),
  dpDSClassDetails: _dpDSClassDetails
})

const _opDsapMemberOwner = z.object({
  opDsapMemberType: z.literal('owner')
})

const _opDsapMemberRep = z.object({
  opDsapMemberType: z.literal('representative'),
  opRepFormUrl: z.string().nullish(),
  opRepPhotoUrl: z.string().nullish()
})

const _opDsapMember = z.discriminatedUnion('opDsapMemberType', [_opDsapMemberOwner, _opDsapMemberRep]).nullish()

const _ownerProfile = z.object({
  opFirstName: z.string().nullish(),
  opLastName: z.string().nullish(),
  opMiddleName: z.string().nullish(),
  opPhImageUrl: z.string().nullish(),
  opAddress: z.string().nullish(),
  opBirthday: z.coerce.date().nullish(),
  opEmail: z.string().nullish(),
  opTelNo: z.string().nullish(),
  opCellNo: z.string().nullish(),
  opStatus: z.string().nullish(),
  opGender: z.string().nullish(),
  opEducCollege: _dsEducAttSchema.nullish(),
  opEducMasters: _dsEducAttSchema.nullish(),
  opEducDoctorate: _dsEducAttSchema.nullish(),
  opEducSpecialProg: _dsEducAttSchema.nullish(),
  opEducOthers: _dsEducAttSchema.nullish(),
  opDsapMember: _opDsapMember
  // opDsapMember: z.string({ required_error: 'Please select who will be the DSAP Member.' })
})

const _registrationDetails = z.object({
  fdaLtoNo: z.string().nullish(),
  fdaDateIssued: z.coerce.date().nullish(),
  fdaDateExpiry: z.coerce.date().nullish(),
  fdaUrlAttachment: z.string().nullish(),
  bpNo: z.string().nullish(),
  bpDateIssued: z.coerce.date().nullish(),
  bpDateExpiry: z.coerce.date().nullish(),
  bpUrlAttachment: z.string().nullish(),

  docNo: z.string().nullish(),
  docDateIssued: z.coerce.date().nullish(),
  docDateExpiry: z.coerce.date().nullish(),
  docUrlAttachment: z.string().nullish()
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const _uploadPayment = z.object({
  proofOfPaymentUrl: z.string().nullish()
  // ownershipTypeDetails: z.discriminatedUnion('type', [singleProp, corporate, partnership])
})

export const _MemberRegistrationFormSchema = [_generalInfo, _dsProfile, _ownerProfile, _registrationDetails]
export const _MemberRegistrationMergeSchema = _generalInfo
  .merge(_dsProfile)
  .merge(_ownerProfile)
  .merge(_registrationDetails)
  .merge(_uploadPayment)

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

export type DrugstoreChainClassBranch = z.infer<typeof dpChainClassDetailsSchema>
export type DrugStoreChainClassDetails = z.infer<typeof dpChainSchema>
export type DrugStoreSingleClassDetails = z.infer<typeof dpPharmacistSchema>
export type OwnerProfileRepresentativeMemberType = z.infer<typeof opDsapMemberRep>

// NATIONAL CONVENTION
export const title = ['Mr.', 'Mrs.', 'Ms.', 'Rph.', 'Dr.'] as const

const regPharmacistDetails = z.object({
  prcLicenseNo: z.string({ required_error: 'Please enter PRC License No.' }),
  dateIssued: z.coerce.date({
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_date') {
        return { message: `Invalid Date Issued` }
      }
      return { message: ctx.defaultError }
    }
  }),
  expiryDate: z.coerce.date({
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_date') {
        return { message: `Invalid Expiry Date` }
      }
      return { message: ctx.defaultError }
    }
  })
})

const regPharmacistMember = z
  .object({
    memberType: z.literal('CPhAD Member'),
    cphadIdNo: z.string({ required_error: 'Please enter CPhAD ID No.' })
  })
  .merge(regPharmacistDetails)

const regPharmacistNonMember = z
  .object({
    memberType: z.literal('Non-Member')
  })
  .merge(regPharmacistDetails)

const regPharmacistMembership = z.discriminatedUnion('memberType', [regPharmacistMember, regPharmacistNonMember], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_union_discriminator')
      return { message: `Please select CPhAD membership type. Expected ${issue.options.join(' | ')}` }
    return { message: ctx.defaultError }
  }
})

const regDelegateNonPharmacist = z.object({
  delegateClass: z.literal('Non-Pharmacist'),
  title: z.string()
})

const regDelegatePharmacist = z.object({
  delegateClass: z.literal('Pharmacist'),
  regPharmacistMembership
})

const regDelegate = z.discriminatedUnion('delegateClass', [regDelegateNonPharmacist, regDelegatePharmacist], {
  required_error: 'Please select Delegate type.'
})

export const ConventionRegistrationFormSchema = z.object({
  regDelegate,
  // regDelegatePharmacist,
  // pharmacist: z
  //   .object({
  //     type: z.string({ required_error: 'Please select CPhAD membership type.' }),
  //     cphadIdNo: z.string(),
  //     prcLicenseNo: z.string(),
  //     dateIssued: z.coerce.date(),
  //     expiryDate: z.coerce.date()
  //   })
  //   .optional(),

  convention: z.string(),
  type: z.string(),
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
  proofOfPaymentUrl: z.string({ required_error: 'Proof of payment is required.' }).min(1, { message: 'Proof of payment is required.' })
})

export type ConventionRegistrationForm = z.infer<typeof ConventionRegistrationFormSchema>

// MEMBER AUTH
export const MemberAuthFormSchema = z.object({
  code: z.string().min(1, { message: 'Please enter a code.' })
})

export const MemberAuthEmailFormSchema = z.object({
  email: z.string().min(1, { message: 'Please enter an email.' }).email()
})

export const PostFormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long'
    })
    .max(128, {
      message: 'Title must be less than 128 characters long'
    }),
  description: z.string().min(1, { message: 'Please enter a description.' }),
  content: z.string().optional(),
  image: z.string().optional(),
  imagesGallery: z.array(z.string()).optional()
})

export type PostForm = z.infer<typeof PostFormSchema>

export const PostSettingsDialogFormSchema = z.object({
  id: z.string().min(1, { message: 'Please enter post id.' }),
  slug: z.string({ required_error: 'Please enter slug.' }).min(1, { message: 'Please enter slug.' }),
  image: z.string().optional(),
  imagesGallery: z.array(z.string()).optional()
})

export type PostSettingsDialogForm = z.infer<typeof PostSettingsDialogFormSchema>
