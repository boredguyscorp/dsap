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

export async function registerConvention(formData: ConventionRegistrationForm) {
  const code = generateRandomString(4).toUpperCase() + '-' + generateNumberString(4)
  const { title, ...restFormData } = formData
  const data = { ...restFormData, title: title === 'Select Title' ? null : title, code }

  try {
    await db.registration.create({ data })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    })

    const options: Mail.Options = {
      from: process.env.NODEMAILER_EMAIL,
      to: formData.emailAdd,
      subject: `New Registration ${formData.convention} DSAP National Convention`,
      html: render(<EmailRegistrationConvention formData={formData} />)
    }

    await transporter.sendMail(options)

    // await new Promise((res) => setTimeout(res, 2500))

    return { code }
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

    revalidatePath('/national-convention')
  } catch (error) {
    throw error
  }
}
