'use server'

import { UpdateMembershipStatus } from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import db from '@/lib/db'
import { MemberRegistrationForm } from '@/lib/schema'
import { generateRandomString, generateNumberString, generateOTP } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { EmailMembershipStatus, EmailOtp } from '@/app/(root)/(routes)/membership/_docs/email'

import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'
import { Members } from '@prisma/client'
import { notFound } from 'next/navigation'

export type MemberEntity = Awaited<ReturnType<typeof findMemberById>>

export async function registerMember(formData: MemberRegistrationForm) {
  const code = generateRandomString(4).toUpperCase() + '-' + generateNumberString(4)
  const data = { ...formData, code }

  try {
    const isEmailExist = !data.emailAdd ? [] : await db.members.findMany({ where: { emailAdd: data.emailAdd } })

    if (isEmailExist.length > 0) return { status: 409, message: 'Email already exists.' }

    const result = await db.members.create({ data })

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

export async function updateMember(formData: MemberRegistrationForm & { id: string }) {
  try {
    const member = await db.members.findUnique({ where: { id: formData.id } })

    if (!member) notFound()

    const isEmailExist = !formData.emailAdd
      ? []
      : await db.members.findMany({ where: { emailAdd: formData.emailAdd, code: { not: member.code } } })

    if (isEmailExist.length > 0) return { status: 409, message: 'Email already exists.' }

    await db.members.update({
      data: { ...formData, status: member.status === 'import' ? 'updated' : member.status },
      where: { id: formData.id }
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
