export type Convention = {
  code: string
  name: string
  description: string
  title: string
  date: string
  fee: [{ member: number; nonMember: number }]
}

export const typeEnum = ['m', 'nm'] as const
export const typeValues = [
  { value: 'm', label: 'Member (8,500.00)' },
  { value: 'nm', label: 'Non-Member (9,500.00)' }
] as const

export const conventionEnum = ['25th'] as const
export const conventions: Convention[] = [
  {
    code: '25th',
    name: 'The Manila Hotel',
    description: 'Timeless DSAP: Adapting Through Generations',
    title: 'DSAPCon2024',
    date: 'April 24-26, 2024',
    fee: [{ member: 8500, nonMember: 9500 }]
  }
]
