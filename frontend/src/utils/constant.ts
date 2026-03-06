import { FiTruck, FiShield, FiRefreshCw, FiStar } from "react-icons/fi";

export const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Pending' },
  confirmed: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Confirmed' },
  processing: { color: 'text-purple-700', bg: 'bg-purple-50', label: 'Processing' },
  shipped: { color: 'text-orange-700', bg: 'bg-orange-50', label: 'Shipped' },
  delivered: { color: 'text-green-700', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { color: 'text-red-700', bg: 'bg-red-50', label: 'Cancelled' },
}

export const trackingSteps = ['confirmed', 'processing', 'shipped', 'delivered']

  export const filterOptions = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  export const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹499' },
    { icon: FiShield, title: 'Quality Assured', desc: 'Farm-fresh guarantee' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '24-hour return policy' },
    { icon: FiStar, title: 'Best Prices', desc: 'Direct from farmers' },
  ]

   export const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/shop' },
    { label: 'Deals', path: '/shop?deals=true' },
  ]

  export 
const columns: ColumnDef[] = [
  { uid: "id",        name: "#" },
  { uid: "user",      name: "Customer" },
  { uid: "items",     name: "Items" },
  { uid: "total",     name: "Total" },
  { uid: "status",    name: "Status" },
  { uid: "createdAt", name: "Date" },
  { uid: "actions",   name: "" },
]