export const conventionEnum = ['25th'] as const
export type ConventionEnum = (typeof conventionEnum)[number]

export type Convention = {
  code: ConventionEnum
  name: string
  description: string
  title: string
  date: string
  preRegCutOff: string
  rate: RateTypeValues[]
}

export const typeEnum = ['25th-prm', '25th-prnm', '25th-m', '25th-nm'] as const
export type TypeRate = (typeof typeEnum)[number]

type RateTypeValues = {
  convention: ConventionEnum
  value: TypeRate
  label: string
  amount: number
  preReg: boolean
}
export const rateValues: RateTypeValues[] = [
  { convention: '25th', value: '25th-prm', label: 'Pre-Reg Member (9,800.00)', amount: 9800, preReg: true },
  { convention: '25th', value: '25th-prnm', label: 'Pre-Reg Non-Member (11,300.00)', amount: 11300, preReg: true },
  { convention: '25th', value: '25th-m', label: 'Member (10,800.00)', amount: 10800, preReg: false },
  { convention: '25th', value: '25th-nm', label: 'Non-Member (12,300.00)', amount: 12300, preReg: false }
]

export const conventions: Convention[] = [
  {
    code: '25th',
    name: 'The Manila Hotel',
    description: 'Timeless DSAP: Adapting Through Generations',
    title: 'DSAPCon2024',
    date: 'April 24-26, 2024',
    preRegCutOff: '2024-02-16',
    rate: rateValues.filter((row) => row.convention === '25th')
  }
]
