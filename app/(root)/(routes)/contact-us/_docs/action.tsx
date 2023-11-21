'use server'

import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { Email } from './email'
import { ContactForm } from './types'

export async function contactInquiryAction(formData: ContactForm) {
  const transporter = nodemailer.createTransport({
    host: 'sg3plcpnl0118.prod.sin3.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: 'test@boredguyscorp.com',
      pass: '123456'
    }
  })

  const options = {
    from: 'test@boredguyscorp.com',
    to: 'bginside.dev@gmail.com',
    subject: 'Website Contact Inquiry',
    html: render(<Email formData={formData} />)
  }

  const result = await transporter.sendMail(options)

  return result
}
