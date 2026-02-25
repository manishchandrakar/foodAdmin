'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import { GiOrange, GiStrawberry, GiBanana } from 'react-icons/gi'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import { getDiscountPercent } from '@/utils/priceUtils'
import ProductCard from '@/components/shop/ProductCard'
import CustomButton from '@/components/custom/CustomButton'
import SectionHeader from '@/components/common/SectionHeader'
import FilterPills from '@/components/common/FilterPills'
import HomePageSkeleton from '@/components/skeletons/HomePageSkeleton'
import { features } from '@/utils/constant'

const testimonials = [
  { id: 1, name: 'Ananya Sharma', rating: 5, comment: 'Freshest fruits I have ever ordered online! Delivery was super fast and packaging was excellent.' },
  { id: 2, name: 'Rahul Mehra', rating: 5, comment: 'Amazing quality mangoes! Exactly like what you get at the local farm. Will definitely order again.' },
  { id: 3, name: 'Priya Patel', rating: 4, comment: 'Great variety and reasonable prices. The strawberries were perfectly ripe and sweet.' },
]



const HomePage = () => {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const { data: products = [], isLoading: productsLoading } = useProducts()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  const featuredProducts = products.slice(0, 6)
  const dealProducts = products.filter(p => p.mrp && p.mrp > p.price).slice(0, 6)
  const filteredProducts = activeCategory
    ? products.filter(p => p.categoryId === activeCategory).slice(0, 8)
    : products.slice(0, 8)

  if (productsLoading || categoriesLoading) {
    return <HomePageSkeleton />
  }

  const categoryPillOptions = [
    { label: 'All', value: 'all' },
    ...categories.map(cat => ({ label: cat.name, value: String(cat.id) })),
  ]

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-linear-to-br from-green-50 via-emerald-50 to-lime-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-green-100 text-themeColor text-sm font-semibold px-3 py-1 rounded-full mb-4">
                🌿 100% Farm Fresh
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                Fresh Fruits
                <span className="text-themeColor block">Delivered Daily</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Order premium quality fruits directly from farms. Same-day delivery across major cities. Taste the freshness in every bite.
              </p>
              <div className="flex flex-wrap gap-3">
                <CustomButton
                  text={<span className="flex items-center gap-2">Shop Now <FiArrowRight /></span>}
                  className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  onPress={() => router.push('/shop')}
                />
                <CustomButton
                  text="View Deals"
                  variant="bordered"
                  className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-themeColor border-themeColor"
                  onPress={() => router.push('/shop?deals=true')}
                />
              </div>
              {/* Stats */}
              <div className="flex gap-4 sm:gap-8 mt-8 sm:mt-10">
                {[['500+', 'Happy Customers'], ['50+', 'Fruit Varieties'], ['4.8★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-xl sm:text-2xl font-bold text-themeColor">{val}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2 sm:gap-3 py-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white sm:hidden" />
                  <Icon size={18} className="text-white hidden sm:block" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xs sm:text-sm">{title}</p>
                  <p className="text-green-100 text-[10px] sm:text-xs hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <SectionHeader
          title="Shop by Category"
          subtitle="Explore our wide range of fruit categories"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              className="group flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-themeColor hover:shadow-md transition-all"
              onClick={() => router.push(`/shop?categoryId=${cat.id}`)}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-themeColor transition-colors">
                <img
                  src={cat.image ?? ''}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-themeColor text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Fruits"
            subtitle="Our most popular picks just for you"
            linkText="View All"
            onLinkClick={() => router.push('/shop')}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals & Offers ───────────────────────────────────────────────── */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
          <SectionHeader
            title="Best Deals Today"
            subtitle="Limited time offers — grab them fast!"
            linkText="See All Deals"
            onLinkClick={() => router.push('/shop?deals=true')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {dealProducts.map(product => {
              const discount = getDiscountPercent(product.price, product.mrp)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.image ?? ''}
                    alt={product.name}
                    className="w-18 h-18 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-400">per {product.unit?.symbol}</p>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <span className="text-base sm:text-lg font-bold text-themeColor">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.mrp}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── All Products with Category Filter ───────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">All Fruits</h2>

            <CustomButton
              text={<span className="flex items-center gap-2">  View All </span>}
              variant="bordered"
              className="px-4 sm:px-8 text-sm sm:text-base border-themeColor text-themeColor"
              rightIcon={<FiArrowRight />}
              onPress={() => router.push('/shop')}
            />

          </div>

          {/* Category Filter Pills */}
          <FilterPills
            options={categoryPillOptions}
            activeValue={activeCategory === null ? 'all' : String(activeCategory)}
            onChange={(value) => setActiveCategory(value === 'all' ? null : Number(value))}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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
              onPress={() => router.push('/shop')}
            />
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-themeColor to-themeColorDark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center relative overflow-hidden">
          <GiStrawberry size={120} className="absolute -right-6 -top-6 opacity-10 hidden sm:block" />
          <GiOrange size={100} className="absolute -left-4 -bottom-4 opacity-10 hidden sm:block" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">Get 15% Off Your First Order!</h2>
          <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-lg">Use code <strong className="bg-white/20 px-2 py-0.5 rounded">WELCOME15</strong> at checkout</p>
          <CustomButton
            text="Shop Now & Save"
            className="bg-white text-themeColor hover:bg-green-50 px-8 py-3 font-bold text-base"
            onPress={() => router.push('/shop')}
          />
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Our Customers Say"
            subtitle="Thousands of happy customers love FreshFruits"
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="fill-yellow-400 text-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-themeColor text-white flex items-center justify-center font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
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
