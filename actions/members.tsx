'use server'

import { UpdateMembershipStatus } from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import db from '@/lib/db'
import {
  DrugStoreChainClassDetails,
  DrugStoreSingleClassDetails,
  MemberDrugStoreProfile,
  MemberOwnerProfile,
  MemberRegistrationForm,
  OwnerProfileRepresentativeMemberType
} from '@/lib/schema'
import { generateRandomString, generateNumberString, generateOTP, extractFileKeyFromUrl } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { EmailMembershipStatus, EmailOtp } from '@/app/(root)/(routes)/membership/_docs/email'

import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'
import { Members } from '@prisma/client'
import { notFound } from 'next/navigation'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export type MemberEntity = Awaited<ReturnType<typeof findMemberById>>

export async function registerMember(formValues: MemberRegistrationForm, formData: FormData) {
  const code = generateRandomString(4).toUpperCase() + '-' + generateNumberString(4)
  const data = { ...formValues, code }

  console.log('FormData =', formData)

  try {
    const isEmailExist = !data.emailAdd ? [] : await db.members.findMany({ where: { emailAdd: data.emailAdd } })

    if (isEmailExist.length > 0) return { status: 409, message: 'Email already exists.' }

    //? get values from formData
    const dpPhImageUrlFile = formData.get('dpPhImageUrl') as File
    const dpPhAsImageUrlFile = formData.get('dpPhAsImageUrl') as File
    const dpPhAsAttachmentCOEUrlFile = formData.get('dpPhAsAttachmentCOEUrl') as File
    const dpPhAsAttachmentDiplomaUrlFile = formData.get('dpPhAsAttachmentDiplomaUrl') as File
    const dpPhAsAttachmentCOAUrlFile = formData.get('dpPhAsAttachmentCOAUrl') as File

    const opPhImageUrlFile = formData.get('opPhImageUrl') as File

    const opRepFormUrlFile = formData.get('opRepFormUrl') as File
    const opRepPhotoUrlFile = formData.get('opRepPhotoUrl') as File

    const fdaUrlAttachmentFile = formData.get('fdaUrlAttachment') as File
    const bpUrlAttachmentFile = formData.get('bpUrlAttachment') as File
    const docUrlAttachmentFile = formData.get('docUrlAttachment') as File
    const proofOfPaymentUrlFile = formData.get('proofOfPaymentUrl') as File | null

    const branchesFiles: { fdaUrlAttachment: File | null; docUrlAttachment: File | null }[] = []

    if (
      data.dpDSClassDetails &&
      data.dpDSClassDetails.dsClass === 'chain' &&
      data.dpDSClassDetails.dpBranches &&
      data.dpDSClassDetails.dpBranches.length > 0
    ) {
      const branches = data.dpDSClassDetails.dpBranches

      branches.forEach((branch, index) => {
        branchesFiles.push({
          fdaUrlAttachment: formData.get(`dpbranch-${index}-fdaUrlAttachment`) as File,
          docUrlAttachment: formData.get(`dpbranch-${index}-docUrlAttachment`) as File
        })
      })
    }

    //?? process upload
    let dpClassSingleUploads: string[] = []
    let dpclassChainUploads: { fdaUrlAttachment: string | null; docUrlAttachment: string | null }[] = []
    let opRepUploads: { opRepFormUrl: string; opRepPhotoUrl: string } = { opRepFormUrl: '', opRepPhotoUrl: '' }

    if (data.drugstoreClass === 'single') {
      const uploadedFiles = await utapi.uploadFiles([
        dpPhImageUrlFile,
        dpPhAsImageUrlFile,
        dpPhAsAttachmentCOEUrlFile,
        dpPhAsAttachmentDiplomaUrlFile,
        dpPhAsAttachmentCOAUrlFile
      ])

      dpClassSingleUploads = uploadedFiles.map((file) => file.data?.url ?? '')
    }

    if (data.drugstoreClass === 'chain') {
      for (const b of branchesFiles) {
        const fdaUrlAttachment = b.fdaUrlAttachment ? await utapi.uploadFiles(b.fdaUrlAttachment as File) : null
        const docUrlAttachment = b.docUrlAttachment ? await utapi.uploadFiles(b.docUrlAttachment as File) : null

        dpclassChainUploads.push({
          fdaUrlAttachment: fdaUrlAttachment?.data?.url ?? '',
          docUrlAttachment: docUrlAttachment?.data?.url ?? ''
        })
      }
    }

    if (data.opDsapMember && data.opDsapMember.opDsapMemberType === 'representative') {
      const [opRepFormUrl, opRepPhotoUrl] = await utapi.uploadFiles([opRepFormUrlFile, opRepPhotoUrlFile])

      opRepUploads = {
        opRepFormUrl: opRepFormUrl.data?.url ?? '',
        opRepPhotoUrl: opRepPhotoUrl.data?.url ?? ''
      }
    }

    const [opPhImageUrl, fdaUrlAttachment, bpUrlAttachment, docUrlAttachment, proofOfPaymentUrl] = await utapi.uploadFiles([
      opPhImageUrlFile,
      fdaUrlAttachmentFile,
      bpUrlAttachmentFile,
      docUrlAttachmentFile,
      ...(proofOfPaymentUrlFile ? [proofOfPaymentUrlFile] : [])
    ])

    const result = await db.members.create({
      data: {
        ...data,
        ...(data.drugstoreClass === 'single' &&
          data.dpDSClassDetails &&
          data.dpDSClassDetails.dsClass === 'single' && {
            dpDSClassDetails: {
              ...data.dpDSClassDetails,
              dpPhImageUrl: dpClassSingleUploads[0],
              dpPhAsImageUrl: dpClassSingleUploads[1],
              dpPhAsAttachmentCOEUrl: dpClassSingleUploads[2],
              dpPhAsAttachmentDiplomaUrl: dpClassSingleUploads[3],
              dpPhAsAttachmentCOAUrl: dpClassSingleUploads[4]
            }
          }),
        ...(data.drugstoreClass === 'chain' &&
          data.dpDSClassDetails &&
          data.dpDSClassDetails.dsClass === 'chain' && {
            dpDSClassDetails: {
              ...data.dpDSClassDetails,
              dpBranches: data.dpDSClassDetails.dpBranches.map((branch, index) => ({
                ...branch,
                fdaUrlAttachment: dpclassChainUploads[index].fdaUrlAttachment ?? '',
                docUrlAttachment: dpclassChainUploads[index].docUrlAttachment ?? ''
              }))
            }
          }),
        ...(data.opDsapMember &&
          data.opDsapMember.opDsapMemberType === 'representative' && {
            opDsapMember: {
              ...data.opDsapMember,
              opRepFormUrl: opRepUploads.opRepFormUrl,
              opRepPhotoUrl: opRepUploads.opRepPhotoUrl
            }
          }),
        opPhImageUrl: opPhImageUrl.data?.url ?? '',
        fdaUrlAttachment: fdaUrlAttachment.data?.url ?? '',
        bpUrlAttachment: bpUrlAttachment.data?.url ?? '',
        docUrlAttachment: docUrlAttachment.data?.url ?? '',
        proofOfPaymentUrl: proofOfPaymentUrl ? proofOfPaymentUrl.data?.url ?? '' : ''
      }
    })

    const chapterResult = result.chapter
      ? await db.chapter.findUnique({ where: { id: result.chapter }, select: { id: true, code: true, name: true } })
      : null

    await emailMembershipStatus({ ...result, chapter: chapterResult?.name })

    revalidatePath('/membership')

    return { code }
  } catch (error) {
    console.log('registerMember server action:', error)
    throw error
  }
}

