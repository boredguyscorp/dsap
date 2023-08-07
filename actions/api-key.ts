'use server'

import db from '@/lib/db'
import { CreateApiKeyDto } from '@/lib/schema'
import { PromiseGenerics } from '@/types'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'
import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { notFound } from 'next/navigation'

export type ApiKeyEntity = PromiseGenerics<typeof getApiKey>

type Payload = {
  businessId: string
  location: string
}

const secret = process.env.API_KEY_SIGNATURE_SECRET || '@Test123'

function generateApiKey(_payload: Payload, expiresIn: string) {
  const key = sign(_payload, secret, { expiresIn })
  const payload = verify(key, secret) as JwtPayload

  return { key, payload }
}

export async function createApiKey(data: CreateApiKeyDto, options?: { pathname?: string }) {
  try {
    const { expiresIn, ...restOfData } = data

    const { key, payload } = generateApiKey({ businessId: data.businessId, location: data.locationId }, expiresIn)

    if (payload && payload.exp) {
      const expiresAt = new Date(payload.exp * 1000)
      const dataCompose = { ...restOfData, key, expiresAt, expiresIn }

      const result = await db.apiKey.create({ data: dataCompose })

      if (options) {
        if (options.pathname) revalidatePath(options.pathname)
      }

      return result
    }

    return { success: false }
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

export async function getApiKey(businessId: string) {
  try {
    const result = await db.apiKey.findMany({
      where: { businessId },
      include: { location: { select: { id: true, code: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error. `)
    }
    throw new Error('This error is in the Server Action')
  }
}

export async function revokeApiKey(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await db.apiKey.update({ data: { revokedAt: new Date() }, where: { id } })

    // await db.apiKey.delete({ where: { id } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error.`)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function rollApiKey(id: string) {
  try {
    // const key = String(Math.random().toString())

    const apiKeyData = await findApiKeyById(id)
    const { key, payload } = generateApiKey({ businessId: apiKeyData.businessId, location: apiKeyData.locationId }, apiKeyData.expiresIn)

    if (payload && payload.exp) {
      const result = await db.apiKey.update({ data: { key }, where: { id } })

      return result
    }

    return { success: false }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error. `)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function findApiKeyById(id: string) {
  const result = await db.apiKey.findUnique({
    where: {
      id
    }
  })

  if (result) {
    return result
  } else {
    notFound()
  }
}
