import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'
import { format, isValid, parseISO } from 'date-fns'
import formatDistance from 'date-fns/formatDistance'
import { v4 as uuidv4 } from 'uuid'
import { CellStyle, WorkSheet, utils } from 'xlsx-js-style'

import { totp } from 'otplib'

totp.options = { step: 3600 } // 1hr expiration for prod env
// totp.options = { step: 300 } // 2 minutes  expiration for dev env

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const byteFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow'
})

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function toDateTime(date: Date) {
  // 11/30/23, 3:20 AM

  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

export function toDateNormal(val: Date) {
  return format(val, 'MM/dd/yyyy HH:mm:ss a')
}

export function toDate(val: Date, f?: 'MM/dd/yyyy' | 'yyyy-MM-dd') {
  if (!isValid(val)) return 'Invalid Date'

  return format(val, f ?? 'MM/dd/yyyy')
}

export function toDateDistance(val: Date) {
  return formatDistance(val, new Date(), { addSuffix: true })
}

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function generateCode() {
  return new Date().getFullYear() + '-' + generateRandomNumber(1000, 9999)
}

export const generateRandomString = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const generateNumberString = (length: number) => {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
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

export const imagePostEmpty = 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png'

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
  try {
    const response = await fetch(`https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    return `data:image/png;base64,${base64}`
  } catch (error) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast(errors.join('\n'))
  } else if (err instanceof Error) {
    return toast(err.message)
  } else {
    return toast('Something went wrong, please try again later.')
  }
}

export function strProperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateOTP = (otpSecret: string) => {
  return totp.generate(otpSecret + '-' + process.env.NEXT_PUBLIC_OTP_SECRET_KEY)
}

export const isOTPValid = (token: string, otpSecret: string) => {
  return totp.check(token, otpSecret + '-' + process.env.NEXT_PUBLIC_OTP_SECRET_KEY)
}

// convert string dates property of an object to Date, leaving other property as it is including array, number, boolean string, etc.
type AnyObject = { [key: string]: any }

function isString(value: any): value is string {
  return typeof value === 'string'
}

export function convertStringDatesPropToDates<T extends AnyObject>(obj: T): T {
  const newObj: AnyObject = Array.isArray(obj) ? [] : {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (isString(value)) {
      const date = parseISO(value)
      newObj[key] = isValid(date) ? date : value
    } else if (value instanceof Date) {
      newObj[key] = value // Leave Date objects as they are
    } else if (value && typeof value === 'object') {
      newObj[key] = convertStringDatesPropToDates(value) // Recursively process nested objects
    } else {
      newObj[key] = value // Copy over all other values as is
    }
  })

  return newObj as T
}

export const onPreventInput = (e: React.KeyboardEvent<HTMLInputElement>, regexPattern: RegExp) => {
  if (
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowDown' ||
    e.key === 'ArrowUp' ||
    e.key === 'Backspace' ||
    e.key === 'Tab' ||
    (e.code === 'KeyA' && e.ctrlKey)
  ) {
    return
  }

  if (!regexPattern.test(e.key)) {
    e.preventDefault()
  }
}

export async function Await<T>({ promise, children }: { promise: Promise<T> | undefined; children: (value: T) => JSX.Element }) {
  if (!promise) return null

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 3000)
  // })

  const data = await promise

  return children(data)
}

export async function getFileFromBlobUrl(url: string) {
  const res = await axios.get(url, { responseType: 'blob' })
  const blob = res.data as Blob

  return new File([blob], uuidv4(), { type: blob.type })
}

export function extractFileKeyFromUrl(url: string) {
  if (url) return url.split('/').pop() ?? ''
  return ''
}

type StyleWorkSheet = {
  worksheet: WorkSheet
  cellStyle: CellStyle
  headerStyle?: CellStyle
}

export function styleWorkSheet({ worksheet, cellStyle, headerStyle }: StyleWorkSheet) {
  const range = utils.decode_range(worksheet['!ref'] ?? '')
  const rowCount = range.e.r
  const columnCount = range.e.c

  for (let row = 0; row <= rowCount; row++) {
    for (let col = 0; col <= columnCount; col++) {
      const cellRef = utils.encode_cell({ r: row, c: col })

      //* add styles to cells
      worksheet[cellRef].s = cellStyle

      if (headerStyle && row === 0) {
        //* add styles to header
        worksheet[cellRef].s = {
          ...worksheet[cellRef].s,
          ...headerStyle
        }
      }
    }
  }
}
