import Link from "next/link"
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 mt-8">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4 md:mx-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold">Explore Karawang</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your ultimate guide to discovering the beauty and flavors of Karawang, West Java.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-emerald-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-emerald-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-emerald-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span>Tourism Office, Karawang, West Java, Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span>+62 123 4567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span>info@explorekarawang.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#destinations" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Tourism Destinations
                </Link>
              </li>
              <li>
                <Link href="#culinary" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Culinary Guide
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Accommodation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Transportation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Events Calendar
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 mx-4 md:mx-6">
          <p>© {new Date().getFullYear()} Explore Karawang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
