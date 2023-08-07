import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  const headerServiceKey = req.headers.get('BG_API_SERVICE_KEY')
  const queryServiceKey = req.nextUrl.searchParams.get('serviceKey')

  const proceed = headerServiceKey === process.env.BG_API_SERVICE_KEY || queryServiceKey === process.env.BG_API_SERVICE_KEY

  if (!proceed) {
    return NextResponse.json('Unauthorized Access: BG_API_SERVICE_KEY is not valid.', { status: 401 })
  }

  try {
    // const user = (await clerkClient.users.getUserList()).map((user) => {
    //   return {
    //     userId: user.id,
    //     banned: user.banned,
    //     createdAt: new Date(user.createdAt),
    //     updatedAt: new Date(user.updatedAt),
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
    //   }
    // })

    const [user, account, organization, business, location] = await db.$transaction([
      db.user.findMany(),
      db.account.findMany(),
      db.organization.findMany(),
      db.business.findMany(),
      db.location.findMany()
    ])

    console.log('[SUCCESS: NEST_API_REQUEST_USER_ORG]')

    return NextResponse.json({ user, account, organization, business, location })
  } catch (error) {
    console.error('[ERROR: USER_ORG_GET_POST]', error)
    return NextResponse.json('Internal error', { status: 500 })
  }
}
