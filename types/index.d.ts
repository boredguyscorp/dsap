import { User } from '@prisma/client'
import type { Icon } from 'lucide-react'

import { Icons } from '@/components/icons'

export type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFilterOption<TData> {
  id?: string
  label: string
  value: keyof TData | string
  items: Option[]
  isMulti?: boolean
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, 'stripeCustomerId' | 'stripeSubscriptionId'> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }

export type PromiseGenerics<T extends (..._args: any) => Promise<any>> = ArrayElement<AsyncReturnType<T>>

export type AsyncReturnType<T extends (..._args: any) => Promise<any>> = Awaited<ReturnType<T>>

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type RecursivelyConvertDatesToStrings<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? RecursivelyConvertDatesToStrings<U>[]
  : T extends object
  ? { [K in keyof T]: RecursivelyConvertDatesToStrings<T[K]> }
  : T

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: never
}
