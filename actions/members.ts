'use server'

import { UpdateMembershipStatus } from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import db from '@/lib/db'
import { MemberRegistrationForm } from '@/lib/schema'
import { generateRandomString, generateNumberString } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

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

export async function updateStatusAction({ id, status }: UpdateMembershipStatus) {
  await db.members.update({ where: { id }, data: { status } })

  revalidatePath('/membership')
}
