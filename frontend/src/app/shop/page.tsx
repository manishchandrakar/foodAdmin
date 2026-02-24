import { Suspense } from 'react'
import ShopPage from '@/views/ShopPage'

export default function ShopRoute() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}>
      <ShopPage />
    </Suspense>
  )
}
