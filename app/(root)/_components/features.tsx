import Image from 'next/image'

import FeatImage01 from '@/public/images/features-03-image-01.png'
import FeatImage02 from '@/public/images/features-03-image-01.png'
import FeatImage03 from '@/public/images/features-03-image-01.png'
import { Balancer } from 'react-wrap-balancer'

export default function Features() {
  return (
    <section>
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        <div className='py-12 md:py-20'>
          {/* Section header */}
          {/* <div className='mx-auto max-w-3xl pb-12 text-center md:pb-16'>
            <div className='m-2 mb-4 inline-flex rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600'>
              Reach goals that matter
            </div>
            <h1 className='h2 mb-4'>One product, unlimited solutions</h1>
            <p className='text-xl text-gray-400'>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit laborum — semper quis lectus nulla.
            </p>
          </div> */}

          {/* Items */}
          <div className='grid gap-20'>
            {/* 1st item */}
            <div className='items-center md:grid md:grid-cols-12 md:gap-6'>
              {/* Video */}
              <div
                className='mx-auto mb-8 max-w-xl md:order-1 md:col-span-2 md:mb-0 md:w-full md:max-w-none lg:col-span-3 '
                data-aos='fade-up'
              >
                <div className='group relative mx-auto h-auto w-56 max-w-full md:max-w-none '>
                  <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 opacity-100 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200'></div>
                  <div className='items-top relative flex justify-start space-x-6 rounded-lg bg-black px-3 py-2 leading-none ring-1 ring-gray-900/5'>
                    <video autoPlay muted loop style={{ width: '100%' }}>
                      <source src='/_static/video/3d-design.mp4' type='video/webm' />
                    </video>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='mx-auto max-w-xl md:col-span-8 md:w-full md:max-w-none lg:col-span-7' data-aos='fade-right'>
                <div className='text-center md:pr-4 lg:pr-12 lg:text-end xl:pr-16'>
                  <h2 className='gradient-heading  text-2xl leading-none xs:text-3xl sm:text-4xl md:text-6xl'>
                    <div>
                      <span className='bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text font-black text-transparent'>
                        Design{' '}
                      </span>
                      <span className='font-bold'>and plan your needs.</span>
                    </div>
                  </h2>

                  <p className='mt-2 h-20 text-sm font-normal text-muted-foreground'>
                    <Balancer ratio={0.5}>
                      Fine-tune prompt and model parameters to match your needs and use case. Customize the UI to match your brand.
                    </Balancer>
                  </p>
                </div>
              </div>
            </div>

            {/* Middle */}
            <div className='items-center md:grid md:grid-cols-12 md:gap-6'>
              {/* Video */}
              <div
                className='mx-auto mb-8  max-w-xl md:col-span-6 md:mb-0 md:w-full md:max-w-none lg:col-span-5  xl:ml-8 2xl:col-span-5'
                data-aos='fade-up'
              >
                <div className='group relative mx-auto h-auto w-56 max-w-full md:max-w-none '>
                  <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 opacity-100 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200'></div>
                  <div className='items-top relative flex justify-start space-x-6 rounded-lg bg-black px-3 py-2 leading-none ring-1 ring-gray-900/5'>
                    <video autoPlay muted loop style={{ width: '100%' }}>
                      <source src='/_static/video/3d-develop.mp4' type='video/webm' />
                    </video>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className='mx-auto max-w-xl md:order-1 md:col-span-5 md:w-full md:max-w-none lg:col-span-5 lg:ml-6 xl:col-span-6 xl:ml-0'
                data-aos='fade-right'
              >
                <div className='text-center md:text-center lg:text-end xl:pr-16'>
                  <h2 className='gradient-heading  text-2xl leading-none xs:text-3xl sm:text-4xl md:text-6xl'>
                    <div>
                      <span className='bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text font-black text-transparent'>Develop </span>
                      <span className='font-bold'>and collaborate.</span>
                    </div>
                  </h2>

                  <p className='mt-2 h-20 text-sm font-normal text-muted-foreground'>
                    <Balancer ratio={0.5}>
                      Transforming ideas and design into software products and implement our time-tested approach to deploy your project.
                    </Balancer>
                  </p>
                </div>
              </div>
            </div>

            {/* 3rd item */}
            <div className='items-center md:grid md:grid-cols-12 md:gap-6'>
              {/* Video */}
              <div
                className='mx-auto mb-8 max-w-xl md:order-1 md:col-span-2 md:mb-0 md:w-full md:max-w-none lg:col-span-3'
                data-aos='fade-up'
              >
                <div className='group relative mx-auto h-auto w-56 max-w-full md:max-w-none '>
                  <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 opacity-100 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200'></div>
                  <div className='items-top relative flex justify-start space-x-6 rounded-lg bg-black px-3 py-2 leading-none ring-1 ring-gray-900/5'>
                    <video autoPlay muted loop style={{ width: '100%' }}>
                      <source src='/_static/video/3d-deliver.mp4' type='video/webm' />
                    </video>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='mx-auto max-w-xl md:col-span-8 md:w-full md:max-w-none lg:col-span-7' data-aos='fade-right'>
                <div className='text-center md:pr-4 lg:pr-12 lg:text-end xl:pr-16'>
                  <h2 className='gradient-heading  text-2xl leading-none xs:text-3xl sm:text-4xl md:text-6xl'>
                    <div>
                      <span className='bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text font-black text-transparent'>Deliver </span>
                      <span className='font-bold'>and launch at all touch points.</span>
                    </div>
                  </h2>

                  <p className='mt-2 h-20 text-sm font-normal text-muted-foreground'>
                    <Balancer ratio={0.5}>
                      Connect anytime, anywhere with Portal Web app. Compatible from any device & can switch to Mobile mode.
                    </Balancer>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
