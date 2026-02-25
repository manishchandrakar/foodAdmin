'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiUser, FiMail, FiPhone, FiEdit2, FiPackage, FiLogOut, FiSave } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { useMyOrders } from '@/lib/hooks/useOrders'
import { useUpdateProfile } from '@/lib/hooks/useAuth'
import CustomButton from '@/components/custom/CustomButton'
import CustomInput from '@/components/custom/CustomInput'
import StatusBadge from '@/components/common/StatusBadge'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton'
import { modal } from '@/utils/modal'

const ProfilePage = () => {
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()
  const { data: userOrders = [] } = useMyOrders()
  const updateProfile = useUpdateProfile()

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  })

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FiUser size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Login to view profile</h2>
        <CustomButton text="Login" className="mt-2" onPress={() => router.push('/login')} />
      </div>
    )
  }

  const deliveredOrders = userOrders.filter(o => o.status === 'delivered')
  const totalSpent = deliveredOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      modal.error('Name and email are required')
      return
    }
    await updateProfile.mutateAsync(formData)
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    modal.info('Logged out successfully')
    router.push('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ── Profile Card ────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 text-center">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-themeColor to-themeColorDark text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4">
              {user?.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 text-xs bg-green-100 text-themeColor font-semibold px-3 py-1 rounded-full capitalize">
              {user?.role}
            </span>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
              {[
                { val: userOrders.length, label: 'Orders' },
                { val: deliveredOrders.length, label: 'Delivered' },
                { val: `₹${totalSpent}`, label: 'Spent' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-base sm:text-lg font-bold text-themeColor">{val}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-5 space-y-2">
              <button
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-themeColor transition-colors"
                onClick={() => router.push('/orders')}
              >
                <FiPackage size={16} /> My Orders
              </button>
              <button
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile Details ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">Personal Information</h3>
              {!editing ? (
                <button
                  className="flex items-center gap-1.5 text-sm text-themeColor hover:underline"
                  onClick={() => setEditing(true)}
                >
                  <FiEdit2 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="text-sm text-gray-400 hover:text-gray-600"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                {[
                  { icon: FiUser, label: 'Full Name', value: user?.name },
                  { icon: FiMail, label: 'Email Address', value: user?.email },
                  { icon: FiPhone, label: 'Phone Number', value: user?.phone ?? 'Not provided' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-themeColor" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <CustomInput
                  label="Full Name"
                  value={formData.name}
                  isRequired
                  onValueChange={v => setFormData(d => ({ ...d, name: v }))}
                />
                <CustomInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  isRequired
                  onValueChange={v => setFormData(d => ({ ...d, email: v }))}
                />
                <CustomInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onValueChange={v => setFormData(d => ({ ...d, phone: v }))}
                />
                <CustomButton
                  text={<span className="flex items-center gap-2"><FiSave size={15} /> Save Changes</span>}
                  className="w-full"
                  isLoading={updateProfile.isPending}
                  onPress={handleSave}
                />
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
              <button
                className="text-sm text-themeColor hover:underline"
                onClick={() => router.push('/orders')}
              >
                View All
              </button>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No orders yet</p>
                <button
                  className="text-themeColor text-sm font-medium mt-2 hover:underline"
                  onClick={() => router.push('/shop')}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.slice(0, 3).map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => router.push('/orders')}
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        &nbsp;· {order.orderItems?.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-themeColor">₹{order.totalAmount}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Coupons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Available Coupons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { code: 'FRESH10', discount: '10% off', desc: 'On all orders', valid: 'Dec 2025' },
                { code: 'WELCOME15', discount: '15% off', desc: 'First order only', valid: 'Dec 2025' },
                { code: 'FRUIT20', discount: '20% off', desc: 'On ₹500+ orders', valid: 'Jun 2025' },
              ].map(c => (
                <div key={c.code} className="border-2 border-dashed border-themeColor/30 rounded-xl p-3 bg-green-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-themeColor text-sm tracking-wider">{c.code}</span>
                    <span className="text-xs bg-themeColor text-white px-2 py-0.5 rounded-full font-semibold">{c.discount}</span>
                  </div>
                  <p className="text-xs text-gray-600">{c.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Valid till {c.valid}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