export async function updateMember(formValues: MemberRegistrationForm & { id: string }, formData: FormData) {
  try {
    const member = await db.members.findUnique({ where: { id: formValues.id } })

    console.log('formData = ', formData)

    if (!member) notFound()

    const isEmailExist = !formValues.emailAdd
      ? []
      : await db.members.findMany({ where: { emailAdd: formValues.emailAdd, code: { not: member.code } } })

    if (isEmailExist.length > 0) return { status: 409, message: 'Email already exists.' }

    //? get file value from formData
    const dpPhImageUrlFile = formData.get('dpPhImageUrl') as File | null
    const dpPhAsImageUrlFile = formData.get('dpPhAsImageUrl') as File | null
    const dpPhAsAttachmentCOEUrlFile = formData.get('dpPhAsAttachmentCOEUrl') as File | null
    const dpPhAsAttachmentDiplomaUrlFile = formData.get('dpPhAsAttachmentDiplomaUrl') as File | null
    const dpPhAsAttachmentCOAUrlFile = formData.get('dpPhAsAttachmentCOAUrl') as File | null

    const opPhImageUrlFile = formData.get('opPhImageUrl') as File | null

    const opRepFormUrlFile = formData.get('opRepFormUrl') as File | null
    const opRepPhotoUrlFile = formData.get('opRepPhotoUrl') as File | null

    const fdaUrlAttachmentFile = formData.get('fdaUrlAttachment') as File | null
    const bpUrlAttachmentFile = formData.get('bpUrlAttachment') as File | null
    const docUrlAttachmentFile = formData.get('docUrlAttachment') as File | null
    const proofOfPaymentUrlFile = formData.get('proofOfPaymentUrl') as File | null

    const branchesFiles: { fdaUrlAttachment: File | null; docUrlAttachment: File | null }[] = []

    if (
      formValues.dpDSClassDetails &&
      formValues.dpDSClassDetails.dsClass === 'chain' &&
      formValues.dpDSClassDetails.dpBranches &&
      formValues.dpDSClassDetails.dpBranches.length > 0
    ) {
      const branches = formValues.dpDSClassDetails.dpBranches

      branches.forEach((branch, index) => {
        branchesFiles.push({
          fdaUrlAttachment: formData.get(`dpbranch-${index}-fdaUrlAttachment`) as File,
          docUrlAttachment: formData.get(`dpbranch-${index}-docUrlAttachment`) as File
        })
      })
    }

    //? process upload
    let dpClassSingleUploads: (string | null)[] = []
    let dpclassChainUploads: { fdaUrlAttachment: string | null; docUrlAttachment: string | null }[] = []
    let opRepUploads: { opRepFormUrl: string | null; opRepPhotoUrl: string | null } = { opRepFormUrl: '', opRepPhotoUrl: '' }

    //? if member changed to other drugstore class (e.g from "single" to "chain"), all related files from "single" class should be deleted
    //? check if member class is equal to newly pass data of member class, if not equal delete the files related to previous class of member
    if (formValues.drugstoreClass !== member.drugstoreClass) {
      if (member.drugstoreClass === 'single') {
        const dpDSClassDetailsMembersData = member.dpDSClassDetails as any as DrugStoreSingleClassDetails

        await utapi.deleteFiles([
          extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhImageUrl),
          extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsImageUrl),
          extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentCOEUrl),
          extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentDiplomaUrl),
          extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentCOAUrl)
        ])
      } else if (member.drugstoreClass === 'chain') {
        const dpDSClassDetailsMembersData = member.dpDSClassDetails as any as DrugStoreChainClassDetails
        const branches = dpDSClassDetailsMembersData.dpBranches
        const promises: Promise<{ success: boolean }>[] = []

        branches.forEach((branch) => {
          if (branch.fdaUrlAttachment) promises.push(utapi.deleteFiles(extractFileKeyFromUrl(branch.fdaUrlAttachment)))
          if (branch.docUrlAttachment) promises.push(utapi.deleteFiles(extractFileKeyFromUrl(branch.docUrlAttachment)))
        })

        await Promise.all(promises)
      }
    }

    //? check if member chaged membership type (e.g. representative to owner)
    //? check if member type is equal to newly pass data of opDsapMember.memberType, if not equal delete the files related to previous member type
    if (formValues.opDsapMember.opDsapMemberType !== (member.opDsapMember as MemberOwnerProfile['opDsapMember']).opDsapMemberType) {
      if ((member.opDsapMember as MemberOwnerProfile['opDsapMember']).opDsapMemberType === 'representative') {
        const opDsapMemberMembersData = member.opDsapMember as OwnerProfileRepresentativeMemberType
        await utapi.deleteFiles([
          extractFileKeyFromUrl(opDsapMemberMembersData.opRepFormUrl),
          extractFileKeyFromUrl(opDsapMemberMembersData.opRepPhotoUrl)
        ])
      }
    }

    if (formValues.drugstoreClass === 'single') {
      //? deletion of previously uploaded files which will replace by new ones
      const dpDSClassDetailsMembersData = member.dpDSClassDetails as any as DrugStoreSingleClassDetails

      const dpPhImageUrlFileKey = extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhImageUrl)
      const dpPhAsImageUrlFileKey = extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsImageUrl)
      const dpPhAsAttachmentCOEUrFileKey = extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentCOEUrl)
      const dpPhAsAttachmentDiplomaUrFileKey = extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentDiplomaUrl)
      const dpPhAsAttachmentCOAUrlFileKey = extractFileKeyFromUrl(dpDSClassDetailsMembersData.dpPhAsAttachmentCOAUrl)

      const dpPhImageUrlDeleted = dpPhImageUrlFile && dpPhImageUrlFileKey ? utapi.deleteFiles(dpPhImageUrlFileKey) : null
      const dpPhAsImageUrlDeleted = dpPhAsImageUrlFile && dpPhAsImageUrlFileKey ? utapi.deleteFiles(dpPhAsImageUrlFileKey) : null
      const dpPhAsAttachmentCOEUrlDeleted = dpPhAsAttachmentCOEUrlFile && dpPhAsAttachmentCOEUrFileKey ? utapi.deleteFiles(dpPhAsAttachmentCOEUrFileKey) : null // prettier-ignore
      const dpPhAsAttachmentDiplomaUrlDeleted = dpPhAsAttachmentDiplomaUrlFile && dpPhAsAttachmentDiplomaUrFileKey ? utapi.deleteFiles(dpPhAsAttachmentDiplomaUrFileKey) : null // prettier-ignore
      const dpPhAsAttachmentCOAUrlDelete = dpPhAsAttachmentCOAUrlFile && dpPhAsAttachmentCOAUrlFileKey ? utapi.deleteFiles(dpPhAsAttachmentCOAUrlFileKey) : null // prettier-ignore

      await Promise.all([
        dpPhImageUrlDeleted,
        dpPhAsImageUrlDeleted,
        dpPhAsAttachmentCOEUrlDeleted,
        dpPhAsAttachmentDiplomaUrlDeleted,
        dpPhAsAttachmentCOAUrlDelete
      ])

      //? uploading new files which will replace the old uploaded files
      const dpPhImageUrlUploaded = dpPhImageUrlFile ? utapi.uploadFiles(dpPhImageUrlFile) : null
      const dpPhAsImageUrlUploaded = dpPhAsImageUrlFile ? utapi.uploadFiles(dpPhAsImageUrlFile) : null
      const dpPhAsAttachmentCOEUrlUploaded = dpPhAsAttachmentCOEUrlFile ? utapi.uploadFiles(dpPhAsAttachmentCOEUrlFile) : null
      const dpPhAsAttachmentDiplomaUrlUploaded = dpPhAsAttachmentDiplomaUrlFile ? utapi.uploadFiles(dpPhAsAttachmentDiplomaUrlFile) : null
      const dpPhAsAttachmentCOAUrlUploaded = dpPhAsAttachmentCOAUrlFile ? utapi.uploadFiles(dpPhAsAttachmentCOAUrlFile) : null

      const uploadedFiles = await Promise.all([
        dpPhImageUrlUploaded,
        dpPhAsImageUrlUploaded,
        dpPhAsAttachmentCOEUrlUploaded,
        dpPhAsAttachmentDiplomaUrlUploaded,
        dpPhAsAttachmentCOAUrlUploaded
      ])

      dpClassSingleUploads = uploadedFiles.map((file) => {
        if (file) return file.data?.url ?? ''
        return null
      })
    }

    if (formValues.drugstoreClass === 'chain') {
      //? delete all files related from the branches for simplicity of the logic, then upload new ones for

      const dpDSClassDetailsMembersData = member.dpDSClassDetails as any as DrugStoreChainClassDetails
      const branches = dpDSClassDetailsMembersData.dpBranches

      if (branches && branches.length > 0) {
        const promises: Promise<{ success: boolean }>[] = []

        branches.forEach((branch) => {
          if (branch.fdaUrlAttachment) {
            const fdaUrlAttachmentFileKey = extractFileKeyFromUrl(branch.fdaUrlAttachment)
            if (fdaUrlAttachmentFileKey) promises.push(utapi.deleteFiles(fdaUrlAttachmentFileKey))
          }

          if (branch.docUrlAttachment) {
            const docUrlAttachmentFileKey = extractFileKeyFromUrl(branch.docUrlAttachment)
            if (docUrlAttachmentFileKey) promises.push(utapi.deleteFiles(docUrlAttachmentFileKey))
          }
        })

        await Promise.all(promises)
      }

      for (const b of branchesFiles) {
        const fdaUrlAttachment = b.fdaUrlAttachment ? await utapi.uploadFiles(b.fdaUrlAttachment as File) : null
        const docUrlAttachment = b.docUrlAttachment ? await utapi.uploadFiles(b.docUrlAttachment as File) : null

        dpclassChainUploads.push({
          fdaUrlAttachment: fdaUrlAttachment?.data?.url ?? '',
          docUrlAttachment: docUrlAttachment?.data?.url ?? ''
        })
      }
    }

    if (formValues.opDsapMember && formValues.opDsapMember.opDsapMemberType === 'representative') {
      const opDsapMemberMembersData = member.opDsapMember as OwnerProfileRepresentativeMemberType

      //? deletion of previously uploaded files which will replace by new ones
      const opRepFormUrlFileKey = extractFileKeyFromUrl(opDsapMemberMembersData.opRepFormUrl)
      const opRepPhotoUrlFileKey = extractFileKeyFromUrl(opDsapMemberMembersData.opRepPhotoUrl)

      const opRepFormUrlDeleted = opRepFormUrlFile && opRepFormUrlFileKey ? utapi.deleteFiles(opRepFormUrlFileKey) : null
      const opRepPhotoUrlDeleted = opRepPhotoUrlFile && opRepPhotoUrlFileKey ? utapi.deleteFiles(opRepPhotoUrlFileKey) : null

      await Promise.all([opRepFormUrlDeleted, opRepPhotoUrlDeleted])

      //? uploading new files which will replace the old uploaded files
      const opRepFormUrlUploaded = opRepFormUrlFile ? utapi.uploadFiles(opRepFormUrlFile) : null
      const opRepPhotoUrlUploaded = opRepPhotoUrlFile ? utapi.uploadFiles(opRepPhotoUrlFile) : null

      const [opRepFormUrl, opRepPhotoUrl] = await Promise.all([opRepFormUrlUploaded, opRepPhotoUrlUploaded])

      opRepUploads = {
        opRepFormUrl: opRepFormUrl ? opRepFormUrl.data?.url ?? '' : null,
        opRepPhotoUrl: opRepPhotoUrl ? opRepPhotoUrl.data?.url ?? '' : null
      }
    }

    //? deletion of previously uploaded files which will replace by new ones
    const opPhImageUrlFileKey = extractFileKeyFromUrl(member.opPhImageUrl)
    const fdaUrlAttachmentFileKey = extractFileKeyFromUrl(member.fdaUrlAttachment ?? '')
    const bpUrlAttachmentFileKey = extractFileKeyFromUrl(member.bpUrlAttachment ?? '')
    const docUrlAttachmentFileKey = extractFileKeyFromUrl(member.docUrlAttachment ?? '')
    const proofOfPaymentUrlFileKey = extractFileKeyFromUrl(member.proofOfPaymentUrl ?? '')

    const opPhImageUrlDeleted = opPhImageUrlFile && opPhImageUrlFileKey ? utapi.deleteFiles(opPhImageUrlFileKey) : null
    const fdaUrlAttachmentDeleted = fdaUrlAttachmentFile && fdaUrlAttachmentFileKey ? utapi.deleteFiles(fdaUrlAttachmentFileKey) : null
    const bpUrlAttachmentDeleted = bpUrlAttachmentFile && bpUrlAttachmentFileKey ? utapi.deleteFiles(bpUrlAttachmentFileKey) : null
    const docUrlAttachmentDeleted = docUrlAttachmentFile && docUrlAttachmentFileKey ? utapi.deleteFiles(docUrlAttachmentFileKey) : null
    const proofOfPaymentUrlDeleted = proofOfPaymentUrlFile && proofOfPaymentUrlFileKey ? utapi.deleteFiles(proofOfPaymentUrlFileKey) : null

    //? user pass empty/no-value data for optional field files property then delete the file if he previously uploaded for that field if it exist
    //? e.g proofOfPaymentUrl, if user does not provide value but he/she previouly uploaded a file for that field, thus uploaded file should be deleted
    if (!proofOfPaymentUrlFile && !formValues.proofOfPaymentUrl && member.proofOfPaymentUrl) {
      await utapi.deleteFiles(extractFileKeyFromUrl(member.proofOfPaymentUrl))
    }

    await Promise.all([
      opPhImageUrlDeleted,
      fdaUrlAttachmentDeleted,
      bpUrlAttachmentDeleted,
      docUrlAttachmentDeleted,
      proofOfPaymentUrlDeleted
    ])

    // //? uploading of files new files which will replace the old uploaded files
    const opPhImageUrlUploaded = opPhImageUrlFile ? utapi.uploadFiles(opPhImageUrlFile) : null
    const fdaUrlAttachmentUploaded = fdaUrlAttachmentFile ? utapi.uploadFiles(fdaUrlAttachmentFile) : null
    const bpUrlAttachmentUploaded = bpUrlAttachmentFile ? utapi.uploadFiles(bpUrlAttachmentFile) : null
    const docUrlAttachmentUploaded = docUrlAttachmentFile ? utapi.uploadFiles(docUrlAttachmentFile) : null
    const proofOfPaymentUrlUploaded = proofOfPaymentUrlFile ? utapi.uploadFiles(proofOfPaymentUrlFile) : null

    const [opPhImageUrl, fdaUrlAttachment, bpUrlAttachment, docUrlAttachment, proofOfPaymentUrl] = await Promise.all([
      opPhImageUrlUploaded,
      fdaUrlAttachmentUploaded,
      bpUrlAttachmentUploaded,
      docUrlAttachmentUploaded,
      proofOfPaymentUrlUploaded
    ])

    await db.members.update({
      data: {
        ...formValues,
        status: member.status === 'import' ? 'updated' : member.status,
        ...(formValues.drugstoreClass === 'single' &&
          formValues.dpDSClassDetails &&
          formValues.dpDSClassDetails.dsClass === 'single' && {
            dpDSClassDetails: {
              ...formValues.dpDSClassDetails,
              dpPhImageUrl: dpClassSingleUploads[0] ?? (member.dpDSClassDetails as any as DrugStoreSingleClassDetails).dpPhImageUrl,
              dpPhAsImageUrl: dpClassSingleUploads[1] ?? (member.dpDSClassDetails as any as DrugStoreSingleClassDetails).dpPhAsImageUrl,
              dpPhAsAttachmentCOEUrl: dpClassSingleUploads[2] ?? (member.dpDSClassDetails as any as DrugStoreSingleClassDetails).dpPhAsAttachmentCOEUrl, // prettier-ignore
              dpPhAsAttachmentDiplomaUrl: dpClassSingleUploads[3] ?? (member.dpDSClassDetails as any as DrugStoreSingleClassDetails).dpPhAsAttachmentDiplomaUrl, // prettier-ignore
              dpPhAsAttachmentCOAUrl: dpClassSingleUploads[4] ?? (member.dpDSClassDetails as any as DrugStoreSingleClassDetails).dpPhAsAttachmentCOAUrl // prettier-ignore
            }
          }),
        ...(formValues.drugstoreClass === 'chain' &&
          formValues.dpDSClassDetails &&
          formValues.dpDSClassDetails.dsClass === 'chain' && {
            dpDSClassDetails: {
              ...formValues.dpDSClassDetails,
              dpBranches: formValues.dpDSClassDetails.dpBranches.map((branch, index) => ({
                ...branch,
                fdaUrlAttachment: dpclassChainUploads[index].fdaUrlAttachment ?? '',
                docUrlAttachment: dpclassChainUploads[index].docUrlAttachment ?? ''
              }))
            }
          }),
        ...(formValues.opDsapMember &&
          formValues.opDsapMember.opDsapMemberType === 'representative' && {
            opDsapMember: {
              ...formValues.opDsapMember,
              opRepFormUrl: opRepUploads.opRepFormUrl ?? (member.opDsapMember as any as OwnerProfileRepresentativeMemberType).opRepFormUrl, // prettier-ignore
              opRepPhotoUrl: opRepUploads.opRepPhotoUrl ?? (member.opDsapMember as any as OwnerProfileRepresentativeMemberType).opRepPhotoUrl // prettier-ignore
            }
          }),
        opPhImageUrl: opPhImageUrl ? opPhImageUrl.data?.url ?? '' : member.opPhImageUrl,
        fdaUrlAttachment: fdaUrlAttachment ? fdaUrlAttachment.data?.url ?? '' : member.fdaUrlAttachment,
        bpUrlAttachment: bpUrlAttachment ? bpUrlAttachment.data?.url ?? '' : member.bpUrlAttachment,
        docUrlAttachment: docUrlAttachment ? docUrlAttachment.data?.url ?? '' : member.docUrlAttachment,
        proofOfPaymentUrl: proofOfPaymentUrl ? proofOfPaymentUrl.data?.url ?? '' : formValues.proofOfPaymentUrl ?  member.proofOfPaymentUrl : '' // prettier-ignore
      },
      where: { id: formValues.id }
    })

    revalidatePath('/membership')
  } catch (error) {
    console.log('updateMember server action:', error)
    throw error
  }
}

