import { PlanProps } from '@/lib/type'
import Badge from './custom/badge'
import { cn, toProperCase } from '@/lib/utils'

export default function PlanBadge({ plan, className }: { plan: PlanProps; className?: string }) {
  return (
    <Badge
      className={cn('', className)}
      text={toProperCase(plan)}
      variant={plan === 'enterprise' ? 'purple' : plan === 'pro' ? 'blue' : 'black'}
    />
  )
}
