import { contactInquiryAction } from '@/app/(root)/(routes)/contact-us/_docs/action'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const data = body

    if (!data) {
      return new NextResponse('Contact data missing.', { status: 400 })
    }

    contactInquiryAction({
      firstName: 'zzz',
      lastName: 'zzzzzz',
      emailAdd: 'test@gmail.com',
      phoneNo: '123',
      message: 'haha'
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.log('🚀 -> POST -> error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
