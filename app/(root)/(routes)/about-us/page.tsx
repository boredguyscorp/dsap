import { Icons } from '@/components/shared/icons'
import React from 'react'

export default function AboutPage() {
  return (
    // <div className='min-h-[calc((100vh-6rem)) mt-24'>

    // </div>

    <div className='min-h-[calc((100vh-6rem)) mx-auto mt-24 max-w-[90rem]'>
      <div className='sticky inset-x-0 top-0 z-20 border-y bg-white px-4 dark:border-gray-700 dark:bg-slate-900 sm:px-6 md:px-8 lg:hidden'>
        <div className='mx-auto max-w-3xl py-2'>
          <button
            type='button'
            className='flex w-full items-center justify-between gap-x-2 text-gray-500 hover:text-gray-600'
            data-hs-overlay='#docs-sidebar'
            aria-controls='docs-sidebar'
            aria-label='Toggle navigation'
          >
            <span className='text-sm'>Toggle Navigation</span>
            <svg className='h-5 w-5' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
              <path
                fill-rule='evenodd'
                d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id='docs-sidebar'
        className='hs-overlay hs-overlay-open:translate-x-0 scrollbar-y dark:scrollbar-y fixed bottom-0 left-0 top-0 z-[60] hidden max-h-[450px] w-80 -translate-x-full transform overflow-y-auto border-r border-gray-200 bg-white px-8 py-10 transition-all duration-300  lg:bottom-0 lg:left-[max(0px,calc(50%-45rem))] lg:right-auto lg:top-[100px] lg:z-10 lg:block lg:translate-x-0'
      >
        <button
          type='button'
          className='ml-auto flex justify-end text-gray-500 hover:text-gray-600 lg:hidden'
          data-hs-overlay='#docs-sidebar'
          aria-controls='docs-sidebar'
          aria-label='Toggle navigation'
        >
          <span className='sr-only'>Toggle Navigation</span>
          <svg className='h-5 w-5' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
          </svg>
        </button>

        <nav id='sidebar-nav' className='relative space-y-8'>
          <h5 className='mb-3 text-sm font-semibold text-slate-900 dark:text-slate-200'>Navbar Links</h5>
          <ul className='ml-0.5 space-y-2 border-l-2 border-slate-100 dark:border-slate-800' data-hs-scrollspy='#scrollspy'>
            <li>
              <a
                className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                href='#'
              >
                About us
              </a>
            </li>
            <li>
              <a
                className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                href='#mission'
              >
                Mission
              </a>
            </li>
            <li>
              <a
                className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                href='#vision'
              >
                Third
              </a>
            </li>
            <li>
              <a
                className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                href='#vision'
              >
                Vision
              </a>
            </li>
            <li>
              <a
                className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                href='#board-of-director'
              >
                Board of Director
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className='w-full px-4 sm:px-6 md:px-8 lg:pl-[22rem]'>
        <div className='mx-auto max-w-3xl py-10 xl:ml-0 xl:mr-64 xl:max-w-none xl:pr-16'>
          <div className='mt-1'>
            <div id='scrollspy' className='space-y-10 md:space-y-16'>
              <div id='' className='min-h-[25rem] scroll-mt-24'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>First section</h2>
              </div>

              <div id='mission' className='min-h-[25rem] scroll-mt-24'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>Second section</h2>
              </div>

              <div id='vision' className='min-h-[25rem] scroll-mt-24'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>Third section</h2>
              </div>

              <div id='vision' className='min-h-[25rem] scroll-mt-24'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>Fourth section</h2>
              </div>

              <div id='board-of-director' className='min-h-[25rem] scroll-mt-24'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>Fifth section</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