export async function findMemberById(id: string) {
  try {
    return await db.members.findUnique({ where: { id }, include: { memberChapter: { select: { id: true, code: true, name: true } } } })
  } catch (error) {
    console.log('findMemberById server action:', error)
    throw error
  }
}

export async function updateStatusAction({ id, status }: UpdateMembershipStatus) {
  try {
    await db.members.update({ where: { id }, data: { status } })

    revalidatePath('/membership')
  } catch (error) {
    console.log('updateStatusAction server action', error)
    throw error
  }
}

export async function deleteMember(id: string) {
  try {
    await db.members.delete({ where: { id } })

    revalidatePath('/membership')
  } catch (error) {
    console.log('deleteMember server action', error)
    throw error
  }
}

type isMemberEmailExist =
  | {
      email: string
      action: 'create'
    }
  | { email: string; code: string; action: 'edit' }

export async function isMemberEmailExist(params: isMemberEmailExist) {
  try {
    if (params.action === 'edit') {
      const isExist = await db.members.findMany({ where: { emailAdd: params.email, code: { not: params.code } } })

      return isExist.length > 0
    }

    const isExist = await db.members.findMany({ where: { emailAdd: params.email } })

    return isExist.length > 0
  } catch (error) {
    console.error('isMemberEmailExist server action', error)
    throw error
  }
}

