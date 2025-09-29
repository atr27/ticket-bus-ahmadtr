'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, Search, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'

export default function BusSearchForm() {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: new Date(),
    passengers: '1'
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchData.origin || !searchData.destination) return

    setIsLoading(true)
    const params = new URLSearchParams({
      origin: searchData.origin,
      destination: searchData.destination,
      date: format(searchData.date, 'yyyy-MM-dd'),
      passengers: searchData.passengers
    })
    
    router.push(`/search?${params.toString()}`)
  }

  const popularRoutes = [
    { from: 'Jakarta', to: 'Bandung' },
    { from: 'Jakarta', to: 'Yogyakarta' },
    { from: 'Surabaya', to: 'Malang' },
    { from: 'Medan', to: 'Padang' },
    { from: 'Jakarta', to: 'Surabaya' },
    { from: 'Bandung', to: 'Yogyakarta' },
    { from: 'Semarang', to: 'Surabaya' },
    { from: 'Denpasar', to: 'Mataram' },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-2xl rounded-2xl overflow-hidden border-0">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Find Your Bus</h2>
          </div>
        </div>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="h-5 w-5 text-red-600" />
                  From
                </Label>
                <div className="relative">
                  <Input
                    id="origin"
                    placeholder="Enter departure city"
                    value={searchData.origin}
                    onChange={(e) => setSearchData(prev => ({ ...prev, origin: e.target.value }))}
                    className="h-12 pl-12 rounded-xl border-2 focus:border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-2"
                    required
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="h-5 w-5 text-red-600" />
                  To
                </Label>
                <div className="relative">
                  <Input
                    id="destination"
                    placeholder="Enter destination city"
                    value={searchData.destination}
                    onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                    className="h-12 pl-12 rounded-xl border-2 focus:border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-2"
                    required
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-gray-700 font-medium">
                  <Calendar className="h-5 w-5 text-red-600" />
                  Travel Date
                </Label>
                <DatePicker
                  date={searchData.date}
                  onDateChange={(date) => date && setSearchData(prev => ({ ...prev, date }))}
                  placeholder="Select travel date"
                  minDate={new Date()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers" className="flex items-center gap-2 text-gray-700 font-medium">
                  <Users className="h-5 w-5 text-red-600" />
                  Passengers
                </Label>
                <div className="relative">
                  <Select value={searchData.passengers} onValueChange={(value) => setSearchData(prev => ({ ...prev, passengers: value }))}>
                    <SelectTrigger className="h-12 pl-12 rounded-xl border-2 focus:border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-2">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="h-6 w-6" />
                  Search Buses
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Bus className="h-5 w-5 text-red-600" />
              Popular Routes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {popularRoutes.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchData(prev => ({ 
                    ...prev, 
                    origin: route.from, 
                    destination: route.to 
                  }))}
                  className="text-sm border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg py-2 h-auto"
                >
                  {route.from} → {route.to}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
