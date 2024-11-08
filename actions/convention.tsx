'use server'

import { UpdateMembershipStatus } from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import db from '@/lib/db'
import { ConventionRegistrationForm } from '@/lib/schema'
import { generateRandomString, generateNumberString } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'

import { EmailRegistrationStatus, EmailRegistrationConvention } from '@/app/(root)/(routes)/national-convention/_docs/email'
import { Registration } from '@prisma/client'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function registerConvention(formValues: ConventionRegistrationForm, formData: FormData) {
  const code = generateRandomString(4).toUpperCase() + '-' + generateNumberString(4)

  const { regDelegate, ...restOfData } = formValues

  const delegateClass = regDelegate.delegateClass
  const title = delegateClass === 'Non-Pharmacist' ? regDelegate.title : undefined
  const delegateMembershipInfo = delegateClass === 'Pharmacist' ? regDelegate.regPharmacistMembership : undefined

  const data = { ...restOfData, title, delegateClass, delegateMembershipInfo, code }

  try {
    //? get file value from formData
    const proofOfPaymentUrlFile = formData.get('proofOfPaymentUrl') as File

    //? upload file
    const proofOfPaymentUrl = await utapi.uploadFiles(proofOfPaymentUrlFile)

    await db.registration.create({ data: { ...data, proofOfPaymentUrl: proofOfPaymentUrl.data?.url ?? '' } })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    })

    const options: Mail.Options = {
      from: process.env.NODEMAILER_EMAIL,
      to: formValues.emailAdd,
      subject: `New Registration ${formValues.convention} DSAP National Convention`,
      html: render(<EmailRegistrationConvention formData={{ ...formValues, proofOfPaymentUrl: proofOfPaymentUrl.data?.url ?? '' }} />)
    }

    await transporter.sendMail(options)

    return { code }
  } catch (error) {
    console.log('registerMember server action:', error)
    throw error
  }
}

export async function updateRegistrationDetails(formData: ConventionRegistrationForm, id: string) {
  try {
    await db.registration.update({ data: formData, where: { id } })

    revalidatePath('/convention')

    return { success: true }
  } catch (error) {
    console.log('registerMember server action:', error)
    throw error
  }
}

type UpdateRegOptions = { options?: { message: string } }

export async function updateRegistrationStatusAction({ id, status, options }: UpdateMembershipStatus & UpdateRegOptions) {
  try {
    const result = await db.registration.update({
      where: { id },
      data: { status, message: options?.message },
      select: {
        code: true,
        firstName: true,
        lastName: true,
        drugstoreInfo: true,
        emailAdd: true,
        convention: true,
        message: true,
        status: true
      }
    })

    await emailRegistrationStatus(result)

    revalidatePath('/convention')
  } catch (error) {
    throw error
  }
}

export async function emailRegistrationStatus(result: Partial<Registration>) {
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
        ? `Registration Confirmation ${result.convention} DSAP National Convention`
        : 'DSAP Registration Rejected',
    html: render(<EmailRegistrationStatus data={result} />)
  }

  await transporter.sendMail(mailOptions)
}

// export async function seedChapter() {
//   await db.chapter.deleteMany()
//   await db.chapter.createMany({ data: chaptersArray })
// }
