'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import { getDiscountPercent } from '@/utils/priceUtils'
import ProductCard from '@/components/shop/ProductCard'
import CustomSingleSelectInput from '@/components/custom/CustomSingleSelectInput'
import EmptyState from '@/components/common/EmptyState'
import ShopPageSkeleton from '@/components/skeletons/ShopPageSkeleton'
import type { ISelectDropdownOptions } from '@/types/common'

const sortOptions: ISelectDropdownOptions[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rating', value: 'rating' },
  { label: 'Max Discount', value: 'discount' },
]

const ShopPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSearch = searchParams?.get('search') ?? ''
  const urlCategoryId = searchParams?.get('categoryId')
  const urlDeals = searchParams?.get('deals') === 'true'

  const [search, setSearch] = useState(urlSearch)
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    urlCategoryId ? [parseInt(urlCategoryId)] : []
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOption, setSortOption] = useState<ISelectDropdownOptions | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [onlyDeals, setOnlyDeals] = useState(urlDeals)

  const { data: allProducts = [], isLoading: productsLoading } = useProducts()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  const filteredProducts = useMemo(() => {
    let list = [...allProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    if (selectedCategories.length > 0) {
      list = list.filter(p => p.categoryId && selectedCategories.includes(p.categoryId))
    }

    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (onlyDeals) {
      list = list.filter(p => p.mrp && p.mrp > p.price)
    }

    const sort = sortOption?.value ?? 'newest'
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    else if (sort === 'discount') {
      list.sort((a, b) => getDiscountPercent(b.price, b.mrp) - getDiscountPercent(a.price, a.mrp))
    }

    return list
  }, [allProducts, search, selectedCategories, priceRange, sortOption, onlyDeals])

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  if (productsLoading || categoriesLoading) {
    return <ShopPageSkeleton />
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSortOption(null)
    setOnlyDeals(false)
  }

  const hasFilters =
    search || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || onlyDeals

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {onlyDeals ? '🎉 Deals & Offers' : 'All Fruits'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredProducts.length} products found</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 sm:px-3 py-2 bg-white flex-1 sm:flex-initial">
            <FiSearch size={16} className="text-gray-400 shrink-0" />
            <input
              className="outline-none text-sm w-full sm:w-40 md:w-56 text-gray-700"
              placeholder="Search fruits..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="w-44 hidden sm:block">
            <CustomSingleSelectInput
              label=""
              options={sortOptions}
              placeholder="Sort by"
              value={sortOption}
              height={38}
              onChange={v => setSortOption(v)}
            />
          </div>

          {/* View mode */}
          <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-themeColor text-white' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-themeColor text-white' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </button>
          </div>

          {/* Filter Toggle (mobile) */}
          <button
            className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-themeColor hover:text-themeColor"
            onClick={() => setShowFilters(v => !v)}
          >
            <FiFilter size={15} /> Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-themeColor" />}
          </button>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6">
        {/* ── Sidebar Filters ─────────────────────────────────────────────── */}
        <aside
          className={`shrink-0 w-60 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit sticky top-24 transition-all
            ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            {hasFilters && (
              <button className="text-xs text-red-500 flex items-center gap-1" onClick={clearFilters}>
                <FiX size={12} /> Clear All
              </button>
            )}
          </div>

          {/* Deals Toggle */}
          <div className="mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={e => setOnlyDeals(e.target.checked)}
                className="w-4 h-4 accent-themeColor"
              />
              <span className="text-sm font-medium text-gray-700">Deals Only</span>
            </label>
          </div>

          {/* Categories */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 accent-themeColor"
                  />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    ({allProducts.filter(p => p.categoryId === cat.id).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}
            </h4>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceRange[1]}
              className="w-full accent-themeColor"
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹0</span><span>₹1000</span>
            </div>
          </div>

          {/* Sort (mobile) */}
          <div className="sm:hidden">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h4>
            <CustomSingleSelectInput
              label=""
              options={sortOptions}
              placeholder="Sort by"
              value={sortOption}
              height={38}
              onChange={v => setSortOption(v)}
            />
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={<p className="text-4xl">🍒</p>}
              title="No fruits found"
              description="Try adjusting your filters or search term"
              actionLabel="Clear all filters"
              onAction={clearFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex gap-3 sm:gap-4 p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.image ?? ''}
                    alt={product.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-xs text-gray-400">{product.category?.name} · per {product.unit?.symbol}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-lg font-bold text-themeColor">₹{product.price}</p>
                        {product.mrp && <p className="text-sm text-gray-400 line-through">₹{product.mrp}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopPage
