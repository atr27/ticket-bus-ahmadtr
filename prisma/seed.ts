import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create buses with popular Indonesian operators
  const busData = [
    {
      operator: 'Primajasa',
      type: 'AC Seater',
      totalSeats: 40,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Reading Light'],
    },
    {
      operator: 'Pahala Kencana',
      type: 'AC Sleeper',
      totalSeats: 30,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Blanket', 'Pillow'],
    },
    {
      operator: 'Sinar Jaya',
      type: 'Executive',
      totalSeats: 35,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Snack', 'Water'],
    },
    {
      operator: 'Rosalia Indah',
      type: 'AC Executive',
      totalSeats: 32,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Entertainment', 'Snack'],
    },
    {
      operator: 'Harapan Jaya',
      type: 'AC Seater',
      totalSeats: 45,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Reading Light'],
    },
    {
      operator: 'Gunung Harta',
      type: 'AC Sleeper',
      totalSeats: 28,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Blanket', 'Pillow', 'Entertainment'],
    },
    {
      operator: 'Kramat Djati',
      type: 'Executive',
      totalSeats: 36,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Snack', 'Water', 'Reading Light'],
    },
    {
      operator: 'Budiman',
      type: 'AC Seater',
      totalSeats: 42,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Reading Light'],
    },
    {
      operator: 'Lorena',
      type: 'AC Executive',
      totalSeats: 34,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Entertainment', 'Snack', 'Water'],
    },
    {
      operator: 'Nusantara',
      type: 'AC Sleeper',
      totalSeats: 26,
      amenities: ['WiFi', 'Charging Port', 'AC', 'Blanket', 'Pillow', 'Entertainment', 'Meal'],
    }
  ]

  const createdBuses = []
  for (const data of busData) {
    const bus = await prisma.bus.create({ data })
    createdBuses.push(bus)
  }

  // For backward compatibility
  const bus1 = createdBuses[0]
  const bus2 = createdBuses[1]
  const bus3 = createdBuses[2]

  console.log('✅ Created buses')

  // Create popular routes across Indonesia
  const routes = [
    // Java Island - Most Popular Routes
    {
      origin: 'Jakarta',
      destination: 'Bandung',
      distance: 150,
      duration: 180, // 3 hours
      baseFare: 150000,
    },
    {
      origin: 'Jakarta',
      destination: 'Yogyakarta',
      distance: 560,
      duration: 480, // 8 hours
      baseFare: 250000,
    },
    {
      origin: 'Jakarta',
      destination: 'Surabaya',
      distance: 800,
      duration: 720, // 12 hours
      baseFare: 350000,
    },
    {
      origin: 'Jakarta',
      destination: 'Solo',
      distance: 520,
      duration: 420, // 7 hours
      baseFare: 220000,
    },
    {
      origin: 'Jakarta',
      destination: 'Semarang',
      distance: 450,
      duration: 360, // 6 hours
      baseFare: 200000,
    },
    {
      origin: 'Bandung',
      destination: 'Yogyakarta',
      distance: 420,
      duration: 360, // 6 hours
      baseFare: 180000,
    },
    {
      origin: 'Surabaya',
      destination: 'Malang',
      distance: 90,
      duration: 120, // 2 hours
      baseFare: 100000,
    },
    {
      origin: 'Surabaya',
      destination: 'Yogyakarta',
      distance: 320,
      duration: 300, // 5 hours
      baseFare: 160000,
    },
    {
      origin: 'Yogyakarta',
      destination: 'Solo',
      distance: 65,
      duration: 90, // 1.5 hours
      baseFare: 80000,
    },
    {
      origin: 'Semarang',
      destination: 'Yogyakarta',
      distance: 120,
      duration: 150, // 2.5 hours
      baseFare: 90000,
    },

    // Sumatra Island Routes
    {
      origin: 'Medan',
      destination: 'Padang',
      distance: 460,
      duration: 360, // 6 hours
      baseFare: 200000,
    },
    {
      origin: 'Medan',
      destination: 'Pekanbaru',
      distance: 350,
      duration: 300, // 5 hours
      baseFare: 180000,
    },
    {
      origin: 'Medan',
      destination: 'Banda Aceh',
      distance: 360,
      duration: 420, // 7 hours
      baseFare: 220000,
    },
    {
      origin: 'Padang',
      destination: 'Bukittinggi',
      distance: 90,
      duration: 120, // 2 hours
      baseFare: 75000,
    },
    {
      origin: 'Palembang',
      destination: 'Lampung',
      distance: 240,
      duration: 240, // 4 hours
      baseFare: 120000,
    },
    {
      origin: 'Pekanbaru',
      destination: 'Padang',
      distance: 280,
      duration: 300, // 5 hours
      baseFare: 150000,
    },

    // Kalimantan Routes
    {
      origin: 'Balikpapan',
      destination: 'Samarinda',
      distance: 120,
      duration: 150, // 2.5 hours
      baseFare: 85000,
    },
    {
      origin: 'Pontianak',
      destination: 'Singkawang',
      distance: 145,
      duration: 180, // 3 hours
      baseFare: 95000,
    },
    {
      origin: 'Banjarmasin',
      destination: 'Martapura',
      distance: 40,
      duration: 60, // 1 hour
      baseFare: 50000,
    },

    // Sulawesi Routes
    {
      origin: 'Makassar',
      destination: 'Pare-Pare',
      distance: 155,
      duration: 180, // 3 hours
      baseFare: 100000,
    },
    {
      origin: 'Manado',
      destination: 'Tomohon',
      distance: 25,
      duration: 45, // 45 minutes
      baseFare: 40000,
    },

    // Bali Routes
    {
      origin: 'Denpasar',
      destination: 'Ubud',
      distance: 35,
      duration: 60, // 1 hour
      baseFare: 60000,
    },
    {
      origin: 'Denpasar',
      destination: 'Singaraja',
      distance: 85,
      duration: 120, // 2 hours
      baseFare: 80000,
    },

    // Inter-Island Popular Routes
    {
      origin: 'Jakarta',
      destination: 'Denpasar',
      distance: 1150,
      duration: 1200, // 20 hours (with ferry)
      baseFare: 450000,
    },
  ]

  const createdRoutes = []
  for (const routeData of routes) {
    const route = await prisma.route.create({
      data: routeData
    })
    createdRoutes.push(route)
  }

  // For backward compatibility, assign the first few routes to variables
  const route1 = createdRoutes[0] // Jakarta-Bandung
  const route2 = createdRoutes[1] // Jakarta-Yogyakarta
  const route3 = createdRoutes[6] // Surabaya-Malang
  const route4 = createdRoutes[10] // Medan-Padang

  console.log('✅ Created routes')

  // Create seats for each bus
  for (const bus of createdBuses) {
    const seats = []
    for (let i = 1; i <= bus.totalSeats; i++) {
      const seatType = i % 4 === 1 || i % 4 === 0 ? 'Window' : 'Aisle'
      seats.push({
        busId: bus.id,
        number: i.toString(),
        type: seatType,
      })
    }
    
    await prisma.seat.createMany({
      data: seats
    })
  }

  console.log('✅ Created seats')

  // Create comprehensive schedules for popular routes
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const schedules = []
  
  // Generate schedules for the most popular routes with multiple buses
  const popularRouteIndices = [0, 1, 2, 3, 4, 6, 7, 10, 11] // Jakarta-Bandung, Jakarta-Yogya, etc.
  
  for (const routeIndex of popularRouteIndices) {
    const route = createdRoutes[routeIndex]
    const numSchedules = Math.min(5, createdBuses.length) // Up to 5 schedules per popular route
    
    for (let i = 0; i < numSchedules; i++) {
      const bus = createdBuses[i % createdBuses.length]
      const baseHour = route.origin === 'Jakarta' ? 6 + (i * 3) : 7 + (i * 2)
      const departureHour = baseHour % 24
      const routeDuration = route.duration || 180 // Default 3 hours if null
      const arrivalHour = (departureHour + Math.floor(routeDuration / 60)) % 24
      
      const departureTime = new Date(tomorrow)
      departureTime.setHours(departureHour, i * 15, 0, 0) // Stagger by 15 minutes
      
      const arrivalTime = new Date(departureTime)
      arrivalTime.setMinutes(arrivalTime.getMinutes() + routeDuration)
      
      // Calculate fare with some variation based on bus type
      let fareMultiplier = 1
      if (bus.type.includes('Executive')) fareMultiplier = 1.2
      if (bus.type.includes('Sleeper')) fareMultiplier = 1.4
      
      schedules.push({
        busId: bus.id,
        routeId: route.id,
        departureTime,
        arrivalTime,
        availableSeats: bus.totalSeats - Math.floor(Math.random() * 10), // Random availability
        fare: Math.round(route.baseFare * fareMultiplier),
      })
    }
  }
  
  // Add some schedules for other routes too
  for (let i = popularRouteIndices.length; i < Math.min(createdRoutes.length, 15); i++) {
    const route = createdRoutes[i]
    const bus = createdBuses[i % createdBuses.length]
    
    const departureTime = new Date(tomorrow)
    departureTime.setHours(8 + (i % 12), 0, 0, 0)
    
    const arrivalTime = new Date(departureTime)
    arrivalTime.setMinutes(arrivalTime.getMinutes() + (route.duration || 180))
    
    schedules.push({
      busId: bus.id,
      routeId: route.id,
      departureTime,
      arrivalTime,
      availableSeats: bus.totalSeats - Math.floor(Math.random() * 8),
      fare: route.baseFare,
    })
  }

  await prisma.schedule.createMany({
    data: schedules
  })

  console.log('✅ Created schedules')

  // Create a test user (or update if exists)
  const hashedPassword = await bcrypt.hash('password123', 12)
  const testUser = await prisma.user.upsert({
    where: {
      email: 'test@example.com'
    },
    update: {
      name: 'Test User',
      password: hashedPassword,
      phone: '+6281234567890',
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      phone: '+6281234567890',
    }
  })

  console.log('✅ Created test user')
  console.log('📧 Test user email: test@example.com')
  console.log('🔑 Test user password: password123')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })