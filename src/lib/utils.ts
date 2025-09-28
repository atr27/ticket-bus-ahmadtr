import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

export function generateSeatMap(totalSeats: number, seatsPerRow: number = 4): string[][] {
  const seatMap: string[][] = []
  const rows = Math.ceil(totalSeats / seatsPerRow)
  
  for (let row = 0; row < rows; row++) {
    const seatRow: string[] = []
    for (let col = 0; col < seatsPerRow; col++) {
      const seatNumber = row * seatsPerRow + col + 1
      if (seatNumber <= totalSeats) {
        seatRow.push(seatNumber.toString())
      } else {
        seatRow.push('')
      }
    }
    seatMap.push(seatRow)
  }
  
  return seatMap
}