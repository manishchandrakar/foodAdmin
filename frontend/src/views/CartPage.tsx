'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiShoppingBag, FiTag, FiX, FiArrowRight } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useValidateCoupon } from '@/lib/hooks/useCoupons'
import CustomButton from '@/components/custom/CustomButton'
import CustomInput from '@/components/custom/CustomInput'
import EmptyState from '@/components/common/EmptyState'

const CartPage = () => {
  const router = useRouter()
  const {
    items,
    couponCode,
    couponDiscount,
    totalItems,
    subtotal,
    discountAmount,
    total,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const validateCoupon = useValidateCoupon()
  const [couponInput, setCouponInput] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    try {
      const result = await validateCoupon.mutateAsync(couponInput.trim().toUpperCase())
      if (result.valid) {
        applyCoupon(result.code, result.discountPercent)
        setCouponInput('')
      }
    } catch {
      // error handled in useValidateCoupon onError
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={<p className="text-7xl">🛒</p>}
          title="Your cart is empty"
          description="Add some fresh fruits to get started!"
          actionLabel="Browse Fruits"
          onAction={() => router.push('/shop')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Shopping Cart <span className="text-gray-400 text-sm sm:text-base font-normal">({totalItems} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* ── Cart Items ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-start"
            >
              {/* Product Image */}
              <img
                src={item.product.image ?? ''}
                alt={item.product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                onClick={() => router.push(`/product/${item.product.id}`)}
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className="font-semibold text-sm sm:text-base text-gray-800 hover:text-themeColor cursor-pointer"
                      onClick={() => router.push(`/product/${item.product.id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.product.category?.name} · per {item.unitSymbol}
                    </p>
                  </div>
                  <CustomButton
                    text=""
                    variant="light"
                    color="danger"
                    className="min-w-0 w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                    leftIcon={<FiTrash2 size={17} />}
                    onPress={() => removeFromCart(item.product.id)}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <CustomButton
                      text="−"
                      variant="light"
                      className="min-w-0 w-8 h-8 p-0 rounded-none text-gray-600 text-lg"
                      isDisabled={item.quantity <= 1}
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                    />
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <CustomButton
                      text="+"
                      variant="light"
                      className="min-w-0 w-8 h-8 p-0 rounded-none text-gray-600 text-lg"
                      isDisabled={item.quantity >= item.product.stock}
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                    />
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-themeColor text-base sm:text-lg">
                      ₹{(item.product.price * item.quantity).toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">₹{item.product.price} × {item.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <CustomButton
            text="← Continue Shopping"
            variant="light"
            className="text-themeColor text-sm px-0 h-auto"
            onPress={() => router.push('/shop')}
          />
        </div>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <FiTag size={15} className="text-themeColor" />
                    <div>
                      <p className="text-sm font-semibold text-themeColor">{couponCode}</p>
                      <p className="text-xs text-green-600">{couponDiscount}% discount applied!</p>
                    </div>
                  </div>
                  <CustomButton
                    text=""
                    variant="light"
                    color="danger"
                    className="min-w-0 w-7 h-7 p-0 text-gray-400 hover:text-red-500"
                    leftIcon={<FiX size={16} />}
                    onPress={removeCoupon}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Have a coupon?</p>
                  <div className="flex gap-2">
                    <CustomInput
                      placeholder="Enter coupon code"
                      value={couponInput}
                      className="flex-1"
                      onValueChange={setCouponInput}
                    />
                    <CustomButton
                      text="Apply"
                      className="px-3 shrink-0"
                      isLoading={validateCoupon.isPending}
                      isDisabled={!couponInput.trim()}
                      onPress={handleApplyCoupon}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Try: FRESH10, FRUIT20, WELCOME15</p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({couponDiscount}%)</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={subtotal >= 499 ? 'text-green-600 font-medium' : ''}>
                  {subtotal >= 499 ? 'FREE' : '₹49'}
                </span>
              </div>
              {subtotal < 499 && (
                <p className="text-xs text-orange-500">
                  Add ₹{(499 - subtotal).toFixed(0)} more for free delivery!
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4 mb-5">
              <span>Total</span>
              <span className="text-themeColor text-xl">
                ₹{(total + (subtotal >= 499 ? 0 : 49)).toFixed(0)}
              </span>
            </div>

            <CustomButton
              text={<span className="flex items-center gap-2 justify-center w-full">Proceed to Checkout <FiArrowRight /></span>}
              className="w-full py-3"
              onPress={() => router.push('/checkout')}
            />

            {/* Payment methods icons */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 mb-2">Secure payment via</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {['UPI', 'Cards', 'Net Banking', 'COD'].map(m => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
