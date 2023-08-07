import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { Balancer } from 'react-wrap-balancer'

export function DashboardShell(props: {
  title: string
  description: string
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={props.className}>
      <div className='mb-10 flex h-36 border-b'>
        <MaxWidthWrapper className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h1 className='text-xl font-semibold leading-none tracking-tight'>{props.title}</h1>
            <h2 className='text-base text-muted-foreground'>
              <Balancer>{props.description}</Balancer>
            </h2>
          </div>
          {props.headerAction}
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>{props.children}</MaxWidthWrapper>
    </div>

    // <div className={props.className}>
    //   <div className='mb-4 h-36 gap-4 border-b border-gray-200'>
    //     <MaxWidthWrapper className='flex items-center justify-between'>
    //       <div className='space-y-1'>
    //         <h1 className='text-xl font-semibold leading-none tracking-tight'>{props.title}</h1>
    //         <h2 className='text-base text-muted-foreground'>
    //           <Balancer>{props.description}</Balancer>
    //         </h2>
    //       </div>
    //       {props.headerAction}
    //     </MaxWidthWrapper>
    //   </div>

    //   <MaxWidthWrapper>{props.children}</MaxWidthWrapper>
    // </div>
  )

  // return (
  //   <div className={props.className}>
  //     <div className='mb-4 flex h-36 items-center justify-between gap-4 border-gray-950 bg-red-200 '>
  //       <div className='space-y-1'>
  //         <h1 className='text-xl font-semibold leading-none tracking-tight'>{props.title}</h1>
  //         <h2 className='text-base text-muted-foreground'>
  //           <Balancer>{props.description}</Balancer>
  //         </h2>
  //       </div>
  //       {props.headerAction}
  //     </div>

  //     <div className='flex h-36 items-center border-b-2 border-gray-200 bg-white'>
  //       <MaxWidthWrapper>
  //         <div className='flex items-center justify-between'>
  //           <h1 className='text-2xl text-gray-600'>{props.title}</h1>
  //           {props.headerAction}
  //         </div>
  //       </MaxWidthWrapper>
  //     </div>

  //     {props.children}
  //   </div>
  // )
}
