'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Bus, User, LogOut } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Ticket Bus</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Bus Tickets
            </Link>
            {session && (
              <Link href="/bookings" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                My Bookings
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-red-50 px-4 py-2 rounded-full">
                  <User className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700 hidden md:block">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="space-x-3">
                <Button asChild variant="ghost" className="text-gray-700 hover:text-red-600 font-medium">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-medium">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}