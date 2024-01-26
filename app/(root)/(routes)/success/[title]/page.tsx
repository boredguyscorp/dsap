import { Icons } from '@/components/shared/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn, toProperCase } from '@/lib/utils'
import Link from 'next/link'

function SuccessPage({ params }: { params: { title: string } }) {
  const showBanner = process.env.SHOW_BANNER === 'true'

  const title = toProperCase(params.title.replaceAll('-', ' '))

  return (
    <div className={cn('mx-auto mt-20 min-h-[90vh] lg:pl-28', showBanner && 'mt-32')}>
      <div className='flex flex-col items-center gap-10 pt-20'>
        <div className='mt-10 flex h-40 w-40 items-center justify-center rounded-full border-[8px] border-green-500'>
          <Icons.check className='h-24 w-24 text-green-500' />
        </div>
        <div className='flex flex-col items-center gap-y-10 p-4'>
          <h1 className='text-2xl font-bold dark:text-white lg:text-4xl'>{title}</h1>

          <div className='flex flex-col gap-3 '>
            <div>
              <h2 className='text-center text-xl font-bold'>Questions or Concerns?</h2>
              <p className='text-center lg:max-w-4xl'>
                We're here to help! If you have any questions or need assistance, feel free to contact us at
                <span className='font-bold text-teal-600'> dsap_office@yahoo.com</span> or call us at{' '}
                <span className='font-bold text-teal-600'>+63 917 880 3727</span>.
              </p>
            </div>
            <h2 className='text-center'>Follow us on social media to stay updated on the latest news and events.</h2>
          </div>

          <Link
            href='/'
            className={cn(
              buttonVariants({
                variant: 'main',
                size: 'lg'
              }),
              'text-lg',
              'min-w-[200px]'
            )}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
