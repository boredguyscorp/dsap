import { Chapter } from '@prisma/client'

export const CURRENT_CONVENTION: ConventionEnum = '26th'
export const CURRENT_DATE = new Date().toISOString().split('T')[0]

export const conventionEnum = ['25th', '26th'] as const
export type ConventionEnum = (typeof conventionEnum)[number]

export type Convention = {
  code: ConventionEnum
  name: string
  description: string
  title: string
  date: string
  preRegCutOff: string
  rate: RateTypeValues[]
  img: string
}

export const typeEnum = ['25th-prm', '25th-prnm', '25th-m', '25th-nm', '26th-prm', '26th-prnm', '26th-m', '26th-nm'] as const
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
  { convention: '25th', value: '25th-nm', label: 'Non-Member (12,300.00)', amount: 12300, preReg: false },
  { convention: '26th', value: '26th-prm', label: 'Pre-Reg Member (9,000.00)', amount: 9000, preReg: true },
  { convention: '26th', value: '26th-prnm', label: 'Pre-Reg Non-Member (10,500.00)', amount: 10500, preReg: true },
  { convention: '26th', value: '26th-m', label: 'Member (10,000.00)', amount: 10000, preReg: false },
  { convention: '26th', value: '26th-nm', label: 'Non-Member (11,500.00)', amount: 11500, preReg: false }
]

export const conventions: Convention[] = [
  {
    code: '25th',
    name: 'The Manila Hotel',
    description: 'Timeless DSAP: Adapting Through Generations',
    title: 'DSAPCon2024',
    date: 'April 24-26, 2024',
    preRegCutOff: '2024-02-23',
    img: '/images/dsap25th.jpg',
    rate: rateValues.filter((row) => row.convention === '25th')
  },
  {
    code: '26th',
    name: 'Baguio City',
    description: 'Timeless DSAP: Adapting Through Generations',
    title: 'DSAPCon2025',
    date: 'March 26-28, 2025',
    preRegCutOff: '2025-01-28',
    img: '/images/dsap26th.png',
    rate: rateValues.filter((row) => row.convention === '26th')
  }
]

export const chaptersArray: Array<Pick<Chapter, 'id' | 'code' | 'name' | 'isActive'>> = [
  { id: '1', code: 'AGU', name: 'AGUSAN', isActive: true },
  { id: '2', code: 'AKL', name: 'AKLAN', isActive: true },
  { id: '3', code: 'ANT', name: 'ANTIQUE', isActive: true },
  { id: '4', code: 'AUR', name: 'AURORA', isActive: true },
  { id: '5', code: 'BGO', name: 'BAGUIO', isActive: true },
  { id: '6', code: 'BSL', name: 'BASILAN', isActive: true },
  { id: '7', code: 'BAT', name: 'BATAAN', isActive: true },
  { id: '8', code: 'BTG', name: 'BATANGAS', isActive: true },
  { id: '9', code: 'BHL', name: 'BOHOL', isActive: true },
  { id: '10', code: 'BUK', name: 'BUKIDNON', isActive: true },
  { id: '11', code: 'BUL', name: 'BULACAN', isActive: true },
  { id: '12', code: 'CV1', name: 'ISABELA-QUIRINO', isActive: true },
  { id: '13', code: 'CV2', name: 'CAGAYAN VALLEY 2', isActive: true },
  { id: '14', code: 'CAP', name: 'CAPIZ', isActive: true },
  { id: '15', code: 'CVT', name: 'CAVITE', isActive: true },
  { id: '16', code: 'CEB', name: 'CEBU', isActive: true },
  { id: '17', code: 'CNCR', name: 'CENTRAL NCR', isActive: true },
  { id: '18', code: 'COM', name: 'COMPOSTELA VALLEY', isActive: true },
  { id: '19', code: 'DVO', name: 'DAVAO', isActive: true },
  { id: '20', code: 'ENCR', name: 'EAST NCR', isActive: true },
  { id: '21', code: 'ILO', name: 'ILO-ILO', isActive: true },
  { id: '22', code: 'ILN', name: 'ILOCOS NORTE', isActive: true },
  { id: '23', code: 'ILS', name: 'ILOCOS SUR', isActive: true },
  { id: '24', code: 'LAU', name: 'LA-UNION', isActive: true },
  { id: '25', code: 'LAG', name: 'LAGUNA', isActive: true },
  { id: '26', code: 'LEY', name: 'LEYTE-SAMAR', isActive: true },
  { id: '27', code: 'MAR', name: 'MARINDUQUE', isActive: true },
  { id: '28', code: 'MEO', name: 'METRO ORMOC', isActive: true },
  { id: '29', code: 'MIS', name: 'MISAMIS OCCIDENTAL', isActive: true },
  { id: '30', code: 'MSO', name: 'MISAMIS ORIENTAL', isActive: true },
  { id: '31', code: 'NOC', name: 'NEGROS OCCIDENTAL', isActive: true },
  { id: '32', code: 'NBC', name: 'NORTH BICOL', isActive: true },
  { id: '33', code: 'COT', name: 'NORTH COTABATO', isActive: true },
  { id: '34', code: 'NNCR', name: 'NORTH NCR', isActive: true },
  { id: '35', code: 'NUE', name: 'NUEVA ECIJA', isActive: true },
  { id: '36', code: 'NVS', name: 'NUEVA VISCAYA', isActive: true },
  { id: '37', code: 'MIN', name: 'OR. MINDORO', isActive: true },
  { id: '38', code: 'PAL', name: 'PALAWAN', isActive: true },
  { id: '39', code: 'PAM', name: 'PAMPANGA', isActive: true },
  { id: '40', code: 'PAG', name: 'PANGASINAN', isActive: true },
  { id: '41', code: 'QZN', name: 'QUEZON PROVINCE', isActive: true },
  { id: '42', code: 'QRN', name: 'QUIRINO', isActive: true },
  { id: '43', code: 'SIQ', name: 'SIQUIJOR', isActive: true },
  { id: '44', code: 'SCG', name: 'SOCKSARGEN', isActive: true },
  { id: '45', code: 'SBC', name: 'SOUTH BICOL', isActive: true },
  { id: '46', code: 'SNCR', name: 'SOUTH NCR', isActive: true },
  { id: '47', code: 'SUG', name: 'SURIGAO', isActive: true },
  { id: '48', code: 'TAR', name: 'TARLAC', isActive: true },
  { id: '49', code: 'TAW', name: 'TAWI-TAWI', isActive: true },
  { id: '50', code: 'WNCR', name: 'WEST NCR', isActive: true },
  { id: '51', code: 'ZAM', name: 'ZAMBALES', isActive: true },
  { id: '52', code: 'ZMG', name: 'ZAMBOANGA', isActive: true },
  { id: '53', code: 'PGD', name: 'PAGADIAN', isActive: true },
  { id: '54', code: 'BGT', name: 'BENGUET', isActive: true },
  { id: '55', code: 'DMG', name: 'DUMAGUETE', isActive: true },
  { id: '56', code: 'PPP', name: 'PP PALMA', isActive: true }
]

const delegateClassEnum = ['Non-Pharmacist', 'Pharmacist'] as const

type DelegateClass = (typeof delegateClassEnum)[number]
type DelegateClassValues = {
  value: DelegateClass
  label: string
}

export const delegateClassList = [
  { value: 'Non-Pharmacist', label: 'Non-Pharmacist' },
  { value: 'Pharmacist', label: 'Pharmacist' }
] satisfies DelegateClassValues[]

export const nonPharmacistTypeEnum = ['CPhAD Member', 'Non-Member'] as const
