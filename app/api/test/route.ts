import { NextResponse } from 'next/server'

import db from '@/lib/db'

export async function GET() {
  try {
    const orgData = await db.organization.findMany()

    return NextResponse.json(orgData)
  } catch (error) {
    console.log('[STORES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const pathname = new URL(request.url).pathname
    console.log('🚀 -> POST -> pathname:', pathname)
    return NextResponse.json(pathname)
    // return new Response(`You requested from ${pathname}`, { status: 200 })
  } catch (error) {
    console.log('[XXXXX]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
