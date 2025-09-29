'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, User, Calendar, Phone, Mail } from 'lucide-react'
import { cn, formatCurrency, generateSeatMap, formatDateForDisplay } from '@/lib/utils'

interface Seat {
  number: string
  type: string
  isAvailable: boolean
  isSelected: boolean
}

interface Schedule {
  id: string
  fare: number
  departureTime: string
  arrivalTime: string
  availableSeats: number
  bus: {
    id: string
    operator: string
    type: string
    totalSeats: number
    seats: Array<{
      id: string
      number: string
      type: string
    }>
  }
  route: {
    id: string
    origin: string
    destination: string
  }
}

interface Passenger {
  name: string
  age: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  seatNumber: string
}

function SeatSelectionPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const scheduleId = searchParams.get('scheduleId')
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const date = searchParams.get('date')

  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([])
  const [currentStep, setCurrentStep] = useState<'seats' | 'passengers'>('seats')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!scheduleId) {
        setError('No schedule ID provided')
        setLoading(false)
        return
      }

      try {
        const url = `/api/schedule/${scheduleId}${date ? `?date=${date}` : ''}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Schedule not found')
        }

        const scheduleData = await response.json()
        setSchedule(scheduleData)

        // Generate seat map based on real data
        const seatMap = generateSeatMap(scheduleData.bus.totalSeats, 4)
        const seatList: Seat[] = []
        
        // Get actual booked seats for this schedule
        const bookingsResponse = await fetch(`/api/bookings/schedule/${scheduleId}${date ? `?date=${date}` : ''}`)
        let bookedSeatNumbers = new Set<string>()
        
        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json()
          bookings.forEach((booking: any) => {
            if (booking.status === 'CONFIRMED') {
              booking.seatIds.forEach((seatId: string) => bookedSeatNumbers.add(seatId))
            }
          })
        }
        
        // If we don't have enough real bookings to match the availableSeats count,
        // add some mock unavailable seats to simulate realistic occupancy
        const unavailableSeats = new Set(bookedSeatNumbers)
        const targetUnavailableCount = scheduleData.bus.totalSeats - scheduleData.availableSeats
        
        if (unavailableSeats.size < targetUnavailableCount) {
          const allSeatNumbers: string[] = []
          seatMap.forEach((row) => {
            row.forEach((seatNumber) => {
              if (seatNumber && !unavailableSeats.has(seatNumber)) {
                allSeatNumbers.push(seatNumber)
              }
            })
          })
          
          // Randomly select additional unavailable seats
          const shuffledSeats = [...allSeatNumbers].sort(() => Math.random() - 0.5)
          const additionalUnavailable = targetUnavailableCount - unavailableSeats.size
          for (let i = 0; i < additionalUnavailable; i++) {
            unavailableSeats.add(shuffledSeats[i])
          }
        }
        
        seatMap.forEach((row, rowIndex) => {
          row.forEach((seatNumber, colIndex) => {
            if (seatNumber) {
              seatList.push({
                number: seatNumber,
                type: colIndex === 0 || colIndex === 3 ? 'WINDOW' : 'AISLE',
                isAvailable: !unavailableSeats.has(seatNumber),
                isSelected: false
              })
            }
          })
        })
        
        setSeats(seatList)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [scheduleId])

  const handleSeatClick = (seatNumber: string) => {
    const seat = seats.find(s => s.number === seatNumber)
    if (!seat?.isAvailable) return

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber))
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats(prev => [...prev, seatNumber])
    }
  }

  const handleContinueToPassengers = () => {
    if (selectedSeats.length !== passengers) return

    const initialPassengers: Passenger[] = selectedSeats.map((seatNumber, index) => ({
      name: '',
      age: '',
      gender: 'MALE' as const,
      seatNumber
    }))
    
    setPassengerDetails(initialPassengers)
    setCurrentStep('passengers')
  }

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    setPassengerDetails(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ))
  }

  const handleProceedToPayment = () => {
    const isValid = passengerDetails.every(p => p.name && p.age && p.gender)
    if (!isValid) return

    const bookingData = {
      scheduleId,
      seatIds: selectedSeats,
      passengerDetails,
      totalAmount: schedule ? schedule.fare * passengers : 0,
      ...(date && { travelDate: date })
    }

    // Store in sessionStorage for payment page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData))
    router.push('/booking/payment')
  }

  const renderSeatMap = () => {
    if (!schedule) return null
    const seatMap = generateSeatMap(schedule.bus.totalSeats, 4)
    
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-gray-200 rounded-t-lg p-4 text-center text-sm font-medium mb-4">
          Driver
        </div>
        <div className="space-y-2">
          {seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((seatNumber, colIndex) => {
                if (!seatNumber) return <div key={colIndex} className="w-10 h-10" />
                
                const seat = seats.find(s => s.number === seatNumber)
                const isSelected = selectedSeats.includes(seatNumber)
                
                return (
                  <div key={seatNumber} className="flex items-center">
                    <button
                      onClick={() => handleSeatClick(seatNumber)}
                      disabled={!seat?.isAvailable}
                      className={cn(
                        "w-10 h-10 rounded text-xs font-medium border-2 transition-colors",
                        seat?.isAvailable
                          ? isSelected
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-white border-gray-300 hover:border-green-400"
                          : "bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500"
                      )}
                    >
                      {seatNumber}
                    </button>
                    {colIndex === 1 && <div className="w-4" />} {/* Aisle gap after 2nd column */}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded" />
            <span>Occupied</span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mx-auto mb-4" />
          <p>Loading schedule...</p>
        </div>
      </div>
    )
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Schedule Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The requested schedule could not be found.'}
            </p>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {currentStep === 'seats' ? 'Select Seats' : 'Passenger Details'}
            </h1>
            <p className="text-gray-600">
              {schedule?.bus.operator} • {schedule?.route.origin} → {schedule?.route.destination}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'seats' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Seats</CardTitle>
                  <p className="text-sm text-gray-600">
                    Select {passengers} seat{passengers > 1 ? 's' : ''} • {selectedSeats.length}/{passengers} selected
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {renderSeatMap()}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Information</CardTitle>
                  <p className="text-sm text-gray-600">
                    Please provide details for all passengers
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {passengerDetails.map((passenger, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5" />
                        <h3 className="font-semibold">
                          Passenger {index + 1} - Seat {passenger.seatNumber}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Enter full name"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Input
                            id={`age-${index}`}
                            type="number"
                            placeholder="Age"
                            value={passenger.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`gender-${index}`}>Gender</Label>
                          <Select 
                            value={passenger.gender} 
                            onValueChange={(value) => handlePassengerChange(index, 'gender', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">
                      {schedule?.route.origin} → {schedule?.route.destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {date 
                        ? formatDateForDisplay(date)
                        : schedule && new Date(schedule.departureTime).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">
                      {schedule && new Date(schedule.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {schedule && new Date(schedule.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bus:</span>
                    <span className="font-medium">{schedule?.bus.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span className="font-medium">{passengers}</span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between">
                      <span>Seats:</span>
                      <span className="font-medium">{selectedSeats.join(', ')}</span>
                    </div>
                  )}
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare ({passengers}x):</span>
                    <span>{schedule ? formatCurrency(schedule.fare * passengers) : '-'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">{schedule ? formatCurrency(schedule.fare * passengers) : '-'}</span>
                  </div>
                </div>

                {currentStep === 'seats' ? (
                  <Button 
                    onClick={handleContinueToPassengers}
                    disabled={selectedSeats.length !== passengers}
                    className="w-full"
                  >
                    Continue to Passenger Details
                  </Button>
                ) : (
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={!passengerDetails.every(p => p.name && p.age && p.gender)}
                    className="w-full"
                  >
                    Proceed to Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SeatSelectionPageContent />
    </Suspense>
  )
}
