'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeftRight, Calendar, Users, Search } from 'lucide-react'

export function SearchForm() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!searchData.from || !searchData.to || !searchData.departureDate) {
      alert('Please fill in all required fields')
      return
    }

    // Create search query
    const query = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.departureDate,
      passengers: searchData.passengers.toString()
    })

    // Navigate to search results
    router.push(`/search?${query.toString()}`)
  }

  const swapCities = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="bg-white shadow-xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From and To Cities */}
          <div className="grid md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                From
              </label>
              <Input
                type="text"
                placeholder="Enter departure city"
                value={searchData.from}
                onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                className="h-12 text-base"
                required
              />
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10 hidden md:block">
              <Button
                type="button"
                onClick={swapCities}
                size="icon"
                variant="outline"
                className="rounded-full bg-white border-2 hover:bg-red-50 hover:border-red-300"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                To
              </label>
              <Input
                type="text"
                placeholder="Enter destination city"
                value={searchData.to}
                onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          {/* Date and Passengers */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Departure Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchData.departureDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, departureDate: e.target.value }))}
                  min={today}
                  className="h-12 text-base pl-10"
                  required
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Passengers
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="9"
                  value={searchData.passengers}
                  onChange={(e) => setSearchData(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                  className="h-12 text-base pl-10"
                />
                <Users className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Buses
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
