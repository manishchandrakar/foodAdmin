'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPackage, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { useMyOrders, useCancelOrder } from '@/lib/hooks/useOrders'
import CustomButton from '@/components/custom/CustomButton'
import FilterPills from '@/components/common/FilterPills'
import StatusBadge from '@/components/common/StatusBadge'
import OrderTrackingBar from '@/components/common/OrderTrackingBar'
import EmptyState from '@/components/common/EmptyState'
import OrdersSkeleton from '@/components/skeletons/OrdersSkeleton'
import { filterOptions } from '@/utils/constant'


const orderFilterPillOptions = filterOptions.map(f => ({
  label: f === 'all' ? 'All Orders' : f,
  value: f,
}))

const OrdersPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { data: orders = [], isLoading } = useMyOrders()
  const cancelMutation = useCancelOrder()
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FiPackage size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Login to view orders</h2>
        <CustomButton text="Login" className="mt-2" onPress={() => router.push('/login')} />
      </div>
    )
  }

  if (isLoading) {
    return <OrdersSkeleton />
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {/* Filter Tabs */}
      <FilterPills
        options={orderFilterPillOptions}
        activeValue={filter}
        onChange={setFilter}
      />

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<FiShoppingBag size={48} className="mx-auto text-gray-300" />}
          title="No orders found"
          actionLabel="Shop Now"
          onAction={() => router.push('/shop')}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrder === order.id

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div
                  className="flex items-center justify-between p-3 sm:p-5 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <FiPackage size={16} className="text-themeColor sm:hidden" />
                      <FiPackage size={18} className="text-themeColor hidden sm:block" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-gray-800">Order #{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
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
                  <div className="border-t border-gray-100 p-3 sm:p-5">
                    {/* Tracking Bar */}
                    <OrderTrackingBar currentStatus={order.status} />

                    {/* Items */}
                    <div className="space-y-3 mb-5">
                      {order.orderItems?.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.product?.image ?? ''}
                            alt={item.product?.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover"
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
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm space-y-1.5">
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
                        <span className="text-right max-w-[50%] sm:max-w-[200px] text-xs break-words">{order.address}</span>
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
                          onPress={() => router.push(`/product/${order.orderItems?.[0]?.productId}`)}
                        />
                      )}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <CustomButton
                          text="Cancel Order"
                          variant="bordered"
                          className="text-sm border-red-300 text-red-500"
                          onPress={() => cancelMutation.mutate(order.id)}
                          isLoading={cancelMutation.isPending}
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
