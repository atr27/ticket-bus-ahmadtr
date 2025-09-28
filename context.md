{
    "appName": "RedBus ID Clone",
    "appDescription": "A comprehensive bus ticket booking platform inspired by RedBus ID, built with Next.js, Prisma ORM, Xendit payment integration, and Neon database.",
    "techStack": {
        "frontend": {
            "framework": "Next.js 14+ (App Router)",
            "language": "TypeScript",
            "styling": "Tailwind CSS",
            "stateManagement": "Zustand/React Context",
            "formHandling": "React Hook Form + Zod",
            "dataFetching": "TanStack Query (React Query)",
            "uiComponents": "Shadcn/ui or Headless UI"
        },
        "backend": {
            "runtime": "Next.js API Routes",
            "orm": "Prisma",
            "authentication": "NextAuth.js",
            "paymentGateway": "Xendit",
            "emailService": "Resend or Nodemailer"
        },
        "database": {
            "provider": "Neon (PostgreSQL)",
            "orm": "Prisma",
            "migrations": "Prisma Migrate"
        },
        "deployment": {
            "platform": "Vercel",
            "database": "Neon",
            "envManagement": "Vercel Environment Variables"
        }
    },
    "coreFeatures": {
        "userManagement": {
            "userRegistration": "Email/password, OAuth (Google)",
            "userProfile": "Personal information, booking history, saved payment methods",
            "authentication": "JWT-based sessions with NextAuth.js"
        },
        "busSearchBooking": {
            "searchInterface": "Origin, destination, travel date, passenger count",
            "resultsFiltering": "By departure time, arrival time, bus type, price, ratings",
            "seatSelection": "Interactive seat map with real-time availability",
            "bookingSummary": "Trip details, passenger information, fare breakdown"
        },
        "paymentProcessing": {
            "integration": "Xendit API",
            "paymentMethods": "Credit/Debit cards, bank transfer, e-wallets (OVO, GoPay, DANA), QRIS",
            "paymentSecurity": "PCI DSS compliant through Xendit",
            "paymentStatus": "Real-time payment status updates webhooks"
        },
        "bookingManagement": {
            "bookingConfirmation": "Email/SMS notifications",
            "ticketGeneration": "PDF tickets with QR codes",
            "cancellationPolicy": "Flexible cancellation with refund processing",
            "bookingHistory": "Complete history with filter options"
        },
        "adminPanel": {
            "busManagement": "Add/edit buses, routes, schedules",
            "userManagement": "View users, manage permissions",
            "bookingManagement": "View all bookings, process refunds",
            "analytics": "Revenue reports, booking trends, popular routes"
        }
    },
    "databaseSchema": {
        "users": {
            "id": "String @id @default(cuid())",
            "email": "String @unique",
            "name": "String?",
            "password": "String?",
            "phone": "String?",
            "emailVerified": "DateTime?",
            "image": "String?",
            "createdAt": "DateTime @default(now())",
            "updatedAt": "DateTime @updatedAt",
            "bookings": "Booking[]",
            "accounts": "Account[]",
            "sessions": "Session[]"
        },
        "buses": {
            "id": "String @id @default(cuid())",
            "operator": "String",
            "type": "String", // AC, Non-AC, Sleeper, etc.
            "totalSeats": "Int",
            "amenities": "String[]", // WiFi, Charging, Blanket, etc.
            "seats": "Seat[]",
            "schedules": "Schedule[]"
        },
        "routes": {
            "id": "String @id @default(cuid())",
            "origin": "String",
            "destination": "String",
            "distance": "Int?", // in km
            "duration": "Int?", // in minutes
            "baseFare": "Float",
            "schedules": "Schedule[]"
        },
        "schedules": {
            "id": "String @id @default(cuid())",
            "busId": "String",
            "routeId": "String",
            "departureTime": "DateTime",
            "arrivalTime": "DateTime",
            "availableSeats": "Int",
            "fare": "Float",
            "bus": "Bus @relation(fields: [busId], references: [id])",
            "route": "Route @relation(fields: [routeId], references: [id])",
            "bookings": "Booking[]"
        },
        "seats": {
            "id": "String @id @default(cuid())",
            "busId": "String",
            "number": "String",
            "type": "String", // Window, Aisle, etc.
            "bus": "Bus @relation(fields: [busId], references: [id])",
            "bookings": "Booking[]"
        },
        "bookings": {
            "id": "String @id @default(cuid())",
            "userId": "String",
            "scheduleId": "String",
            "seatIds": "String[]",
            "passengerDetails": "Json", // Name, age, gender
            "totalAmount": "Float",
            "status": "BookingStatus", // PENDING, CONFIRMED, CANCELLED
            "paymentStatus": "PaymentStatus", // PENDING, PAID, FAILED
            "paymentId": "String?",
            "createdAt": "DateTime @default(now())",
            "user": "User @relation(fields: [userId], references: [id])",
            "schedule": "Schedule @relation(fields: [scheduleId], references: [id])",
            "seats": "Seat[]"
        },
        "payments": {
            "id": "String @id @default(cuid())",
            "bookingId": "String",
            "xenditId": "String",
            "amount": "Float",
            "method": "String",
            "status": "String",
            "createdAt": "DateTime @default(now())",
            "booking": "Booking @relation(fields: [bookingId], references: [id])"
        }
    },
    "apiEndpoints": {
        "auth": {
            "/api/auth/register": "POST - User registration",
            "/api/auth/login": "POST - User login",
            "/api/auth/logout": "POST - User logout",
            "/api/auth/session": "GET - Current session"
        },
        "search": {
            "/api/search/routes": "GET - Search available routes",
            "/api/search/schedules": "GET - Get schedules for route"
        },
        "booking": {
            "/api/booking/create": "POST - Create new booking",
            "/api/booking/:id": "GET - Get booking details",
            "/api/booking/:id/cancel": "POST - Cancel booking"
        },
        "payment": {
            "/api/payment/create": "POST - Create payment intent",
            "/api/payment/webhook": "POST - Xendit payment webhook"
        },
        "user": {
            "/api/user/profile": "GET - User profile",
            "/api/user/bookings": "GET - User booking history"
        }
    },
    "securityConsiderations": {
        "authentication": "NextAuth.js with secure session management",
        "dataValidation": "Zod schema validation for all inputs",
        "paymentSecurity": "Xendit handles PCI compliance",
        "sqlInjection": "Prevented by Prisma ORM",
        "xss": "React DOM sanitization",
        "csrf": "Next.js built-in protection",
        "rateLimiting": "Implement on sensitive endpoints"
    },
    "environmentVariables": {
        "DATABASE_URL": "Neon PostgreSQL connection string",
        "NEXTAUTH_SECRET": "NextAuth.js secret key",
        "NEXTAUTH_URL": "Deployment URL",
        "XENDIT_SECRET_KEY": "Xendit API secret key",
        "XENDIT_CALLBACK_TOKEN": "Xendit webhook verification token",
        "EMAIL_SERVER": "Email service configuration",
        "GOOGLE_CLIENT_ID": "Google OAuth client ID",
        "GOOGLE_CLIENT_SECRET": "Google OAuth client secret"
    },
    "deploymentConfiguration": {
        "buildCommand": "next build",
        "outputDirectory": ".next",
        "installCommand": "npm install",
        "environmentVariables": "Set in Vercel dashboard",
        "database": "Neon with connection pooling",
        "cronJobs": "For cleanup tasks and notifications"
    }
}