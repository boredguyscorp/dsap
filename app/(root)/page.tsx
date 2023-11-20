import Link from 'next/link'

import url from '@/constants/url'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '../config'
import SolutionPlatformSection from './_components/solution-platform'
import { Suspense } from 'react'
import GlobeClient from './_components/globe-client'
import Globe from './_components/globe'
import { Balancer } from 'react-wrap-balancer'
import Features from './_components/features'
import Image from 'next/image'
import image1 from 'public/images/image1.jpg'
import image2 from 'public/images/image2.jpg'

export default async function Page() {
  // LANDING PAGE CONTENT
  // min-h-[calc((100%-5rem))]
  return (
    <>
      <section className='relative mt-24 flex min-h-[calc((100vh-6rem))] flex-col items-center justify-center text-center text-white '>
        <div className='video-docker absolute left-0 top-0 h-full w-full overflow-hidden'>
          <video autoPlay muted loop className='absolute z-10 min-h-full w-auto min-w-full max-w-none'>
            <source src='/_static/video/banner-video.mp4' type='video/webm' />
          </video>
        </div>

        <div className='video-content z-10 space-y-2'>
          <h1 className='m-5 rounded-sm bg-teal-500 bg-opacity-50 p-3 text-4xl font-bold md:p-5 md:text-5xl xl:text-7xl'>
            "One Cause, One Voice, One Future"
          </h1>
          <h3 className='text-[20px] font-light md:text-2xl xl:text-3xl'>{siteConfig.name}</h3>
        </div>

        <div className='z-10 mt-5 flex justify-center space-x-4 '>
          <Link href={url.app.signup} className={cn(buttonVariants({ variant: 'main', size: 'lg' }), 'min-h-[100px]')}>
            Become a Member
          </Link>
        </div>
      </section>

      <section id='message'>
        <div className='flex items-center justify-center'>
          <div className='relative z-20 mt-5 w-5/6 overflow-hidden rounded-lg bg-white shadow-xl before:absolute before:left-1/2 before:top-0 before:-z-[1] before:h-full before:w-full before:-translate-x-1/2 before:transform before:bg-cover before:bg-top  before:bg-no-repeat sm:-mt-16 md:w-5/6 xl:w-3/5 '>
            <div className='mx-auto max-w-[85rem] px-4 pb-10 pt-10 sm:px-6 lg:px-8'>
              <div className='mx-auto mt-5 max-w-2xl text-center'>
                <h1 className='block text-2xl font-bold text-gray-800 dark:text-gray-200 lg:text-3xl'>
                  <span>Message from the</span>{' '}
                  <span className='bg-gradient-to-br from-teal-400 to-teal-500 bg-clip-text text-transparent'>President </span>{' '}
                </h1>
              </div>

              <div className='mx-auto mt-5 max-w-3xl text-center'>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                  <Balancer>
                    In behalf of the DSAP Board of Directors, I am happy to welcome you back to our upgraded DSAP website. Our new website
                    is now user friendly making it easier to access the information you need on demand. I encourage you to experience the
                    changes we have incorporated in our new site and feel the warm embrace of being a member of our association.
                  </Balancer>
                </p>
              </div>

              <div className='relative flex h-full flex-col'>
                <div className='absolute left-0 top-0 ml-4 mt-3 md:ml-12 md:mt-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-h-14 h-14 fill-current text-indigo-200 md:h-24 md:w-24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z' />
                  </svg>
                </div>

                <div className='relative z-10 h-full'>
                  <p className='serif px-6 py-6 text-xl font-normal italic text-gray-600 md:px-16 md:py-10 md:text-2xl'>
                    "When the time is right, I the Lord will make it happen." --Isaiah 60:22
                  </p>
                </div>

                <div className='mx-auto mt-5 max-w-3xl space-y-12 text-center'>
                  <Balancer>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>
                      We have been blessed to go with the trend and to make the innovations happen. This is the TIME for DSAP.
                    </p>
                  </Balancer>

                  <p className='text-lg text-gray-600 dark:text-gray-400'>God Bless us all...</p>
                </div>

                <div className='mt-10 text-center'>
                  <img
                    src={`/images/officers/vicente.png`}
                    alt={`vicente.png`}
                    width={250}
                    height={250}
                    className='shadow- mx-auto mb-3 h-32  w-32  rounded-full'
                  />
                  <h2 className='text-sm font-bold leading-tight text-gray-700 md:text-xl'>Vicente U. Briones, RPh.</h2>
                  <small className='truncate text-xs text-gray-500 md:text-sm'>DSAP National President 2023</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='why-dsap' className='mt-20'>
        <div className='mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
          <div className='mx-auto mb-10 max-w-2xl text-center lg:mb-14'>
            <h2 className='text-2xl font-bold dark:text-white md:text-4xl md:leading-tight'>DSAP Works</h2>
            <p className='mt-1 text-gray-600 dark:text-gray-400'>Discover DSAP's work for every commun, everywhere.</p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='relative overflow-hidden rounded-xl pt-[50%] sm:pt-[70%]'>
                <Image
                  src={image1}
                  alt='Image Description'
                  className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                />
                <span className='absolute right-0 top-0 rounded-bl-xl rounded-tr-xl bg-teal-500 px-3 py-1.5 text-xs font-medium text-white dark:bg-gray-900'>
                  Latest
                </span>
              </div>

              <div className='mt-7'>
                <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-200'>
                  Sustainable Development Goals
                </h3>
                <p className='mt-3 text-gray-800 dark:text-gray-200'>
                  Produce professional, reliable streams easily leveraging Preline's innovative broadcast studio presentation
                </p>
                <p className='mt-5 inline-flex items-center gap-x-1.5 font-medium text-teal-500 decoration-2 group-hover:underline'>
                  Read more
                  <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </p>
              </div>
            </a>

            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='relative overflow-hidden rounded-xl pt-[50%] sm:pt-[70%]'>
                {/* <img className="w-full h-full absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-xl" src="https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description"> */}
                <Image
                  src={image2}
                  alt='Image Description'
                  className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                />
              </div>

              <div className='mt-7'>
                <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-200'>
                  DSAP Business Organization
                </h3>
                <p className='mt-3 text-gray-800 dark:text-gray-200'>
                  Optimize your in-person experience with best-in-className capabilities like badge printing and lead retrieval
                </p>
                <p className='mt-5 inline-flex items-center gap-x-1.5 font-medium text-teal-500 decoration-2 group-hover:underline'>
                  Read more
                  <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </p>
              </div>
            </a>

            <a
              className="group relative flex min-h-[15rem] w-full flex-col rounded-xl bg-[url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&q=80')] bg-cover bg-center transition hover:shadow-lg"
              href='#'
            >
              <div className='flex-auto p-4 md:p-6'>
                <h3 className='text-xl text-white/[.9] group-hover:text-white'>
                  <span className='font-bold'>DSAP</span> Press publishes books about economic and technological advancement.
                </h3>
              </div>
              <div className='p-4 pt-0 md:p-6'>
                <div className='inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-white/[.8]'>
                  Visit
                  <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id='cta-1' className='relative'>
        <div className='mx-auto my-10 mt-24 flex min-h-[400px] flex-col overflow-hidden shadow-sm md:min-h-[600px] md:flex-row'>
          <div className='item-center relative flex w-full flex-col justify-center bg-teal-600 py-2 md:w-2/5 md:px-10 md:py-24 lg:px-0 xl:w-1/3'>
            <div className='relative z-20 mb-0 space-y-2 px-6 py-2 text-indigo-100 md:mx-auto md:w-64 md:space-y-4 md:px-1 md:py-10 md:text-5xl xl:px-5'>
              <span className='text-2xl font-semibold md:block md:text-4xl'>Take action</span>
              <p className='md-block text-sm font-normal md:text-xl'>
                Children need champions. Get involved, speak out, volunteer, or become a donor and give every child a fair chance to
                succeed.
              </p>
            </div>
          </div>

          <div className='bg-gray-100 md:w-full'>
            <div className="w-ful relative flex h-full min-h-[500px] bg-[url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80')] bg-cover bg-center">
              {/* <div className='absolute left-0 top-0 ml-4 mt-3 md:ml-12 md:mt-5'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-12 w-12 fill-current text-indigo-200 md:h-16 md:w-16'
                  viewBox='0 0 24 24'
                >
                  <path d='M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z' />
                </svg>
              </div>

              <div className='relative z-10 h-full'>
                <p className='serif px-6 py-6 text-xl font-normal italic text-gray-600 md:px-16 md:py-10 md:text-2xl'>
                  Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate
                  strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view
                  of disruptive innovation via workplace diversity and empowerment.
                </p>
              </div> */}

              {/* <div className='flex justify-center px-6 pb-6 pt-2 md:py-6'>
                <div className='text-center'>
                  <h2 className='text-sm font-bold leading-tight text-gray-700 md:text-base'>Juan Dela Cruz</h2>
                  <small className='truncate text-xs text-gray-500 md:text-sm'>
                    President, Drugstores Association of the Philippines Inc.
                  </small>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className='mb-20'>
        <div className='mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
          <div className='mx-auto mb-10 max-w-2xl text-center lg:mb-14'>
            <h2 className='text-2xl font-bold dark:text-white md:text-4xl md:leading-tight'>Read our latest news</h2>
            <p className='mt-1 text-gray-600 dark:text-gray-400'>We've helped some great companies brand, design and get to market.</p>
          </div>
          <div className='grid gap-10 lg:grid-cols-2 lg:gap-y-16'>
            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='sm:flex'>
                <div className='relative h-44 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-56'>
                  {/* <img className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full absolute top-0 left-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description"> */}
                  <Image
                    src={image2}
                    alt='Image Description'
                    className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                  />
                </div>

                <div className='mt-4 grow px-4 sm:ml-6 sm:mt-0 sm:px-0'>
                  <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white'>
                    Studio by Preline
                  </h3>
                  <p className='mt-3 text-gray-600 dark:text-gray-400'>
                    Produce professional, reliable streams easily leveraging Preline's innovative broadcast studio
                  </p>
                  <p className='mt-4 inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline'>
                    Read more
                    <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </a>

            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='sm:flex'>
                <div className='relative h-44 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-56'>
                  <Image
                    src={image2}
                    alt='Image Description'
                    className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                  />
                </div>

                <div className='mt-4 grow px-4 sm:ml-6 sm:mt-0 sm:px-0'>
                  <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white'>
                    Onsite
                  </h3>
                  <p className='mt-3 text-gray-600 dark:text-gray-400'>
                    Optimize your in-person experience with best-in-className capabilities like badge printing and lead retrieval
                  </p>
                  <p className='mt-4 inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline'>
                    Read more
                    <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </a>

            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='sm:flex'>
                <div className='relative h-44 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-56'>
                  <Image
                    src={image2}
                    alt='Image Description'
                    className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                  />
                </div>

                <div className='mt-4 grow px-4 sm:ml-6 sm:mt-0 sm:px-0'>
                  <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white'>
                    The complete guide to OKRs
                  </h3>
                  <p className='mt-3 text-gray-600 dark:text-gray-400'>How to make objectives and key results work for your company</p>
                  <p className='mt-4 inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline'>
                    Read more
                    <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </a>

            <a className='group overflow-hidden rounded-xl' href='#'>
              <div className='sm:flex'>
                <div className='relative h-44 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-56'>
                  <Image
                    src={image2}
                    alt='Image Description'
                    className='absolute left-0 top-0 h-full w-full rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
                  />
                </div>

                <div className='mt-4 grow px-4 sm:ml-6 sm:mt-0 sm:px-0'>
                  <h3 className='text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white'>
                    People program models
                  </h3>
                  <p className='mt-3 text-gray-600 dark:text-gray-400'>Six approaches to bringing your People strategy to life</p>
                  <p className='mt-4 inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline'>
                    Read more
                    <svg className='h-2.5 w-2.5' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        d='M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
