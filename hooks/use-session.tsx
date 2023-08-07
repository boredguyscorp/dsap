import { useSession } from 'next-auth/react'

export function useUserSession() {
  const session = useSession()

  return session
}
