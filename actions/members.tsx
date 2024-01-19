'use server'

import { UpdateMembershipStatus } from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import db from '@/lib/db'
import { MemberRegistrationForm } from '@/lib/schema'
import { generateRandomString, generateNumberString, generateOTP } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import EmailOtp from '@/app/(root)/(routes)/membership/_docs/email'

import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'

export type MemberEntity = Awaited<ReturnType<typeof findMemberById>>

export async function registerMember(formData: MemberRegistrationForm) {
  const code = generateRandomString(4).toUpperCase() + '-' + generateNumberString(4)
  const data = { ...formData, code }

  try {
    await db.members.create({ data })
    return { code }
  } catch (error) {
    console.log('registerMember server action:', error)
    throw error
  }
}

export async function updateMember(formData: MemberRegistrationForm & { id: string }) {
  try {
    const result = await db.members.update({
      data: formData,
      where: { id: formData.id }
    })

    return result
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
  await db.members.update({ where: { id }, data: { status } })

  revalidatePath('/membership')
}

export async function authMember(code: string, otpSecret: string) {
  try {
    const member = await db.members.findMany({ where: { code } })
    const token = generateOTP(otpSecret)

    // console.log({ code, otpSecret }, 'token generate at:', new Date().toTimeString())

    if (member.length < 1) return { success: false, email: null }

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
