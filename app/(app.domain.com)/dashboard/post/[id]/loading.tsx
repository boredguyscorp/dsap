// a bunch of loading divs
import { Skeleton } from '@/components/ui/skeleton'
export default function Loading() {
  return (
    <div className='mx-auto grid w-full max-w-screen-lg gap-6'>
      <Skeleton className='min-h-screen w-full max-w-screen-lg' />
    </div>
  )
}
