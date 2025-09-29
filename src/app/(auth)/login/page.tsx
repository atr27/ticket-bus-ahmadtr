'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to Ticket Bus
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Access your account with email and password
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push('/auth/signin')}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Sign In with Email
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Don&apos;t have an account yet?
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => router.push('/auth/signup')}
            variant="ghost"
            className="w-full"
          >
            Create new account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
