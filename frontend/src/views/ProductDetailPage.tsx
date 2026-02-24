'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiArrowLeft, FiShare2, FiTruck, FiShield } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { useProduct, useProducts } from '@/lib/hooks/useProducts'
import { useProductReviews } from '@/lib/hooks/useReviews'
import { getDiscountPercent } from '@/utils/priceUtils'
import { useCart } from '@/context/CartContext'
import CustomButton from '@/components/custom/CustomButton'
import CustomStar from '@/components/custom/CustomStar'
import ProductCard from '@/components/shop/ProductCard'
import { modal } from '@/utils/modal'

const ProductDetailPage = () => {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { addToCart } = useCart()

  const { data: product, isLoading: productLoading } = useProduct(id)
  const { data: productReviews = [] } = useProductReviews(product?.id ?? 0)
  const { data: allProducts = [] } = useProducts()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc')

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading product...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🍃</p>
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <CustomButton text="Back to Shop" className="mt-4" onPress={() => router.push('/shop')} />
      </div>
    )
  }

  const discount = getDiscountPercent(product.price, product.mrp)
  const relatedProducts = allProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push('/cart')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    modal.success('Link copied to clipboard!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-themeColor mb-6 transition-colors"
        onClick={() => router.back()}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      {/* ── Product Main Section ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden bg-gray-50 aspect-square">
            <img
              src={product.image ?? ''}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-themeColor"
            onClick={handleShare}
          >
            <FiShare2 size={18} />
          </button>
        </div>

        {/* Info */}
        <div>
          {/* Category & Status */}
          <div className="flex items-center gap-2 mb-2">
            {product.category && (
              <span className="text-xs bg-green-100 text-themeColor font-medium px-2.5 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            {product.status === 'active' && product.stock > 0 ? (
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">In Stock</span>
            ) : (
              <span className="text-xs bg-red-50 text-red-500 font-medium px-2.5 py-1 rounded-full">Out of Stock</span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Rating */}
          {product.avgRating !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <CustomStar rating={product.avgRating} />
              <span className="text-sm text-gray-600">
                {product.avgRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mb-5">
            <span className="text-4xl font-extrabold text-themeColor">₹{product.price}</span>
            {product.unit && <span className="text-gray-400 text-lg mb-1">/ {product.unit.symbol}</span>}
            {product.mrp && product.mrp > product.price && (
              <span className="text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
            )}
            {discount > 0 && (
              <span className="text-green-600 font-semibold text-lg mb-1">Save ₹{(product.mrp! - product.price).toFixed(0)}</span>
            )}
          </div>

          {/* GST info */}
          {product.gstRate && product.gstRate.percentage > 0 && (
            <p className="text-xs text-gray-400 mb-4">
              + {product.gstRate.name} ({product.gstRate.percentage}%) applicable
            </p>
          )}

          {/* Stock */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Stock availability</span>
              <span className={product.stock <= 10 ? 'text-orange-500 font-medium' : 'text-gray-600'}>
                {product.stock} units left
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${product.stock > 50 ? 'bg-themeColor' : product.stock > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              Total: <strong className="text-themeColor">₹{(product.price * quantity).toFixed(0)}</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <CustomButton
              text={<span className="flex items-center gap-2"><FiShoppingCart size={16} /> Add to Cart</span>}
              variant="bordered"
              className="flex-1 border-themeColor text-themeColor"
              isDisabled={product.stock === 0}
              onPress={handleAddToCart}
            />
            <CustomButton
              text="Buy Now"
              className="flex-1"
              isDisabled={product.stock === 0}
              onPress={handleBuyNow}
            />
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FiTruck, label: 'Free Delivery', sub: 'On orders above ₹499' },
              { icon: FiShield, label: 'Quality Assured', sub: 'Farm-fresh guarantee' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                <Icon size={18} className="text-themeColor shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description & Reviews ──────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'desc', label: 'Description' },
            { key: 'reviews', label: `Reviews (${productReviews.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-themeColor text-themeColor'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.key as 'desc' | 'reviews')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'desc' ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            {product.unit && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Unit', value: `${product.unit.name} (${product.unit.symbol})` },
                  { label: 'Category', value: product.category?.name ?? '—' },
                  { label: 'Price', value: `₹${product.price} / ${product.unit.symbol}` },
                  { label: 'Tax', value: product.gstRate?.name ?? 'GST 0%' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
                <p className="text-4xl mb-2">💬</p>
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              productReviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-themeColor text-white flex items-center justify-center font-semibold text-sm">
                        {review.user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{review.user?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < review.rating
                          ? <FaStar key={i} size={14} className="text-yellow-400" />
                          : <FaRegStar key={i} size={14} className="text-gray-300" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Related Products ──────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
