'use server'

import { cookies } from 'next/headers'

export async function setCookie() {
  cookies().set('name', 'oscar')

  const name = cookies().get('name')?.value

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(cookies().getAll())
  return name
}
