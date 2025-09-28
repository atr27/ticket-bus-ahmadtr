import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')

    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 })
    }

    const routes = await prisma.route.findMany({
      where: {
        origin: {
          contains: origin,
          mode: 'insensitive'
        },
        destination: {
          contains: destination,
          mode: 'insensitive'
        }
      },
      include: {
        schedules: {
          include: {
            bus: true
          }
        }
      }
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error('Search routes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