export async function authMember(code: string, otpSecret: string) {
  try {
    const member = await db.members.findMany({ where: { code } })
    const token = generateOTP(otpSecret)

    // console.log({ code, otpSecret }, 'token generate at:', new Date().toTimeString())

    if (member.length < 1) return { status: 404, message: 'Member does not exist' }

    if (member[0].status === 'pending') return { status: 403, message: 'Member cannot proceed!' }

    if (!member[0].emailAdd) return { status: 401, message: 'Membership email not found!' }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    })

    const options: Mail.Options = {
      from: process.env.NODEMAILER_EMAIL,
      to: member[0].emailAdd,
      subject: 'Membership Authentication',
      html: render(<EmailOtp code={token} />)
    }

    await transporter.sendMail(options)

    return { success: true, email: member[0].emailAdd, id: member[0].id }
  } catch (error) {
    console.log('authMember server action:', error)
    throw error
  }
}

export async function resendOTP(otpSecret: string, email: string) {
  try {
    const token = generateOTP(otpSecret)

    // console.log('token generate at:', new Date().toTimeString())

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    })

    const options: Mail.Options = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Membership Authentication',
      html: render(<EmailOtp code={token} />)
    }

    await transporter.sendMail(options)
  } catch (error) {
    console.log('resendOTP server action:', error)
    throw error
  }
}

