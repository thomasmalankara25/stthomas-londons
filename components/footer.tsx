import { Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#2c1810] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/images/malankara-logo.png" alt="Malankara Logo" className="h-12 w-12 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold">St. Thomas Malankara</h3>
                <p className="text-sm text-gray-300">Catholic Church</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">A community of faith, hope, and love serving the Lord together.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#d4af37]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/events" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="/news" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="/community" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#d4af37]">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-[#d4af37] p-2 rounded-full hover:bg-[#b8941f] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-[#2c1810]" />
              </a>
              <a
                href="#"
                className="bg-[#d4af37] p-2 rounded-full hover:bg-[#b8941f] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-[#2c1810]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">© 2024 St. Thomas Malankara Catholic Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
