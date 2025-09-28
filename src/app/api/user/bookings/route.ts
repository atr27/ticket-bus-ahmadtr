import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true
          }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
