import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export default function HomePageWrapper({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1700px] px-2.5', className)}>{children}</div>
}
