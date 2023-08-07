import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

import formatDistance from 'date-fns/formatDistance'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function toDateNormal(val: Date) {
  return format(val, 'MM/dd/yyyy HH:mm:ss a')
}

export function toDateDistance(val: Date) {
  return formatDistance(val, new Date(), { addSuffix: true })
}

export function generateCode() {
  return new Date().getFullYear() + '-' + generateRandomNumber(1000, 9999)
}

export function slugify(str: string) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

export function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function toProperCase(str: string | undefined | null): string {
  return str ? str.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : ''
}
