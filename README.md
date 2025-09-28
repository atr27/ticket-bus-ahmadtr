# Ticket Bus

A comprehensive bus ticket booking platform built with Next.js, Prisma, and modern web technologies. This project replicates the core functionality of bus booking platforms with features like bus search, seat selection, booking management, and payment processing.

## 🚀 Features

### Core Functionality
- **Bus Search & Booking**: Search for buses by route, date, and passenger count
- **Interactive Seat Selection**: Visual seat map with real-time availability
- **User Authentication**: Email/password login
- **Payment Integration**: Multiple payment methods via Xendit
- **Enhanced Booking Management**: View and manage all bookings with improved UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Features
- **Modern Stack**: Next.js 14+, TypeScript, Prisma ORM
- **Database**: PostgreSQL with Neon hosting
- **Authentication**: NextAuth.js with multiple providers
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Zustand for client-side state

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment**: Xendit integration

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd redbus-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-neon-postgresql-url"
   
   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   
   # Xendit (for payments)
   XENDIT_SECRET_KEY="your-xendit-secret-key"
   XENDIT_WEBHOOK_TOKEN="your-xendit-webhook-token"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses a simplified but comprehensive database schema:

- **Users**: Authentication and user profiles
- **Buses**: Bus information and amenities
- **Routes**: Origin and destination pairs
- **Schedules**: Bus schedules with timing and pricing
- **Seats**: Individual seat information
- **Bookings**: User reservations with passenger details
- **Payments**: Payment processing records

## 🔐 Authentication

The app supports secure authentication:

- **Email/Password**: Traditional registration and login
- **Session Management**: Secure JWT-based sessions

### Test Account
After seeding the database, you can use:
- **Email**: test@example.com
- **Password**: password123

## 💳 Payment Integration

Payment processing is handled through Xendit, supporting:
- Credit/Debit Cards (Visa, Mastercard, JCB)
- E-wallets (GoPay, OVO, DANA)
- Bank Transfer (BCA, Mandiri, BNI, BRI)

### How It Works

1. Users create a booking and are redirected to the payment page
2. The system creates a booking in the database
3. ## Payment Integration

The application integrates with Xendit for payment processing:

1. Users are redirected to Xendit's secure payment page
2. After payment, users are redirected back to the application
3. Webhooks handle payment status updates in real-time
4. Payment status transitions:
   - PENDING: Initial state when payment is created
   - PAID: Successful payment completion
   - FAILED: Payment failed or expired
   - REFUNDED: Payment was refunded
5. Users are redirected back to success/failure pages

### Configuration

To enable payments, you need to:
{{ ... }}
2. Obtain your secret API key from the dashboard
3. Set the following environment variables:
   ```
   XENDIT_SECRET_KEY=your_xendit_secret_key
   XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
4. Configure the webhook URL in Xendit dashboard:
   `https://yourdomain.com/api/payment/webhook`

For detailed integration documentation, see [XENDIT_INTEGRATION.md](XENDIT_INTEGRATION.md).

For testing instructions, see [XENDIT_TESTING.md](XENDIT_TESTING.md).

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/session` - Current session

### Search
- `GET /api/search/routes` - Search available routes
- `GET /api/search/schedules` - Get schedules for route

### Booking
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/[id]` - Get booking details
- `POST /api/booking/[id]/cancel` - Cancel booking

### Payment
- `POST /api/payment/create` - Create Xendit invoice for booking
- `POST /api/payment/webhook` - Receive payment status updates from Xendit
- `GET /payment/success` - Payment success page
- `GET /payment/failed` - Payment failure page

### User
- `GET /api/user/profile` - User profile
- `GET /api/user/bookings` - User booking history

### Bookings (New)
- `GET /bookings` - View all user bookings (new page)
- `GET /booking/[id]` - View individual booking details
- `GET /my-tickets` - Redirects to `/bookings`
- `GET /my-tickets/[id]` - Redirects to `/booking/[id]`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── (auth)/         # Authentication pages
│   ├── api/            # API routes
│   ├── booking/        # Booking flow pages
│   └── search/         # Search results
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── search/        # Search-related components
│   └── booking/       # Booking-related components
├── lib/               # Utility functions and configurations
└── store/             # State management
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Xendit](https://xendit.co/) for payment processing

## 📞 Support

If you have any questions or need help with setup, please open an issue in the repository.

---

**Happy coding! 🚌✨**
