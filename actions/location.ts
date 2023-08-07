'use server'

import db from '@/lib/db'
import { CreateLocationDto } from '@/lib/schema'
import { generateCode, slugify } from '@/lib/utils'
import { PromiseGenerics } from '@/types'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'

export type LocationEntity = PromiseGenerics<typeof getLocation>

export async function createLocation(data: CreateLocationDto, options?: { pathname?: string }) {
  try {
    // TODO: ADD CURRENT USER

    const slug = slugify(data.name)
    const code = 'LOC-' + generateCode()

    const result = await db.location.create({ data: { id: slug, code, ...data } })

    if (options) {
      if (options.pathname) revalidatePath(options.pathname)
    }

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

export async function getLocation(organizationId: string, businessId: string) {
  try {
    const result = await db.location.findMany({ where: { organizationId, businessId }, orderBy: { name: 'asc' } })

    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error. `)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function updateLocation(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await db.location.update({ data: { updatedAt: new Date() }, where: { id } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error.`)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function deleteLocation(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await db.location.update({ data: { deletedAt: new Date() }, where: { id } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error.`)
    }

    throw new Error('This error is in the Server Action')
  }
}
