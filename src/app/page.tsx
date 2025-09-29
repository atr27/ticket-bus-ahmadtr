import BusSearchForm from '@/components/search/BusSearchForm';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Shield, Clock, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Your Ultimate <span className="text-yellow-300">Bus Journey</span> Begins Here
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-10">
              Discover seamless bus travel across Indonesia. Safe, reliable, and affordable tickets at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button className="bg-white text-red-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Book Now
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto -mb-12 relative z-10">
            <BusSearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Smart Way to Travel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enjoy a hassle-free booking experience with our trusted platform, designed for the modern traveler.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <Bus className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Extensive Network</h3>
              <p className="text-gray-600">Explore thousands of routes from hundreds of trusted operators across Indonesia.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <Shield className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Secure Payments</h3>
              <p className="text-gray-600">Book with confidence using our secure payment gateway with various options.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <Clock className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Real-Time Tracking</h3>
              <p className="text-gray-600">Stay informed with live bus tracking and real-time schedule updates.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <Users className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is here to help you around the clock.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust us for their bus journey needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">&quot;Booking bus tickets has never been easier! The interface is intuitive and the booking process is seamless. Highly recommended!&quot;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Andi Pratama</h4>
                  <p className="text-gray-600 text-sm">Jakarta</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">&quot;Great service and reliable buses. I&apos;ve been using this platform for months and never had any issues. The customer support is excellent!&quot;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sari Dewi</h4>
                  <p className="text-gray-600 text-sm">Bandung</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">&quot;The real-time tracking feature is amazing! I can see exactly where my bus is and plan my departure accordingly. Very convenient!&quot;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Budi Santoso</h4>
                  <p className="text-gray-600 text-sm">Surabaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Book your bus ticket now and experience comfortable travel across Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Book Your Ticket
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300">
              Download App
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
