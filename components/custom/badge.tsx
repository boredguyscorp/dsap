import { cn } from '@/lib/utils'

export default function Badge({
  text,
  variant,
  className
}: {
  text: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'purple' | 'blue' | 'black' | 'gray' | 'teal'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
          'text-foreground': variant === 'outline',
          'border-violet-600 bg-violet-600 text-white': variant === 'purple',
          'border-blue-500 bg-blue-500 text-white': variant === 'blue',
          'border-black bg-black text-white': variant === 'black',
          'border-gray-400 bg-gray-400 text-white': variant === 'gray',
          'border-teal-500 bg-teal-500 text-white': variant === 'teal'
        },
        className
      )}
    >
      {text}
    </span>
  )
}
