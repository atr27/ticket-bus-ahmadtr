import { Prisma } from '@prisma/client'
// Database types with relations
export type UserWithBookings = Prisma.UserGetPayload<{
  include: { bookings: true }
}>

export type BusWithDetails = Prisma.BusGetPayload<{
  include: { 
    seats: true
    schedules: {
      include: {
        route: true
      }
    }
  }
}>

export type ScheduleWithDetails = Prisma.ScheduleGetPayload<{
  include: {
    bus: {
      include: {
        seats: true
      }
    }
    route: true
  }
}>

export type BookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    user: true
    schedule: {
      include: {
        bus: true
        route: true
      }
    }
    seats: true
    payment: true
  }
}>

// Search and Filter types
export interface SearchFilters {
  from: string
  to: string
  departureDate: string
  returnDate?: string
  passengers: number
}

export interface BusFilters {
  busType?: string[]
  priceRange?: {
    min: number
    max: number
  }
  departureTime?: {
    start: string
    end: string
  }
  operators?: string[]
  amenities?: string[]
}

export interface SortOptions {
  field: 'price' | 'duration' | 'departure' | 'rating'
  order: 'asc' | 'desc'
}

// Booking types
export interface PassengerDetails {
  name: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  seatNumber: string
}

export interface BookingRequest {
  scheduleId: string
  travelDate: string
  passengers: PassengerDetails[]
  selectedSeats: string[]
  contactInfo: {
    email: string
    phone: string
  }
}

// Payment types
export interface PaymentRequest {
  bookingId: string
  amount: number
  paymentMethod: string
}

export interface PaymentResponse {
  transactionToken: string
  redirectUrl?: string
  orderId: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form validation types
export interface SearchFormData {
  from: string
  to: string
  departureDate: Date
  returnDate?: Date
  passengers: number
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
}

// Component prop types
export interface BusCardProps {
  schedule: ScheduleWithDetails
  onSelect: (scheduleId: string) => void
}

export interface SeatMapProps {
  seats: Array<{
    id: string
    seatNumber: string
    seatType: string
    price: number
    isBooked: boolean
  }>
  selectedSeats: string[]
  onSeatSelect: (seatNumber: string) => void
}

export interface FilterSidebarProps {
  filters: BusFilters
  onFiltersChange: (filters: BusFilters) => void
  availableOperators: Array<{ id: string; name: string }>
}

// Store types (Zustand)
export interface SearchStore {
  searchFilters: SearchFilters | null
  searchResults: ScheduleWithDetails[]
  loading: boolean
  error: string | null
  setSearchFilters: (filters: SearchFilters) => void
  setSearchResults: (results: ScheduleWithDetails[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export interface BookingStore {
  currentBooking: {
    schedule: ScheduleWithDetails | null
    selectedSeats: string[]
    passengers: PassengerDetails[]
    contactInfo: ContactFormData | null
  }
  setSchedule: (schedule: ScheduleWithDetails) => void
  setSelectedSeats: (seats: string[]) => void
  setPassengers: (passengers: PassengerDetails[]) => void
  setContactInfo: (info: ContactFormData) => void
  clearBooking: () => void
}