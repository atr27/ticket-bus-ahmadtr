import { z } from 'zod'

// Search validation
export const searchFormSchema = z.object({
  from: z.string().min(1, 'Origin city is required'),
  to: z.string().min(1, 'Destination city is required'),
  departureDate: z.date({
    required_error: 'Departure date is required',
  }),
  returnDate: z.date().optional(),
  passengers: z.number().min(1, 'At least 1 passenger required').max(9, 'Maximum 9 passengers allowed'),
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid Indonesian phone number'),
})

// Passenger validation
export const passengerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  seatNumber: z.string().min(1, 'Seat number is required'),
})

// Booking request validation
export const bookingRequestSchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required'),
  travelDate: z.string().min(1, 'Travel date is required'),
  passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
  selectedSeats: z.array(z.string()).min(1, 'At least one seat must be selected'),
  contactInfo: contactFormSchema,
})

// Payment validation
export const paymentRequestSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
})

// Bus search filters validation
export const busFiltersSchema = z.object({
  busType: z.array(z.string()).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  departureTime: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }).optional(),
  operators: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
})

// API query parameters validation
export const searchQuerySchema = z.object({
  from: z.string(),
  to: z.string(),
  date: z.string(),
  passengers: z.string().transform(Number).pipe(z.number().min(1).max(9)),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default('10'),
})

// User registration validation
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid Indonesian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Admin validation schemas
export const createBusOperatorSchema = z.object({
  name: z.string().min(2, 'Operator name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional(),
})

export const createBusSchema = z.object({
  name: z.string().min(2, 'Bus name is required'),
  number: z.string().min(3, 'Bus number is required'),
  operatorId: z.string().min(1, 'Operator is required'),
  busType: z.enum(['AC_SLEEPER', 'NON_AC_SLEEPER', 'AC_SEATER', 'NON_AC_SEATER', 'LUXURY', 'SEMI_SLEEPER']),
  totalSeats: z.number().min(1, 'Total seats must be at least 1').max(80, 'Maximum 80 seats allowed'),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()),
})

export const createRouteSchema = z.object({
  fromCityId: z.string().min(1, 'From city is required'),
  toCityId: z.string().min(1, 'To city is required'),
  fromStationId: z.string().min(1, 'From station is required'),
  toStationId: z.string().min(1, 'To station is required'),
  distance: z.number().min(0.1, 'Distance must be greater than 0'),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
})

export const createScheduleSchema = z.object({
  busId: z.string().min(1, 'Bus is required'),
  routeId: z.string().min(1, 'Route is required'),
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  arrivalTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  validFrom: z.date(),
  validTo: z.date(),
  recurringDays: z.array(z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])),
  basePrice: z.number().min(1, 'Base price must be greater than 0'),
})