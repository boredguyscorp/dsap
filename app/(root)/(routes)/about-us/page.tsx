import React from 'react'

import Image from 'next/image'
import image1 from 'public/images/image1.jpg'
import image2 from 'public/images/image2.jpg'
import person1 from 'public/images/person1.png'

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
                              About us, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
                              PageMaker including versions of Lorem Ipsum
                            </p>
                          </div>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            We're proud to be a part of creating a more open culture and to continue building a product that supports this
                            vision.
                          </p>

                          <figure>
                            <Image src={image1} alt='Image Description' className='w-full rounded-xl object-cover' />

                            <figcaption className='mt-3 text-center text-sm text-gray-500'>DSAP Meeting and Discussion.</figcaption>
                          </figure>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable
                            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of
                            Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during
                            the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
                            1.10.32.
                          </p>

                          <p className='text-lg text-gray-800 dark:text-gray-200'>
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
                            some form, by injected humour, or randomised words which don't look even slightly believable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id='mission' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto max-w-full px-4 pb-6 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl'>Mission</h2>

                            <p className='text-lg text-gray-800 dark:text-gray-200'>
                              Mission, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
                              PageMaker including versions of Lorem Ipsum
                            </p>
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
                                      If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
                                      embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to
                                      repeat predefined chunks as necessary, making this the first true generator on the Internet.
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
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl'>Vision</h2>

                            <p className='text-lg text-gray-800 dark:text-gray-200'>
                              Vision, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
                              PageMaker including versions of Lorem Ipsum
                            </p>
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
                                      If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
                                      embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to
                                      repeat predefined chunks as necessary, making this the first true generator on the Internet.
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

                  <div id='national-officer' className='min-h-[25rem] scroll-mt-24 '>
                    <div className='mx-auto mb-20 max-w-full px-4 sm:px-6 lg:-mt-2 lg:px-8'>
                      <div className='max-w-full'>
                        <div className='space-y-5 md:space-y-8'>
                          <div className='space-y-3 text-center'>
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl '>National Officer</h2>

                            <p className='text-lg text-gray-800 dark:text-gray-200'>
                              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
                              1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original
                              form, accompanied by English versions from the 1914 translation by H. Rackham.
                            </p>
                          </div>
                          <div className='grid grid-cols-3 gap-8 pt-5 md:grid-cols-4 md:gap-12 xl:grid-cols-5 2xl:px-28 2xl:pt-8'>
                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>
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
                            <h2 className='text-2xl font-bold dark:text-white md:text-3xl '>Board of Director</h2>

                            <p className='text-lg text-gray-800 dark:text-gray-200'>
                              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
                              1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original
                              form, accompanied by English versions from the 1914 translation by H. Rackham.
                            </p>
                          </div>
                          <div className='grid grid-cols-3 gap-8 pt-5 md:grid-cols-4 md:gap-12 xl:grid-cols-5 2xl:px-28 2xl:pt-8'>
                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>Juan Dela Cruz</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>

                            <div className='text-center'>
                              <Image src={person1} alt='Image Description' className='mx-auto h-24 w-24 rounded-full' />

                              <div className='mt-2 sm:mt-4'>
                                <h3 className='font-medium text-gray-800 dark:text-gray-200'>David Forren</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Founder / CEO</p>
                              </div>
                            </div>
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
