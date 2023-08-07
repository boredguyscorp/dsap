import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
  return (
    <>
      <LoadingCard title='Subscription' />
      <LoadingCard title='Usage' />
    </>
  )
}

function LoadingCard(props: { title: string }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-24 animate-pulse rounded bg-muted' />
      </CardContent>
    </Card>
  )
}
