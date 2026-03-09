import { Coffee, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F] border-t border-[#C9A227]/20 mt-20">
      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">

            <div className="flex items-center gap-3 mb-4">

              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E6C75A] shadow-md">
                <Coffee className="w-7 h-7 text-black" />
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#C9A227] tracking-tight">
                  The Coffee Nest
                </span>
                <span className="text-xs text-[#AFAFAF] tracking-wider uppercase">
                  Scan & Sip
                </span>
              </div>

            </div>

            <p className="text-[#AFAFAF] leading-relaxed mb-6 max-w-md">
              Experience the finest selection of artisanal coffees, gourmet pizzas, and premium burgers.
              Crafted with passion, served with excellence.
            </p>

            {/* Social */}
            <div className="flex gap-4">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>

            </div>

          </div>


          {/* Quick Links */}
          <div>

            <h3 className="text-[#C9A227] font-bold text-lg mb-4 uppercase tracking-wide">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <Link to="/" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/order-history" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                  Order History
                </Link>
              </li>

              <li>
                <Link to="/order-tracking" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                  Track Order
                </Link>
              </li>

              <li>
                <Link to="/cart" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                  Cart
                </Link>
              </li>

            </ul>

          </div>


          {/* Contact */}
          <div>

            <h3 className="text-[#C9A227] font-bold text-lg mb-4 uppercase tracking-wide">
              Contact
            </h3>

            <ul className="space-y-3">

              <li className="flex items-start gap-3 text-[#AFAFAF]">
                <MapPin className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span>123 Coffee Street, Brew City</span>
              </li>

              <li className="flex items-center gap-3 text-[#AFAFAF]">
                <Phone className="w-5 h-5 text-[#C9A227]" />
                <span>+91 123 456 7890</span>
              </li>

              <li className="flex items-center gap-3 text-[#AFAFAF]">
                <Mail className="w-5 h-5 text-[#C9A227]" />
                <span>info@TheCoffeeNest.com</span>
              </li>

            </ul>

          </div>

        </div>


        {/* Bottom Bar */}

        <div className="border-t border-[#C9A227]/20 mt-12 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-[#AFAFAF] text-sm">
              © 2024 CaféDelight. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">

              <a href="#" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                Privacy Policy
              </a>

              <a href="#" className="text-[#AFAFAF] hover:text-[#C9A227] transition-colors">
                Terms of Service
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
};