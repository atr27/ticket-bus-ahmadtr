import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers/session-provider'
import { Header } from '@/components/layout/header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Monaco", "Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "Ticket Bus - Bus Ticket Booking",
  description: "Book bus tickets online with ease. Find and compare bus routes across Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-12 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Ticket Bus</h3>
                    <p className="text-gray-300">Your trusted partner for bus ticket booking across Indonesia.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Services</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>Bus Booking</li>
                      <li>Route Information</li>
                      <li>Real-time Tracking</li>
                      <li>Customer Support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>About Us</li>
                      <li>Contact</li>
                      <li>Privacy Policy</li>
                      <li>Terms of Service</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Contact</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>support@ticketbus.id</li>
                      <li>+62 800 123 4567</li>
                      <li>Jakarta, Indonesia</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                  <p>© 2023 Ticket Bus. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
