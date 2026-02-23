import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi'
import { GiOrange, GiStrawberry, GiBanana } from 'react-icons/gi'
import { categories, featuredProducts, dealProducts, products, users } from '@/data/dummy'
import ProductCard from '@/components/shop/ProductCard'
import CustomButton from '@/components/custom/CustomButton'
import { getDiscountPercent } from '@/data/dummy'

const testimonials = [
  { id: 1, user: users[0], rating: 5, comment: 'Freshest fruits I have ever ordered online! Delivery was super fast and packaging was excellent.' },
  { id: 2, user: users[1], rating: 5, comment: 'Amazing quality mangoes! Exactly like what you get at the local farm. Will definitely order again.' },
  { id: 3, user: users[2], rating: 4, comment: 'Great variety and reasonable prices. The strawberries were perfectly ripe and sweet.' },
]

const features = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: FiShield, title: 'Quality Assured', desc: 'Farm-fresh guarantee' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '24-hour return policy' },
  { icon: FiStar, title: 'Best Prices', desc: 'Direct from farmers' },
]

const HomePage = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const filteredProducts = activeCategory
    ? products.filter(p => p.categoryId === activeCategory).slice(0, 8)
    : products.slice(0, 8)

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-linear-to-br from-green-50 via-emerald-50 to-lime-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-green-100 text-themeColor text-sm font-semibold px-3 py-1 rounded-full mb-4">
                🌿 100% Farm Fresh
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                Fresh Fruits
                <span className="text-themeColor block">Delivered Daily</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Order premium quality fruits directly from farms. Same-day delivery across major cities. Taste the freshness in every bite.
              </p>
              <div className="flex flex-wrap gap-3">
                <CustomButton
                  text={<span className="flex items-center gap-2">Shop Now <FiArrowRight /></span>}
                  className="px-8 py-3 text-base"
                  onPress={() => navigate('/shop')}
                />
                <CustomButton
                  text="View Deals"
                  variant="bordered"
                  className="px-8 py-3 text-base text-themeColor border-themeColor"
                  onPress={() => navigate('/shop?deals=true')}
                />
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[['500+', 'Happy Customers'], ['50+', 'Fruit Varieties'], ['4.8★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-themeColor">{val}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative hidden md:grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80"
                  alt="Mango"
                  className="rounded-2xl w-full h-44 object-cover shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&q=80"
                  alt="Fruits"
                  className="rounded-2xl w-full h-36 object-cover shadow-md"
                />
              </div>
              <div className="space-y-3 pt-6">
                <img
                  src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80"
                  alt="Strawberries"
                  className="rounded-2xl w-full h-36 object-cover shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80"
                  alt="Bananas"
                  className="rounded-2xl w-full h-44 object-cover shadow-md"
                />
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-2 border border-green-100">
                <GiStrawberry size={20} className="text-red-500" />
                <span className="text-sm font-semibold text-gray-700">16+ Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative icons */}
        <GiOrange size={60} className="absolute top-10 right-10 text-orange-200 opacity-40 rotate-12" />
        <GiBanana size={50} className="absolute bottom-10 left-8 text-yellow-200 opacity-40 -rotate-12" />
      </section>

      {/* ── Features Bar ─────────────────────────────────────────────────── */}
      <section className="bg-themeColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-green-100 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Explore our wide range of fruit categories</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-themeColor hover:shadow-md transition-all"
              onClick={() => navigate(`/shop?categoryId=${cat.id}`)}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-themeColor transition-colors">
                <img
                  src={cat.image ?? ''}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-themeColor text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Fruits</h2>
              <p className="text-gray-500 text-sm mt-1">Our most popular picks just for you</p>
            </div>
            <button
              className="text-themeColor text-sm font-medium flex items-center gap-1 hover:underline"
              onClick={() => navigate('/shop')}
            >
              View All <FiArrowRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals & Offers ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Best Deals Today</h2>
            <p className="text-gray-500 text-sm mt-1">Limited time offers — grab them fast!</p>
          </div>

          {/* <CustomButton /> */}
          <button
            className="text-themeColor text-sm font-medium flex items-center gap-1 hover:underline"
            onClick={() => navigate('/shop?deals=true')}
          >
            See All Deals <FiArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dealProducts.map(product => {
            const discount = getDiscountPercent(product.price, product.mrp)
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex gap-4 p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image ?? ''}
                  alt={product.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full">
                    {discount}% OFF
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-1 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-400">per {product.unit?.symbol}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-themeColor">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── All Products with Category Filter ───────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">All Fruits</h2>
            <button
              className="text-themeColor text-sm font-medium flex items-center gap-1 hover:underline"
              onClick={() => navigate('/shop')}
            >
              View All <FiArrowRight size={15} />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === null
                  ? 'bg-themeColor text-white border-themeColor'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-themeColor hover:text-themeColor'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-themeColor text-white border-themeColor'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-themeColor hover:text-themeColor'
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">No products found in this category.</div>
          )}

          <div className="text-center mt-8">
            <CustomButton
              text={<span className="flex items-center gap-2">Browse All Products <FiArrowRight /></span>}
              variant="bordered"
              className="px-8 border-themeColor text-themeColor"
              onPress={() => navigate('/shop')}
            />
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-themeColor to-themeColorDark rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <GiStrawberry size={120} className="absolute -right-6 -top-6 opacity-10" />
          <GiOrange size={100} className="absolute -left-4 -bottom-4 opacity-10" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Get 15% Off Your First Order!</h2>
          <p className="text-green-100 mb-6 text-lg">Use code <strong className="bg-white/20 px-2 py-0.5 rounded">WELCOME15</strong> at checkout</p>
          <CustomButton
            text="Shop Now & Save"
            className="bg-white text-themeColor hover:bg-green-50 px-8 py-3 font-bold text-base"
            onPress={() => navigate('/shop')}
          />
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What Our Customers Say</h2>
            <p className="text-gray-500 text-sm mt-2">Thousands of happy customers love FreshFruits</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="fill-yellow-400 text-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-themeColor text-white flex items-center justify-center font-semibold text-sm">
                    {t.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.user.name}</p>
                    <p className="text-xs text-gray-400">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
