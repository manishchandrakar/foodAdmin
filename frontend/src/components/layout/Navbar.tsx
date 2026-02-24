import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Badge } from '@heroui/react'
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi'
import { GiStrawberry } from 'react-icons/gi'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CustomButton from '@/components/custom/CustomButton'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/shop' },
  { label: 'Deals', path: '/shop?deals=true' },
]

const Navbar = () => {
  const { totalItems } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-themeColor text-white text-xs text-center py-1.5 px-4">
        Free delivery on orders above ₹499 &nbsp;|&nbsp; Use code <strong>FRESH10</strong> for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-themeColor font-bold text-xl">
            <GiStrawberry size={28} />
            <span>FreshFruits</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-themeColor ${
                  isActive(link.path) ? 'text-themeColor border-b-2 border-themeColor pb-1' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              className="p-2 text-gray-600 hover:text-themeColor transition-colors"
              onClick={() => setSearchOpen(v => !v)}
            >
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-themeColor transition-colors">
              <Badge color="danger" content={totalItems > 0 ? totalItems : undefined} size="sm">
                <FiShoppingCart size={20} />
              </Badge>
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-themeColor transition-colors"
                  onClick={() => setProfileOpen(v => !v)}
                >
                  <div className="w-8 h-8 rounded-full bg-themeColor text-white flex items-center justify-center text-sm font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-themeColor"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiUser size={15} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-themeColor"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiPackage size={15} /> My Orders
                    </Link>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      onClick={() => { logout(); setProfileOpen(false) }}
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <CustomButton
                text="Login"
                className="h-8 text-sm px-4"
                onPress={() => navigate('/login')}
              />
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-themeColor"
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <div className="flex gap-2">
              <input
                autoFocus
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-themeColor"
                placeholder="Search fruits, categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <CustomButton text="Search" type="submit" className="px-4" />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.path}
              className="block py-2 text-sm text-gray-600 hover:text-themeColor font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <Link to="/login" className="block py-2 text-sm text-themeColor font-medium" onClick={() => setMenuOpen(false)}>
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
