'use client'

import { Icons } from '@/components/shared/icons'
import cn from 'classnames'
import createGlobe from 'cobe'
import { motion } from 'framer-motion'
import {
  Code,
  Globe,
  MessageCircle,
  MessagesSquare,
  Search,
  Settings2,
  Upload,
  Atom,
  PieChart,
  BarChart,
  Box,
  Database,
  CloudHail,
  Fingerprint,
  MailCheck,
  MonitorSmartphone
} from 'lucide-react'
import { X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { JSXElementConstructor, ReactNode, useEffect, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import colors from 'tailwindcss/colors'

const AnimatedGlobe = ({ className }: { className: string }) => {
  const canvasRef = useRef<any>()

  useEffect(() => {
    let phi = 0

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 420 * 2,
      height: 420 * 2,
      phi: 0,
      theta: 0.5,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [255, 255, 255],
      glowColor: [1, 251 / 255, 241 / 255],
      offset: [-40, 0],
      scale: 1,
      markers: [],
      onRender: (state) => {
        // state.phi = phi
        // phi += 0.003

        state.phi = phi
        phi += 0.003

        // state.dark = canvasRef.current.dark

        // state.theta = canvasRef.current.theta
        // state.mapSamples = canvasRef.current.mapSamples
        // state.mapBrightness = canvasRef.current.mapBrightness
        // state.mapBaseBrightness = canvasRef.current.mapBaseBrightness
        // state.diffuse = canvasRef.current.diffuse
        // state.baseColor = [canvasRef.current.baseColor.r / 255, canvasRef.current.baseColor.g / 255, canvasRef.current.baseColor.b / 255]
        state.markerColor = ['#ffffff']
        state.markers = [
          { location: [37.7595, -122.4367] },
          { location: [40.7128, -74.006] },
          { location: [52.520008, 13.404954] },
          { location: [51.507351, -0.127758] },
          { location: [35.689487, 139.691711] },
          { location: [22.396427, 114.109497] },
          { location: [30.047503, 31.233702] },
          { location: [-33.86882, 151.20929] },
          { location: [-9.746956, -44.261249] }
        ].map((marker) => ({ ...marker, size: 0.08 }))
        // state.scale = canvasRef.current.scale
        // state.offset = [
        //   canvasRef.current.offsetX * size * 4,
        //   canvasRef.current.offsetY * size * 4,
        // ]
        // state.opacity = canvasRef.current.opacity
      }
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return <canvas className={className} ref={canvasRef} style={{ aspectRatio: 2 }} />
}

const SourceIcon = ({ Icon, id }: { Icon?: JSXElementConstructor<any>; id?: string }) => {
  return (
    <div className='bg-neutral-1000 z-20 rounded-full border border-dashed border-neutral-600 p-3 '>
      {Icon && <Icon className='h-5 w-5' />}
      {id && <Image alt={id} width={20} height={20} className='h-5 w-5' src={`/static/icons/${id}.svg`} />}
    </div>
  )
}

type StepProps = {
  title: string | ReactNode
  description: string
  Icon: JSXElementConstructor<any>
  position: 'left' | 'middle' | 'right'
  children?: ReactNode
}

const Step = ({ title, description, Icon, position, children }: StepProps) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex h-[400px] w-full flex-grow items-center justify-center'>{children}</div>
      <div className='relative flex w-full flex-none flex-col'>
        <div className='absolute inset-0 flex w-full items-center justify-center'>
          <div
            className={cn('gridline gridline-horizontal h-1 w-full', {
              'gridline-fade-left': position === 'left',
              'gridline-fade-right': position === 'right'
            })}
          />
        </div>
        <div className='relative flex w-full items-center justify-center'>
          <div className='relative z-20'>
            <div className='h-10 w-10 flex-none rounded-full bg-secondary p-3 '>
              <Icon className='h-full w-full' />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='relative mt-4 flex w-full flex-none flex-col items-center font-medium '>
          {title}
          <p className='mx-auto mt-2 h-20 max-w-xs text-center text-sm font-normal text-muted-foreground'>
            <Balancer ratio={0.5}>{description}</Balancer>
          </p>
        </div>
      </div>
    </div>
  )
}

export const Lines = ({
  width,
  height,
  radius,
  strokeWidth,
  highlightStrokeWidth,
  strokeDasharray
}: {
  width: number
  height: number
  radius: number
  strokeWidth: number
  highlightStrokeWidth: number
  strokeDasharray: number
}) => {
  const topLinesHeight = Math.round(height / 3)
  const bottomLineHeight = height - topLinesHeight
  const thirdWidth = Math.round(width / 3)
  const halfWidth = Math.round(width / 2)
  const sixthWidth = Math.round(width / 6)

  const path = `M1 0v${topLinesHeight - radius}a${radius} ${radius} 0 00${radius} ${radius}h${halfWidth - radius}M${width - 1} 0v${
    topLinesHeight - radius
  }a${radius} ${radius} 0 01-${radius} ${radius}H${
    halfWidth + 1
  }v${bottomLineHeight}m-${sixthWidth} -${height}v${topLinesHeight}m${thirdWidth} -${topLinesHeight}v${topLinesHeight}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} fill='none'>
      <path d={path} stroke='#c9c8c8d3' strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} />
      <path d={path} stroke='url(#pulse)' strokeLinecap='round' strokeWidth={highlightStrokeWidth} strokeDasharray={strokeDasharray} />
      <defs>
        <motion.linearGradient
          animate={{
            x1: [0, 0],
            y1: [-2.5 * height, 2 * height],
            x2: [0, 0],
            y2: [-2 * height, 2.5 * height]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          id='pulse'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={colors.sky['400']} stopOpacity='0' />
          <stop stopColor={colors.sky['400']} stopOpacity='1' />
          <stop offset='1' stopColor={colors.sky['400']} stopOpacity='0' />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

export const LaunchLine = ({
  height,
  strokeWidth,
  highlightStrokeWidth,
  strokeDasharray
}: {
  height: number
  strokeWidth: number
  highlightStrokeWidth: number
  strokeDasharray: string
}) => {
  const path = `M1 0v${height}`

  return (
    <svg viewBox={`0 0 2 ${height / 2}`} fill='none'>
      <path d={path} stroke='#a6a6a64d' strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} strokeLinecap='round' />
      <path d={path} stroke='url(#pulse1)' strokeDasharray={strokeDasharray} strokeWidth={highlightStrokeWidth} strokeLinecap='round' />
      <defs>
        <motion.linearGradient
          animate={{
            x1: [0, 0],
            y1: [1.2 * height, -1 * height],
            x2: [0, 0],
            y2: [1 * height, -1.2 * height]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          id='pulse1'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={colors.sky['300']} stopOpacity='0' />
          <stop stopColor={colors.sky['300']} stopOpacity='1' />
          <stop offset='1' stopColor={colors.sky['300']} stopOpacity='0' />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

const SolutionPlatformSection = () => {
  const sourcesContainerRef = useRef<HTMLDivElement>(null)
  const [sourcesContainerDimensions, setSourcesContainerDimensions] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!sourcesContainerRef.current) {
        return
      }

      const sourcesContainerRect = sourcesContainerRef.current?.getBoundingClientRect()

      const width = sourcesContainerRect?.width || 0
      const height = sourcesContainerRect?.height || 0

      setSourcesContainerDimensions({
        width,
        height
      })
    })

    sourcesContainerRef.current && observer.observe(sourcesContainerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className='relative z-0 mx-auto max-w-screen-xl px-6 sm:px-8'>
      <h2 className='gradient-heading mt-10 flex flex-col items-center text-center text-2xl leading-none xs:text-3xl sm:text-4xl md:mt-20 md:text-6xl'>
        {/* <Balancer>Solutions and Platform</Balancer> */}
        <div>
          {/* <span className='animate-gradient bg-gradient-to-r from-purple-400 to-yellow-500 bg-300% bg-clip-text font-black text-transparent'> */}
          <span className='bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text  font-black text-transparent'>Explore </span>
          <span className='font-bold'>the Portal way.</span>
        </div>

        <p className='mt-2 max-w-[42rem] text-xl leading-normal sm:text-2xl md:text-3xl'>Solutions and Platform</p>
      </h2>

      <div className='grid grid-cols-1 items-center justify-center gap-12 sm:mt-16 sm:gap-0 md:grid-cols-3'>
        <Step
          title='Design and Plan your needs'
          description='Fine-tune prompt and model parameters to match your needs and use case. Customize the UI to match your brand.'
          Icon={Settings2}
          position='middle'
        >
          <div className='relative h-full w-full'>
            <div className='skewed-sheet group absolute inset-x-12 inset-y-0 mt-12 flex transform flex-col items-end justify-start gap-4 transition duration-300'>
              <div className='animate-bounce-subtle bg-neutral-1000/20 relative h-[70%] w-full rounded-sm border border-dashed border-neutral-700'>
                <div className='absolute inset-0 z-30 flex transform flex-col rounded-md border-neutral-900 bg-white opacity-100 transition duration-300 group-hover:opacity-0'>
                  <div className='relative h-[38px] flex-none items-center gap-2 border-b border-neutral-200 px-12 py-2 text-sm text-neutral-400'>
                    <Search className='absolute left-3 top-3 h-[14px] w-[14px] text-neutral-400' />
                    <p className='absolute inset-x-10 top-2.5 text-xs'>How can we help?</p>
                    <X className='absolute right-3 top-3 h-[14px] w-[14px] text-neutral-400' />
                  </div>
                  <div className='flex flex-grow flex-col items-start gap-1 px-3 py-3'>
                    <div className='rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-600'>How do we get started?</div>
                    <div className='rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-600'>What kind of support do you offer?</div>
                    <div className='rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-600'>
                      Is the system customizable enough to meet my needs?
                    </div>
                  </div>
                  <div className='relative h-[1px] flex-none overflow-hidden'>
                    <div
                      className={`animate-progress absolute left-0 top-0 h-[1px]`}
                      style={{
                        backgroundImage: `linear-gradient(to right,${colors.rose['600']},${colors.purple['600']})`
                      }}
                    />
                  </div>
                  <div className='flex flex-none flex-row items-center gap-2 border-t border-neutral-200 px-2 py-2'>
                    <div className='rounded border border-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600'>Pricing</div>
                    <div className='rounded border border-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600'>Security</div>
                  </div>
                </div>
                <Search className='absolute left-6 top-4 h-4 w-4 text-neutral-700' />
                <X className='absolute right-6 top-4 h-4 w-4 text-neutral-700' />
                <p className='absolute left-12 top-[14px] text-sm text-neutral-700'>Ask me anything...</p>
                <div className='absolute inset-x-4 inset-y-0 z-10 border-l border-r border-dashed border-neutral-700' />
                <div className='absolute inset-x-0 top-0 h-12 border-b border-dashed border-neutral-700' />
                <div className='absolute inset-x-0 bottom-0 z-0 flex h-10 flex-row items-center gap-2 overflow-hidden border-t border-dashed border-neutral-700 px-6 text-xs text-neutral-700'>
                  <div className='whitespace-nowrap rounded-md border border-dashed border-neutral-700 px-2 py-1'>Reference 1</div>
                  <div className='whitespace-nowrap rounded-md border border-dashed border-neutral-700 px-2 py-1'>Reference 2</div>
                </div>
                <div className='absolute inset-x-8 inset-y-16 flex animate-pulse flex-col gap-4'>
                  <div className='h-2 w-4/5 rounded bg-neutral-800' />
                  <div className='h-2 w-2/3 rounded bg-neutral-800' />
                  <div className='h-2 w-1/3 rounded bg-neutral-800' />
                  <div className='h-2 w-1/2 rounded bg-neutral-800' />
                </div>
              </div>
              <div className='relative flex-none'>
                <div className='absolute z-10 rounded-full border border-indigo-400 bg-indigo-500 p-3 opacity-100 transition duration-300 group-hover:opacity-0'>
                  <MessagesSquare className='h-5 w-5 text-white' />
                </div>
                <div className='flex-none rounded-full border border-dashed border-neutral-700 p-3'>
                  <MessageCircle className='h-5 w-5 text-neutral-700' />
                </div>
              </div>
              <div className='absolute bottom-0 left-[calc(50%-2px)] z-0 h-[100px] w-1'>
                <LaunchLine height={100} strokeWidth={2} highlightStrokeWidth={2} strokeDasharray='2 4' />
              </div>
            </div>
          </div>
        </Step>

        <Step
          title={<p>Develop and Collaborate</p>}
          description='Transforming ideas and design into software products and implement our time-tested approach to deploy your project.'
          Icon={Code}
          position='left'
        >
          <div className='max-auto flex h-full flex-col items-end justify-end'>
            <div className='relative flex h-min w-full'>
              <div className='from-neutral-1100 to-neutral-1100/0 absolute inset-x-0 top-0 z-10 h-[100px] bg-gradient-to-b' />
              <div className='relative z-0 grid h-min w-full grid-cols-4 items-center justify-center gap-4'>
                <SourceIcon Icon={MailCheck} />
                <SourceIcon Icon={Fingerprint} />
                <SourceIcon Icon={CloudHail} />
                <SourceIcon Icon={Database} />
                <SourceIcon Icon={PieChart} />
                <SourceIcon Icon={Atom} />
                <SourceIcon Icon={Box} />
                <SourceIcon Icon={BarChart} />
                <SourceIcon Icon={Globe} />
                <SourceIcon Icon={Icons.gitHub} />
                <SourceIcon Icon={Icons.google} />
                <SourceIcon Icon={Upload} />
              </div>
            </div>
            <div className='h-[150px] w-full px-5'>
              <div ref={sourcesContainerRef}>
                <Lines
                  width={sourcesContainerDimensions.width}
                  height={150}
                  radius={5}
                  strokeWidth={1}
                  highlightStrokeWidth={2}
                  strokeDasharray={2}
                />
              </div>
            </div>
          </div>
        </Step>

        <Step
          title='Deliver, Launch at all touch points'
          description='Connect anytime, anywhere with Portal Web app. Compatible from any device & can switch to Mobile mode.'
          Icon={MonitorSmartphone}
          position='right'
        >
          <div className='relative overflow-hidden'>
            <div className='from-neutral-1100 to-neutral-1100/0 absolute top-0 z-20 h-[200px] w-full bg-gradient-to-b' />
            <div className='from-neutral-1100 to-neutral-1100/0 absolute right-0 z-20 h-full w-[200px] bg-gradient-to-l' />
            {/* <AnimatedGlobe className='relative z-10 h-[400px] w-[400px]' /> */}
            <div className='absolute bottom-0 left-[calc(50%-2px)] z-0 h-[100px] w-1'>
              <LaunchLine height={100} strokeWidth={2} highlightStrokeWidth={2} strokeDasharray='2 4' />
            </div>
          </div>
        </Step>
      </div>
    </div>
  )
}

export default SolutionPlatformSection