export async function sendOTPWithEmail(code: string, otpSecret: string, email: string) {
  try {
    const member = await db.members.findMany({ where: { code } })
    const isEmailExist = await db.members.findMany({ where: { emailAdd: email } })
    const token = generateOTP(otpSecret)

    if (member.length < 1) return { success: false }

    if (isEmailExist.length > 0) return { status: 409, message: 'Email already exist.' }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    })

    const options: Mail.Options = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Membership Authentication',
      html: render(<EmailOtp code={token} />)
    }

    await Promise.all([transporter.sendMail(options), db.members.update({ data: { emailAdd: email }, where: { code } })])

    return { success: true, email, id: member[0].id }
  } catch (error) {
    console.log('sendOTPWithEmail server action:', error)
    throw error
  }
}

type UpdateMemberOptions = { options?: { message: string } }

export async function updateMembershipStatusAction({ id, status, options }: UpdateMembershipStatus & UpdateMemberOptions) {
  try {
    let chapter: { id: string; code: string; name: string } | null

    const result = await db.members.update({
      where: { id },
      data: { status, message: options?.message },
      select: {
        code: true,
        message: true,
        opFirstName: true,
        opLastName: true,
        drugStoreName: true,
        chapter: true,
        emailAdd: true,
        status: true
      }
    })

    const chapterResult = result.chapter
      ? await db.chapter.findUnique({ where: { id: result.chapter }, select: { id: true, code: true, name: true } })
      : null

    await emailMembershipStatus({ ...result, chapter: chapterResult?.name })

    revalidatePath('/membership')
  } catch (error) {
    throw error
  }
}

export async function emailMembershipStatus(result: Partial<Members>) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW
    }
  })

  const mailOptions: Mail.Options = {
    from: process.env.NODEMAILER_EMAIL,
    to: result.emailAdd,
    subject:
      result.status === 'approved'
        ? `DSAP Membership Application Confirmation`
        : result.status === 'pending'
        ? 'DSAP Membership Application Pending'
        : 'DSAP Membership Application Rejected',
    html: render(<EmailMembershipStatus data={result} />)
  }

  await transporter.sendMail(mailOptions)
}
