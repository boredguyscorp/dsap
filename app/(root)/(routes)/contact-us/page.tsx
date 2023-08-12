'use client'

import { Icons } from '@/components/shared/icons'
import React from 'react'

export default function ContactUs() {
  return (
    <div className='mt-24 min-h-[calc((100vh-6rem))] '>
      <div className='mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
        <div className='mx-auto max-w-2xl lg:max-w-5xl'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl'>Contact us</h1>
            <p className='mt-1 text-gray-600 dark:text-gray-400'>We'd love to talk about how we can help you.</p>
          </div>

          <div className='mt-12 grid items-center gap-6 lg:grid-cols-2 lg:gap-16'>
            <div className='flex flex-col rounded-xl border p-4 dark:border-gray-700 sm:p-6 lg:p-8'>
              <h2 className='mb-8 text-xl font-semibold text-gray-800 dark:text-gray-200'>Fill in the form</h2>

              <form>
                <div className='grid gap-4'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='hs-firstname-contacts-1' className='sr-only'>
                        First Name
                      </label>
                      <input
                        type='text'
                        name='hs-firstname-contacts-1'
                        id='hs-firstname-contacts-1'
                        className='block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400'
                        placeholder='First Name'
                      />
                    </div>

                    <div>
                      <label htmlFor='hs-lastname-contacts-1' className='sr-only'>
                        Last Name
                      </label>
                      <input
                        type='text'
                        name='hs-lastname-contacts-1'
                        id='hs-lastname-contacts-1'
                        className='block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400'
                        placeholder='Last Name'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='hs-email-contacts-1' className='sr-only'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='hs-email-contacts-1'
                      id='hs-email-contacts-1'
                      autoComplete='email'
                      className='block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400'
                      placeholder='Email'
                    />
                  </div>

                  <div>
                    <label htmlFor='hs-phone-number-1' className='sr-only'>
                      Phone Number
                    </label>
                    <input
                      type='text'
                      name='hs-phone-number-1'
                      id='hs-phone-number-1'
                      className='block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400'
                      placeholder='Phone Number'
                    />
                  </div>

                  <div>
                    <label htmlFor='hs-about-contacts-1' className='sr-only'>
                      Details
                    </label>
                    <textarea
                      id='hs-about-contacts-1'
                      name='hs-about-contacts-1'
                      rows={4}
                      className='block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400'
                      placeholder='Details'
                    ></textarea>
                  </div>
                </div>

                <div className='mt-4 grid'>
                  <button
                    type='submit'
                    className='inline-flex items-center justify-center gap-x-3 rounded-md border border-transparent bg-teal-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 lg:text-base'
                    onClick={(e) => e.preventDefault()}
                  >
                    Send inquiry
                  </button>
                </div>

                <div className='mt-3 text-center'>
                  <p className='text-sm text-gray-500'>We'll get back to you in 1-2 business days.</p>
                </div>
              </form>
            </div>

            <div className='divide-y divide-gray-200 dark:divide-gray-800'>
              <div className=' flex gap-x-7 py-6'>
                <Icons.phone className='mt-1.5 h-6 w-6 flex-shrink-0 text-gray-800 dark:text-gray-200' />
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-200'>Contact us</h3>
                  <p className='mt-1 text-sm text-gray-500'>If you wish to speak with us please use</p>
                  <p className='mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'>
                    +917 880 3727
                  </p>
                </div>
              </div>

              <div className=' flex gap-x-7 py-6'>
                <Icons.mail className='mt-1.5 h-6 w-6 flex-shrink-0 text-gray-800 dark:text-gray-200' />
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-200'>Email us</h3>
                  <p className='mt-1 text-sm text-gray-500'>If you wish to write us an email instead please use</p>
                  <p className='mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'>
                    dsap_office@yahoo.com
                  </p>
                </div>
              </div>

              <div className='flex gap-x-7 py-6'>
                <Icons.map className='mt-1.5 h-6 w-6 flex-shrink-0 text-gray-800 dark:text-gray-200' />
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-200'>Address</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Unit 2009 Medical Plaza Bldg., San Miguel Avenue, Brgy. San Antonio Pasig City., Philippines
                  </p>
                  <a
                    className='mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                    href='#'
                  >
                    Locate in map
                    <svg
                      className='h-2.5 w-2.5 transition ease-in-out group-hover:translate-x-1'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z'
                        fill='currentColor'
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
