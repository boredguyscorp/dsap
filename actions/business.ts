'use server'

import db from '../lib/db'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { CreateBusinessDto, CreateOrganizationDto } from '@/lib/schema'
import { generateCode, slugify } from '@/lib/utils'
import { ArrayElement, PromiseGenerics } from '@/types'
import { getCurrentUser } from '@/lib/session'

export type OrganizationDataEntity = PromiseGenerics<typeof getOrganizationData>
export type OrganizationDataBusinessEntity = ArrayElement<OrganizationDataEntity['business']>

export async function createOrganization(data: CreateOrganizationDto & { userId: string }) {
  try {
    const hasOrg = await db.organization.findFirst({ where: { userId: data.userId } })
    const isDefault = !!hasOrg ? false : true
    const slug = slugify(data.name)
    const code = 'ORG-' + generateCode()

    const result = await db.organization.create({ data: { id: slug, code, name: data.name, userId: data.userId, isDefault } })

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

export async function updateOrganization(data: any, options?: { pathname?: string }) {
  try {
    const result = await db.organization.update({ data: { name: data.name }, where: { id: data.id } })

    if (options) {
      if (options.pathname) revalidatePath(options.pathname)
    }

    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error. `)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function getOrganizationData() {
  // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  const result = await db.organization.findMany({
    where: {
      userId: user.id
    },
    include: {
      business: {
        select: { id: true, code: true, name: true, location: { select: { id: true, code: true, name: true } } },
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  return result
}

export async function getOrganizationDataById(organizationId: string) {
  // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  let _orgId = organizationId

  // TODO: it should be global
  if (organizationId === 'dashboard') {
    const organizationData = await getOrganizationDataDefault()
    _orgId = organizationData.id
  }

  const result = await db.organization.findUnique({
    where: {
      id: _orgId
    },
    include: {
      business: {
        select: { id: true, code: true, name: true, location: { select: { id: true, code: true, name: true } } },
        orderBy: { name: 'asc' }
      }
    }
  })

  if (!result) notFound()

  return result
}

export async function getOrganizationDataDefault() {
  // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  // TODO: ADD isDefault IN DB
  const result = await db.organization.findFirst({
    where: {
      userId: user.id,
      isDefault: true
    },
    include: { business: { select: { id: true, code: true, name: true }, orderBy: { name: 'asc' } } }
  })

  if (!result) notFound()

  return result
}

export async function deleteOrganization(organizationId: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await db.organization.delete({ where: { id: organizationId } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error.`)
    }

    throw new Error('This error is in the Server Action')
  }
}
export async function createBusiness(data: CreateBusinessDto & { organizationId: string }) {
  try {
    const slug = slugify(data.name)
    const code = 'BUS-' + generateCode()

    const result = await db.business.create({ data: { id: slug, code, ...data } })

    revalidatePath(`/${data.organizationId}`)

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

export async function updateBusiness(data: any) {
  try {
    const result = await db.business.update({ data: { name: data.name }, where: { id: data.id } })
    revalidatePath(`/${data.organizationId}`)

    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error. `)
    }

    throw new Error('This error is in the Server Action')
  }
}

export async function getBusinessData(organizationId: string) {
  // let _orgId = organizationId

  // if (organizationId === 'dashboard') {
  //   const organizationData = await getOrganizationDataDefault()
  //   _orgId = organizationData.id
  // }

  // console.log(cookies().get('organizationId'))

  return await db.business.findMany({
    where: {
      organizationId: organizationId
    },
    orderBy: { name: 'asc' }
  })
}

export async function findBusinessById(businessId: string) {
  const result = await db.business.findUnique({
    where: {
      id: businessId
    }
  })

  if (result) {
    return result
  } else {
    notFound()
  }
}

type DeleteBusiness = {
  organizationId: string
  businessId: string
}

export async function deleteBusiness(params: DeleteBusiness) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await db.business.delete({ where: { id: params.businessId } })
    revalidatePath(`/${params.organizationId}`)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Prisma error.`)
    }

    throw new Error('This error is in the Server Action')
  }
}
