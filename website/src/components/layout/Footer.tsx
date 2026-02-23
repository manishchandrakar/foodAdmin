import { Link } from "react-router-dom";
import { GiStrawberry } from "react-icons/gi";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <GiStrawberry size={26} className="text-themeColorLight" />
              <span>FreshFruits</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              India's trusted online fruit store delivering farm-fresh goodness
              right to your doorstep. Quality, freshness, and happiness
              guaranteed.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-themeColor transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Shop All Fruits", to: "/shop" },
                { label: "Deals & Offers", to: "/shop?deals=true" },
                { label: "My Orders", to: "/orders" },
                { label: "My Profile", to: "/profile" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-themeColorLight transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Tropical Fruits",
                "Citrus Fruits",
                "Berries",
                "Seasonal Fruits",
                "Exotic Fruits",
                "Dry Fruits",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat.split(" ")[0]}`}
                    className="hover:text-themeColorLight transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin
                  size={15}
                  className="text-themeColorLight mt-0.5 shrink-0"
                />
                <span>
                  123 Fresh Market, Farmers Lane, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={15} className="text-themeColorLight shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-themeColorLight transition"
                >
                  +91 98765 43210
                </a>
              </li>

              <li className="flex items-center gap-2">
                <FiMail size={15} className="text-themeColorLight shrink-0" />
                <a
                  href="mailto:support@freshfruits.in"
                  className="hover:text-themeColorLight transition"
                >
                  support@freshfruits.in
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
              <p className="text-green-400 font-medium mb-1">Delivery Hours</p>
              <p>Mon–Sat: 7:00 AM – 9:00 PM</p>
              <p>Sunday: 8:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 FreshFruits. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
