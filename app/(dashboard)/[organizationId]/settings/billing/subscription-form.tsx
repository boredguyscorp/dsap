'use client'

import { Button } from '@/components/ui/button'

export function SubscriptionForm(props: { hasSubscription: boolean }) {
  // async function createSession() {
  //   const { url } = await api.stripe.createSession.mutate({ planId: '' })
  //   if (url) window.location.href = url
  // }

  return <Button /* onClick={createSession} */>{props.hasSubscription ? 'Manage Subscription' : 'Upgrade'}</Button>
}
