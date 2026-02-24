'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheckCircle, FiMapPin, FiCreditCard, FiSmartphone, FiTruck } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { usePlaceOrder } from '@/lib/hooks/useOrders'
import CustomButton from '@/components/custom/CustomButton'
import CustomInput from '@/components/custom/CustomInput'
import { modal } from '@/utils/modal'

type PaymentMethod = 'cod' | 'upi' | 'online'
type Step = 'address' | 'payment' | 'confirm'

const paymentMethods = [
  { id: 'upi' as PaymentMethod, label: 'UPI', sub: 'PhonePe, GPay, Paytm', icon: FiSmartphone },
  { id: 'online' as PaymentMethod, label: 'Card / Net Banking', sub: 'Debit, Credit card', icon: FiCreditCard },
  { id: 'cod' as PaymentMethod, label: 'Cash on Delivery', sub: 'Pay when delivered', icon: FiTruck },
]

const CheckoutPage = () => {
  const router = useRouter()
  const { items, subtotal, discountAmount, total, couponCode, totalItems, clearCart } = useCart()
  const { user } = useAuth()

  const placeOrder = usePlaceOrder()

  const [step, setStep] = useState<Step>('address')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  const [address, setAddress] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [upiId, setUpiId] = useState('')

  const deliveryCharge = subtotal >= 499 ? 0 : 49
  const finalTotal = total + deliveryCharge

  const handleAddressNext = () => {
    const { name, phone, street, city, state, pincode } = address
    if (!name || !phone || !street || !city || !state || !pincode) {
      modal.error('Please fill all address fields')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      modal.error('Enter a valid 10-digit phone number')
      return
    }
    if (!/^\d{6}$/.test(pincode)) {
      modal.error('Enter a valid 6-digit pincode')
      return
    }
    setStep('payment')
  }

  const handlePaymentNext = () => {
    if (paymentMethod === 'upi' && !upiId.trim()) {
      modal.error('Please enter UPI ID')
      return
    }
    setStep('confirm')
  }

  // payment method mapping: checkout UI → backend enum
  const paymentMethodMap: Record<PaymentMethod, 'cash' | 'upi' | 'card'> = {
    cod: 'cash',
    upi: 'upi',
    online: 'card',
  }

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrder.mutateAsync({
        totalAmount: finalTotal,
        paymentMethod: paymentMethodMap[paymentMethod],
        address: `${address.name}, ${address.phone}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        couponCode: couponCode || undefined,
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
      })
      setOrderId(order.id)
      setOrderPlaced(true)
      clearCart()
    } catch {
      // error toast handled in usePlaceOrder onError
    }
  }

  // ── Order Placed Success ──────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={48} className="text-themeColor" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-1">
          Your order <strong>#{orderId}</strong> has been successfully placed.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You will receive a confirmation SMS on {address.phone}. Expected delivery in 1-3 business days.
        </p>
        <div className="flex gap-3 justify-center">
          <CustomButton
            text="Track Order"
            variant="bordered"
            className="px-6 border-themeColor text-themeColor"
            onPress={() => router.push('/orders')}
          />
          <CustomButton text="Continue Shopping" className="px-6" onPress={() => router.push('/shop')} />
        </div>
      </div>
    )
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Cart is empty</h2>
        <CustomButton text="Go to Shop" className="mt-2" onPress={() => router.push('/shop')} />
      </div>
    )
  }

  // ── Step Indicator ──────────────────────────────────────────────────────
  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Address' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Steps Progress */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < stepIndex
                    ? 'bg-themeColor text-white'
                    : i === stepIndex
                    ? 'bg-themeColor text-white ring-4 ring-green-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === stepIndex ? 'text-themeColor' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-14px] ${i < stepIndex ? 'bg-themeColor' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Form ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* Step 1: Address */}
          {step === 'address' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiMapPin size={18} className="text-themeColor" />
                <h2 className="text-lg font-bold text-gray-800">Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput label="Full Name" placeholder="Rahul Sharma" value={address.name} isRequired onValueChange={v => setAddress(a => ({ ...a, name: v }))} />
                <CustomInput label="Phone Number" placeholder="9876543210" value={address.phone} isRequired onValueChange={v => setAddress(a => ({ ...a, phone: v }))} />
                <div className="sm:col-span-2">
                  <CustomInput label="Street Address" placeholder="Flat/House no, Street, Area" value={address.street} isRequired onValueChange={v => setAddress(a => ({ ...a, street: v }))} />
                </div>
                <CustomInput label="City" placeholder="Mumbai" value={address.city} isRequired onValueChange={v => setAddress(a => ({ ...a, city: v }))} />
                <CustomInput label="State" placeholder="Maharashtra" value={address.state} isRequired onValueChange={v => setAddress(a => ({ ...a, state: v }))} />
                <CustomInput label="Pincode" placeholder="400001" value={address.pincode} isRequired onValueChange={v => setAddress(a => ({ ...a, pincode: v }))} />
              </div>
              <div className="mt-5 flex justify-end">
                <CustomButton text="Continue to Payment →" className="px-6" onPress={handleAddressNext} />
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiCreditCard size={18} className="text-themeColor" />
                <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="space-y-3 mb-5">
                {paymentMethods.map(({ id, label, sub, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === id
                        ? 'border-themeColor bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="accent-themeColor w-4 h-4"
                    />
                    <Icon size={20} className={paymentMethod === id ? 'text-themeColor' : 'text-gray-500'} />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'upi' && (
                <div className="mb-5">
                  <CustomInput
                    label="UPI ID"
                    placeholder="yourname@upi"
                    value={upiId}
                    isRequired
                    onValueChange={setUpiId}
                  />
                </div>
              )}

              <div className="flex gap-3 justify-between">
                <CustomButton text="← Back" variant="bordered" className="px-5 border-gray-200 text-gray-600" onPress={() => setStep('address')} />
                <CustomButton text="Review Order →" className="px-6" onPress={handlePaymentNext} />
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image ?? ''} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × ₹{item.product.price}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₹{(item.product.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              {/* Address Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                <p className="font-semibold text-gray-700 mb-1">📍 Delivery Address</p>
                <p className="text-gray-600">{address.name} · {address.phone}</p>
                <p className="text-gray-600">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm">
                <p className="font-semibold text-gray-700 mb-1">💳 Payment</p>
                <p className="text-gray-600">
                  {paymentMethods.find(p => p.id === paymentMethod)?.label}
                  {paymentMethod === 'upi' && ` (${upiId})`}
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <CustomButton text="← Back" variant="bordered" className="px-5 border-gray-200 text-gray-600" onPress={() => setStep('payment')} />
                <CustomButton
                  text={`Place Order · ₹${finalTotal.toFixed(0)}`}
                  className="px-6 flex-1"
                  isLoading={placeOrder.isPending}
                  onPress={handlePlaceOrder}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Summary ────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({couponCode})</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-themeColor text-lg">₹{finalTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
