import { Icons } from '@/components/shared/icons'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export function LoadingCard(props: { title: string; description: string; className?: string }) {
  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center justify-center'>
        <Icons.spinner className='m-6 h-16 w-16 animate-spin' />
      </CardContent>
    </Card>
  )
}
