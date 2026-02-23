import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi'
import { orders } from '@/data/dummy'
import { useAuth } from '@/context/AuthContext'
import CustomButton from '@/components/custom/CustomButton'

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Pending' },
  confirmed: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Confirmed' },
  processing: { color: 'text-purple-700', bg: 'bg-purple-50', label: 'Processing' },
  shipped: { color: 'text-orange-700', bg: 'bg-orange-50', label: 'Shipped' },
  delivered: { color: 'text-green-700', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { color: 'text-red-700', bg: 'bg-red-50', label: 'Cancelled' },
}

const trackingSteps = ['confirmed', 'processing', 'shipped', 'delivered']

const OrdersPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FiPackage size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Login to view orders</h2>
        <CustomButton text="Login" className="mt-2" onPress={() => navigate('/login')} />
      </div>
    )
  }

  const filterOptions = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map(f => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border capitalize ${
              filter === f
                ? 'bg-themeColor text-white border-themeColor'
                : 'bg-white text-gray-600 border-gray-200 hover:border-themeColor'
            }`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Orders' : f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No orders found</p>
          <CustomButton text="Shop Now" className="mt-4" onPress={() => navigate('/shop')} />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const cfg = statusConfig[order.status] ?? statusConfig.pending
            const isExpanded = expandedOrder === order.id
            const stepIdx = trackingSteps.indexOf(order.status)

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <FiPackage size={18} className="text-themeColor" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">Order #{order.id}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                        &nbsp;·&nbsp; {order.orderItems?.length ?? 0} items
                        &nbsp;·&nbsp; <span className="font-semibold text-themeColor">₹{order.totalAmount}</span>
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <FiChevronUp size={18} className="text-gray-400 shrink-0" /> : <FiChevronDown size={18} className="text-gray-400 shrink-0" />}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5">
                    {/* Tracking Bar */}
                    {stepIdx >= 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Order Tracking</p>
                        <div className="flex items-center gap-0">
                          {trackingSteps.map((step, i) => (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    i <= stepIdx ? 'bg-themeColor text-white' : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {i <= stepIdx ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs mt-1 capitalize ${i <= stepIdx ? 'text-themeColor font-medium' : 'text-gray-400'}`}>
                                  {step}
                                </span>
                              </div>
                              {i < trackingSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 mt-[-14px] ${i < stepIdx ? 'bg-themeColor' : 'bg-gray-200'}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-3 mb-5">
                      {order.orderItems?.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.product?.image ?? ''}
                            alt={item.product?.name}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{item.product?.name}</p>
                            <p className="text-xs text-gray-400">
                              {item.quantity} × ₹{item.price} / {item.unit?.symbol}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
                      <div className="flex justify-between text-gray-600">
                        <span>Payment</span>
                        <span className="capitalize font-medium">{order.paymentMethod.toUpperCase()}</span>
                      </div>
                      {order.couponCode && (
                        <div className="flex justify-between text-green-600">
                          <span>Coupon ({order.couponCode})</span>
                          <span>Applied</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Address</span>
                        <span className="text-right max-w-[200px] text-xs">{order.address}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2 mt-2">
                        <span>Total Amount</span>
                        <span className="text-themeColor">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      {order.status === 'delivered' && (
                        <CustomButton
                          text="Write Review"
                          variant="bordered"
                          className="text-sm border-themeColor text-themeColor"
                          onPress={() => navigate(`/product/${order.orderItems?.[0]?.productId}`)}
                        />
                      )}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <CustomButton
                          text="Cancel Order"
                          variant="bordered"
                          className="text-sm border-red-300 text-red-500"
                          onPress={() => {}}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
