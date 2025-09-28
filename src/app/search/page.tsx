'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, Wifi, Zap, Snowflake, AlertCircle } from 'lucide-react'
import { formatCurrency, formatTime } from '@/lib/utils'

interface Bus {
  id: string
  operator: string
  type: string
  totalSeats: number
  amenities: string[]
}

interface Route {
  id: string
  origin: string
  destination: string
  distance?: number
  duration?: number
}

interface Schedule {
  id: string
  departureTime: string
  arrivalTime: string
  availableSeats: number
  fare: number
  bus: Bus
  route: Route
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)

  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')
  const passengers = searchParams.get('passengers')

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!origin || !destination) {
        setError('Origin and destination are required')
        setLoading(false)
        return
      }

      try {
        const params = new URLSearchParams({
          origin,
          destination,
          ...(date && { date })
        })

        const response = await fetch(`/api/search/schedules?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch schedules')
        }

        const data = await response.json()
        setSchedules(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedules')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [origin, destination, date])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />
      case 'charging port':
        return <Zap className="h-4 w-4" />
      case 'ac':
        return <Snowflake className="h-4 w-4" />
      case 'blanket':
        return null
      default:
        return null
    }
  }

  const handleSelectSeats = (scheduleId: string) => {
    const params = new URLSearchParams({
      scheduleId,
      passengers: passengers || '1',
      ...(date && { date })
    })
    window.location.href = `/booking/seats?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold">{origin}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-semibold">{destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{passengers} passenger{passengers !== '1' ? 's' : ''}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.history.back()}>
                Modify Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mx-auto mb-4" />
              <p>Searching for buses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-red-500 mb-4">
                <AlertCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.history.back()}>
                Modify Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Buses ({schedules.length})</h2>
            
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    {/* Bus Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{schedule.bus.operator}</h3>
                    <p className="text-gray-600">{schedule.bus.type}</p>
                      <div className="flex flex-wrap gap-1">
                        {schedule.bus.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            <span className="flex items-center gap-1">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatTime(new Date(schedule.departureTime).toLocaleTimeString('en-US', { hour12: false }))}
                      </div>
                      <div className="text-sm text-gray-500">{schedule.route.origin}</div>
                      <div className="my-2">
                        <div className="text-sm text-gray-500">
                          {schedule.route.duration ? `${Math.floor(schedule.route.duration / 60)}h ${schedule.route.duration % 60}m` : '3h 0m'}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {formatTime(new Date(schedule.arrivalTime).toLocaleTimeString('en-US', { hour12: false }))}
                      </div>
                      <div className="text-sm text-gray-500">{schedule.route.destination}</div>
                    </div>

                    {/* Availability */}
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {schedule.availableSeats} seats available
                      </div>
                      <div className="text-sm text-gray-500">
                        out of {schedule.bus.totalSeats} seats
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-center space-y-3">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(schedule.fare)}
                      </div>
                      <Button 
                        onClick={() => handleSelectSeats(schedule.id)}
                        className="w-full"
                        disabled={schedule.availableSeats === 0}
                      >
                        {schedule.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {schedules.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">No buses found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or check for different dates.
                  </p>
                  <Button onClick={() => window.history.back()}>
                    Modify Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
