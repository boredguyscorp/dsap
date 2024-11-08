'use server'

import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { render } from '@react-email/render'
import { Email } from './email'
import { ContactForm } from './types'

export async function contactInquiryAction(formData: ContactForm) {
  const transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
      user: process.env.NODEMAILER_EMAIL_CONTACT,
      pass: process.env.NODEMAILER_PW_CONTACT
    }
    // host: 'sg3plcpnl0118.prod.sin3.secureserver.net',
    // port: 465,
    // secure: true,
    // auth: {
    //   user: 'test@boredguyscorp.com',
    //   pass: '123456'
    // }
  })

  const options: Mail.Options = {
    from: process.env.NODEMAILER_EMAIL_CONTACT,
    to: process.env.NODEMAILER_EMAIL_RECEIVER_CONTACT,
    subject: 'Website Contact Inquiry',
    html: render(<Email formData={formData} />)
  }

  await transporter.sendMail(options)

  // transporter.sendMail(options, (error) => {
  //   if (error) {
  //     throw new Error(error.message)
  //   } else {
  //     console.log('Email Sent')
  //     return true
  //   }
  // })
}

// pdjl hhdj hloi ylbj
// ggaq hfmo uyui yddf
