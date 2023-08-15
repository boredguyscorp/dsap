import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { cn } from '@/lib/utils'
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
  )
}

interface SidebarShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarShell({ children, className, ...props }: SidebarShellProps) {
  return (
    <div className={cn('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarShellHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function SidebarShellHeader({ heading, text, children }: SidebarShellHeaderProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='grid gap-1'>
        {/* <h1 className='font-heading text-2xl md:text-3xl'>{heading}</h1> */}
        {/* {text && <p className='text-lg text-muted-foreground'>{text}</p>} */}
        <h1 className='text-xl font-semibold leading-none tracking-tight'>{heading}</h1>
        {text && (
          <h2 className='text-base text-muted-foreground'>
            <Balancer>{text}</Balancer>
          </h2>
        )}
      </div>
      {children}
    </div>
  )
}
