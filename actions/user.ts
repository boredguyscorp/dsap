'use server'

import db from '@/lib/db'
import { SignUpDto } from '@/lib/schema'
import { PromiseGenerics } from '@/types'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

// export type LocationEntity = PromiseGenerics<typeof getLocation>

export async function createUser(data: SignUpDto) {
  try {
    const result = await db.user.create({ data })

    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error(`Duplicate entry. `)
      }

      throw new Error(`Prisma error. `)
    }

    throw new Error('This error is in the Server Action')
  }
}
