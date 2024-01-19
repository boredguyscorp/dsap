'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import dsapOffice from 'public/images/dsap-office.png'
import Image from 'next/image'

type MembershipLandingProps = {
  setShowForm: (show: boolean) => void
  setShowMemberAuthForm: (show: boolean) => void
}
export function MembershipLanding({ setShowForm, setShowMemberAuthForm }: MembershipLandingProps) {
  const showBanner = process.env.NEXT_PUBLIC_SHOW_BANNER === 'true'

  return (
    <div className={cn('mx-auto mb-20 ml-0 mt-28 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16', showBanner && 'mt-36')}>
      <div className='flex items-center justify-between gap-x-1.5 space-x-10 p-10 text-sm text-gray-600 decoration-2'>
        <div className='flex flex-col justify-center space-y-14'>
          <h2 className='text-3xl font-bold text-teal-600 dark:text-white md:text-4xl lg:text-5xl'>Benefits of becoming a member</h2>
          {/* <h5 className='text-xl font-semibold   text-teal-500 dark:text-gray-200 dark:group-hover:text-gray-400'>
              Benefits of becoming a member
            </h5> */}
          <ul className='max space-y-3 px-5 text-base font-semibold md:text-xl'>
            <li className='list-disc'>Get free educational programs for drugstore owners and pharmacy assistants</li>
            <li className='list-disc'>Get free reference book like MIMS and Better Pharmacy during DSAP Convention</li>
            <li className='list-disc'>The Drugstores get regular updates from FDA, DOH and other government agencies</li>
            <li className='list-disc'>Get specials rates from insurance companies accredited by DSAP for fore and theft</li>
            <li className='list-disc'>
              Get the privilege of using DSAP Logo in the signboard which projects the image of quality and compliance drugstore.
            </li>
            <li className='list-disc'>Participate in the DSAP convention with special rate</li>
            <li className='list-disc'>Learn about good business practice</li>
          </ul>
          {/* <p className='text-sm font-normal text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
              Complete form below to sign up for membership.
            </p> */}

          <Button variant='main' className='h-16' onClick={() => setShowForm(true)}>
            Proceed to Membership
          </Button>

          <Button
            variant='main_outline'
            className='h-16 text-center text-xl font-medium'
            onClick={() => {
              setShowMemberAuthForm(true)
            }}
          >
            Update Membership
          </Button>
        </div>
        <div className='hidden xl:block'>
          <Image src={dsapOffice} alt='Image Description' className='w-full rounded-xl object-cover' />
        </div>
      </div>
    </div>
  )
}
