import React from 'react'

import Image from 'next/image'
import image1 from 'public/images/image1.jpg'
import image2 from 'public/images/image2.jpg'
import person1 from 'public/images/person1.png'
import dsapOffice from 'public/images/dsap-office.png'
import { bod, officers } from './_content/constant'

export default function AboutPage() {
  return (
    <div className='mx-auto mt-20 min-h-screen lg:pl-28 '>
      <div className='grid w-full grid-cols-7'>
        <div id='mobile-navbar' className='fixed mb-10 mt-4 block w-full bg-slate-200 lg:hidden'>
          <nav id='sidebar-nav' className='relative w-full space-y-8'>
            <ul
              className='z-50 ml-0.5 flex items-center justify-center gap-9 border-l-2 border-slate-100 p-5 text-center text-xs dark:border-slate-800 md:text-sm'
              data-hs-scrollspy='#scrollspy'
            >
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active -ml-px block border-b-2 border-transparent   text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#'
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-b-2 border-transparent   text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#mission'
                >
                  Mission
                </a>
              </li>
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-b-2 border-transparent   text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#vision'
                >
                  Vision
                </a>
              </li>
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-b-2 border-transparent py-1  text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#national-officer'
                >
                  National Officer
                </a>
              </li>
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-b-2 border-transparent py-1  text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#board-of-director'
                >
                  Board of Director
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <aside
          id='docs-sidebar'
          className='hs-overlay hs-overlay-open:translate-x-0 scrollbar-y dark:scrollbar-y fixed bottom-0 left-0 top-0 z-[60] hidden  w-60 -translate-x-full transform overflow-y-auto border-r border-gray-200 bg-white px-8 py-10 transition-all duration-300  lg:bottom-0 lg:left-[max(0px,calc(13%-10rem))] lg:right-auto lg:top-[90px] lg:z-10 lg:block lg:translate-x-0'
        >
          <nav id='sidebar-nav' className='relative space-y-8'>
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
                  Vision
                </a>
              </li>
              <li>
                <a
                  className='hs-scrollspy-active:font-medium hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 -ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  href='#national-officer'
                >
                  National Officer
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
        </aside>

        <main className='col-span-10'>
          <div className='w-full px-4 pl-[2rem] sm:px-6 md:px-8 lg:pl-[11rem] xl:pl-[13rem] 2xl:pl-[16rem]'>
            <div className='mx-auto max-w-3xl py-10 xl:ml-0 xl:max-w-none xl:pr-16'>
              <div className='mt-1'>
                <div id='scrollspy' className='space-y-10 md:space-y-16'>
                  <div id='#' className='mt-14 min-h-[25rem] scroll-mt-24 pb-6 lg:mt-0'>
                    <div className='mx-auto max-w-full px-4  pt-6 sm:px-6 lg:-mt-5 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl '>About us</h2>

                            <p className='text-lg text-gray-800 dark:text-gray-200'>
                              Realizing the importance of a strong, unified association of drugstore owners to serve the needs of its
                              members, the customers, the manufacturers or suppliers, as well as the government, a core group of fifteen
                              wholesales, chain store operators and retailers met with hopes of working together. They were Carlos Super
                              Drug, Dyna Drug, Emilene's Pharmacy, Farmacia Arsenia, Globe Pharmacy, Goodwill Pharmacy, Madis Drug,
                              Marcelo's Pharmacy, Merced Drug, New South Star Drug, 777 Drug, Olympic Drug, Rose Pharmacy, Save More Drug
                              and Surety Drug. After a series of conferences, the original fifteen participants formally organized what now
                              is known as the Drugstores Association of the Philippines (DSAP), having elected their initial set of officers
                              on April 14, 1984 at the Quezon City Sports Club.
                            </p>
                          </div>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            The installation of the initial set of officers of DSAP was held at the Hyatt Regency Manila on November 29,
                            1984 with Ms. Catalina Sanchez, Director of the Bureau of Food and Drug (BFAD) as installing officer. The newly
                            installed officers were Mr. Dioscoro Rodolfo of Merced Drug as President, Mr. Steve Dy of Dyna Drug as Vice
                            President, Ms. Celia Carlos of Carlos Super Drug as Secretary, Mrs. Carmen Tan of Save More Drug as Assistant
                            Secretary, Mrs. Celita Cabigao of 777 Drug as Treasurer, Mrs. Consuelo Dy of New South Star Drug as Assistant
                            Treasurer, the late Mr. Artemio Vizconde of Marcelo's Pharmacy as Auditor, Mr. Rodolfo Manalac of Olympic Drug
                            as Assistant Auditor and Mr. Amador of Madis Drug as Public Relations Officer.
                          </p>

                          <figure>
                            <Image src={dsapOffice} alt='Image Description' className='w-full rounded-xl object-cover' />

                            <figcaption className='mt-3 text-center text-sm text-gray-500'>
                              DSAP Office Unit 2009 Medical Plaza Bldg., San Miguel Avenue, Brgy. San Antonio Pasig City., Philippines.
                            </figcaption>
                          </figure>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            DSAP has participated in deliberations with the Department of Health, BFAD now FDA, House of Representatives,
                            Senate of the Philippines and other government agencies, as well as private offices and organizations. The
                            association also spearheaded several civic and humanitarian projects and training programs that seek to teach
                            drugstore owners on the more modern operational methods of pharmacy community service. The association was then
                            able to get support from the pharmaceutical companies.
                          </p>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            The social affairs committee always had the spirit of camaraderie and friendship that the officers and members
                            of DSAP continue its untiring task of uniting the thousands of drugstores all over the country. The association
                            has gone a long way since 1984 as it evolved from one leadership to another. It has passed through 12 presidents
                            namely; Mr. Dioscoro Rodolfo (1984-1992), Ms. Celia Carlos (1992-1996, 2004), Mr. James Sandoval (1996-1999),
                            Mr. Angel Margarito Caramat, Jr. (1999- 2001), Ms. Gloria De Chavez (2001-2003, 2005) Ms. Erlinda Pascual*
                            (2006- 2007), Ms. Josephine Inocencio (2008-2009), Ms. Florecita Intal (2010), Dr. Alan Kintanar (2011), and Ms.
                            Julie F. Marquez (2012,) Ms. Herlinda Aquino (2013) and Ms. Estela A. Lim (2014).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id='mission' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto max-w-full px-4 pb-6 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-5'>
                          <div className='space-y-3'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl'>Mission</h2>

                            {/* <p className='text-lg text-gray-800 dark:text-gray-200'>
                              Mission, text
                            </p> */}
                          </div>

                          <div className='mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
                            <div className='md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16'>
                              <div className='mb-24 hidden sm:px-6 md:mb-0 md:block'>
                                <div className='relative'>
                                  <Image src={image2} alt='Image Description' className='rounded-xl' />

                                  <div className='absolute bottom-0 left-0 -z-[1] -translate-x-14 translate-y-10'>
                                    <svg
                                      className='h-auto max-w-[10rem] text-slate-400 dark:text-slate-700'
                                      width='696'
                                      height='653'
                                      viewBox='0 0 696 653'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <circle cx='72.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='623.5' r='29.5' fill='currentColor' />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <blockquote className='relative'>
                                  <svg
                                    className='absolute left-0 top-0 h-24 w-24 -translate-x-8 -translate-y-4 transform text-gray-200 dark:text-gray-700'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    aria-hidden='true'
                                  >
                                    <path
                                      d='M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z'
                                      fill='currentColor'
                                    />
                                  </svg>

                                  <div className='relative z-10'>
                                    <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-200'>
                                      Our Mission
                                    </p>

                                    <p className='text-xl font-medium italic text-gray-800 dark:text-gray-200 md:text-2xl md:leading-normal xl:text-3xl xl:leading-normal'>
                                      To ensure a climate of continuous growth and development as an association through its strong
                                      organizational structure supported by its servant leaders, committed membership nationwide and its
                                      more than 25 years of dedicated partnership with stakeholders of the healthcare industry.
                                    </p>
                                  </div>

                                  <footer className='mt-6'>
                                    <div className='flex items-center'>
                                      <div className='flex-shrink-0 md:hidden'>
                                        <img
                                          className='h-12 w-12 rounded-full'
                                          src='https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                                          alt='Image Description'
                                        />
                                      </div>
                                      <div className='ml-4 md:ml-0'>
                                        <div className='text-base font-semibold text-gray-800 dark:text-gray-200'>DSAP Mission</div>
                                        <div className='text-xs text-gray-500 dark:text-gray-400'>One Mission, One Goal. ❤️ </div>
                                      </div>
                                    </div>
                                  </footer>
                                </blockquote>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id='vision' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto max-w-full px-4 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-5'>
                          <div className='space-y-3'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl'>Vision</h2>

                            {/* <p className='text-lg text-gray-800 dark:text-gray-200'>
                              Vision, text
                            </p> */}
                          </div>

                          <div className='mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
                            <div className='md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16'>
                              <div className='mb-24 hidden sm:px-6 md:mb-0 md:block'>
                                <div className='relative'>
                                  <Image src={image2} alt='Image Description' className='rounded-xl' />

                                  <div className='absolute bottom-0 left-0 -z-[1] -translate-x-14 translate-y-10'>
                                    <svg
                                      className='h-auto max-w-[10rem] text-slate-400 dark:text-slate-700'
                                      width='696'
                                      height='653'
                                      viewBox='0 0 696 653'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <circle cx='72.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='29.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='128.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='227.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='326.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='425.5' r='29.5' fill='currentColor' />
                                      <circle cx='29.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='128.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='227.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='326.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='425.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='524.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='623.5' cy='524.5' r='29.5' fill='currentColor' />
                                      <circle cx='72.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='171.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='270.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='369.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='468.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='567.5' cy='623.5' r='29.5' fill='currentColor' />
                                      <circle cx='666.5' cy='623.5' r='29.5' fill='currentColor' />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <blockquote className='relative'>
                                  <svg
                                    className='absolute left-0 top-0 h-24 w-24 -translate-x-8 -translate-y-4 transform text-gray-200 dark:text-gray-700'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    aria-hidden='true'
                                  >
                                    <path
                                      d='M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z'
                                      fill='currentColor'
                                    />
                                  </svg>

                                  <div className='relative z-10'>
                                    <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-200'>
                                      Our Vision
                                    </p>

                                    <p className='text-xl font-medium italic text-gray-800 dark:text-gray-200 md:text-2xl md:leading-normal xl:text-3xl xl:leading-normal'>
                                      To be the prime mover in healthcare distribution; responsive to the needs of its members, adapting to
                                      the changing business climate to pave the way for continued growth and prosperity while maintaining
                                      excellence in customer servicing.
                                    </p>
                                  </div>

                                  <footer className='mt-6'>
                                    <div className='flex items-center'>
                                      <div className='flex-shrink-0 md:hidden'>
                                        <img
                                          className='h-12 w-12 rounded-full'
                                          src='https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                                          alt='Image Description'
                                        />
                                      </div>
                                      <div className='ml-4 md:ml-0'>
                                        <div className='text-base font-semibold text-gray-800 dark:text-gray-200'>DSAP Vision</div>
                                        <div className='text-xs text-gray-500 dark:text-gray-400'>One Vision, One Goal. ❤️ </div>
                                      </div>
                                    </div>
                                  </footer>
                                </blockquote>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id='national-officer' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto mb-20 max-w-full px-4 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3 text-center'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl '>DSAP National Officers 2023</h2>
                          </div>
                          <div className='grid grid-cols-3 gap-8 pt-5 md:grid-cols-4 md:gap-12 2xl:px-16 2xl:pt-8'>
                            {officers.map((row) => {
                              return (
                                <div key={row.position} className='text-center'>
                                  <Image
                                    src={`/images/officers/${row.img}.png`}
                                    alt={`${row.img}.png`}
                                    width={250}
                                    height={250}
                                    className='mx-auto h-32 w-32 rounded-full'
                                  />

                                  <div className='mt-2 sm:mt-4'>
                                    <h3 className='font-bold text-teal-600 dark:text-teal-500'>{row.name}</h3>
                                    <p className='text-sm font-bold text-gray-800 dark:text-gray-400'>{row.position}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{row.drugstore}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{row.chapter}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id='board-of-director' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto mb-20 max-w-full px-4 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3 text-center'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl '>Board of Directors</h2>
                          </div>
                          <div className='grid grid-cols-3 gap-8 pt-5 md:grid-cols-4 md:gap-12 2xl:px-16 2xl:pt-8'>
                            {bod.map((row) => {
                              return (
                                <div key={row.position} className='text-center'>
                                  <Image
                                    src={`/images/officers/${row.img}.png`}
                                    alt={`${row.img}.png`}
                                    width={250}
                                    height={250}
                                    className='mx-auto h-32 w-32 rounded-full'
                                  />

                                  <div className='mt-2 sm:mt-4'>
                                    <h3 className='font-bold text-teal-600 dark:text-teal-500'>{row.name}</h3>
                                    <p className='text-sm font-bold text-gray-800 dark:text-gray-400'>{row.position}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{row.drugstore}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{row.chapter}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
