import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { SubscriptionForm } from './subscription-form'

export default function BillingPage() {
  return (
    <div className='flex flex-col gap-2'>
      <SubscriptionCard />
      <UsageCard />
    </div>
  )
}

async function SubscriptionCard() {
  const subscription = { plan: 'Pro', endsAt: new Date('2023-12-31') }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <p>
            You are currently on the <strong>{subscription.plan}</strong> plan. Your subscription will renew on{' '}
            <strong>{subscription.endsAt?.toLocaleDateString()}</strong>.
          </p>
        ) : (
          <p>You are not subscribed to any plan.</p>
        )}
      </CardContent>
      <CardFooter>
        <SubscriptionForm hasSubscription={!!subscription} />
      </CardFooter>
    </Card>
  )
}

function UsageCard() {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent>{/* TODO */}</CardContent>
    </Card>
  )
}
