import { Coffee, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer
      className="mt-20 border-t"
      style={{ backgroundColor: '#E8E2D9', borderColor: '#C8BAA8' }}
    >
      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">

            <div className="flex items-center gap-3 mb-4">

              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ backgroundColor: '#3A6B35' }}
              >
                <Coffee className="w-7 h-7" style={{ color: '#F7F3ED' }} />
              </div>

              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                >
                  The Coffee Nest
                </span>
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: '#6B7F68' }}
                >
                  Scan & Sip
                </span>
              </div>

            </div>

            <p className="leading-relaxed mb-6 max-w-md" style={{ color: '#4A5E47' }}>
              Experience the finest selection of artisanal coffees, gourmet pizzas, and premium burgers.
              Crafted with passion, served with excellence.
            </p>

            {/* Social */}
            <div className="flex gap-3">

              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: '#D4CCC0', color: '#3A6B35' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#3A6B35';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#F7F3ED';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#D4CCC0';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#3A6B35';
                  }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3
              className="font-bold text-lg mb-4 uppercase tracking-wide"
              style={{ color: '#1C2B1A' }}
            >
              Quick Links
            </h3>

            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/order-history', label: 'Order History' },
                { to: '/order-tracking', label: 'Track Order' },
                { to: '/cart', label: 'Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors duration-200"
                    style={{ color: '#6B7F68' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#3A6B35')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7F68')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3
              className="font-bold text-lg mb-4 uppercase tracking-wide"
              style={{ color: '#1C2B1A' }}
            >
              Contact
            </h3>

            <ul className="space-y-3">

              <li className="flex items-start gap-3" style={{ color: '#4A5E47' }}>
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#3A6B35' }} />
                <span>123 Coffee Street, Brew City</span>
              </li>

              <li className="flex items-center gap-3" style={{ color: '#4A5E47' }}>
                <Phone className="w-5 h-5" style={{ color: '#3A6B35' }} />
                <span>+91 123 456 7890</span>
              </li>

              <li className="flex items-center gap-3" style={{ color: '#4A5E47' }}>
                <Mail className="w-5 h-5" style={{ color: '#3A6B35' }} />
                <span>info@TheCoffeeNest.com</span>
              </li>

            </ul>

          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className="border-t mt-12 pt-8"
          style={{ borderColor: '#C8BAA8' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-sm" style={{ color: '#6B7F68' }}>
              © 2024 The Coffee Nest. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="transition-colors duration-200"
                  style={{ color: '#6B7F68' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#3A6B35')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7F68')}
                >
                  {label}
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};