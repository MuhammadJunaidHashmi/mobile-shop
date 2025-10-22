import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function calculateCancellationFee(orderAmount: number): number {
  if (orderAmount < 50000) {
    return 3000
  } else if (orderAmount < 80000) {
    return 5000
  } else if (orderAmount < 150000) {
    return 8000
  } else {
    return 10000
  }
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateTrackingNumber(): string {
  const prefix = 'MS'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '')
  
  // Check if it's a valid length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }
  
  // Luhn algorithm validation
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

export function validateExpiryDate(expiryDate: string): boolean {
  const cleaned = expiryDate.replace(/\D/g, '')
  
  if (cleaned.length !== 4) {
    return false
  }
  
  const month = parseInt(cleaned.substring(0, 2))
  const year = parseInt(cleaned.substring(2, 4))
  
  // Check if month is valid (01-12)
  if (month < 1 || month > 12) {
    return false
  }
  
  // Check if expiry date is not in the past
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }
  
  return true
}

export function validateCVV(cvv: string): boolean {
  const cleaned = cvv.replace(/\D/g, '')
  return cleaned.length === 3 || cleaned.length === 4
}
