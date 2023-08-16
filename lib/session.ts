import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  // return getServerSession(authOptions) as Promise<{
  //   user: {
  //     id: string
  //     name: string
  //     username: string
  //     email: string
  //     image: string
  //   }
  // } | null>

  return session?.user
}
