import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { IProduct, ICartItemLocal } from '@/types'
import { validateCoupon, getDiscountPercent } from '@/data/dummy'
import { toast } from '@/utils/toast'

interface ICartContext {
  items: ICartItemLocal[]
  couponCode: string
  couponDiscount: number
  totalItems: number
  subtotal: number
  discountAmount: number
  total: number
  addToCart: (product: IProduct, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
}

const CartContext = createContext<ICartContext | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ICartItemLocal[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const discountAmount = Math.round((subtotal * couponDiscount) / 100)

  const total = subtotal - discountAmount

  const addToCart = useCallback((product: IProduct, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        toast.info(`${product.name} quantity updated`)
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      toast.success(`${product.name} added to cart!`)
      return [
        ...prev,
        {
          product,
          quantity,
          unitId: product.unitId ?? 1,
          unitSymbol: product.unit?.symbol ?? 'kg',
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
    toast.info('Item removed from cart')
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode('')
    setCouponDiscount(0)
  }, [])

  const applyCoupon = useCallback((code: string): boolean => {
    const coupon = validateCoupon(code)
    if (!coupon) {
      toast.error('Invalid or expired coupon code')
      return false
    }
    setCouponCode(coupon.code)
    setCouponDiscount(coupon.discountPercent)
    toast.success(`Coupon applied! ${coupon.discountPercent}% discount`)
    return true
  }, [])

  const removeCoupon = useCallback(() => {
    setCouponCode('')
    setCouponDiscount(0)
    toast.info('Coupon removed')
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        couponCode,
        couponDiscount,
        totalItems,
        subtotal,
        discountAmount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export { getDiscountPercent }
