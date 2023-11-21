import z from 'zod'

export const ContactFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  emailAdd: z.string().email(),
  phoneNo: z.string(),
  message: z.string().optional()
})

export type ContactForm = z.infer<typeof ContactFormSchema>
