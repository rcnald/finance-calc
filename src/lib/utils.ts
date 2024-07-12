import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

export function formatToCurrency(value: string) {
  const valueRaw = value.replace(/\D/g, '').replace(/^0+/, '')

  return valueRaw
    .padStart(3, '0')
    .replace(/(\d{2})$/, ',$1')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function filterDigits(value: string) {
  return value.replace(/\D/g, '')
}
