import { FaDollarSign, FaUsers, FaShoppingCart, FaChartLine, FaChartBar, FaCog, FaHome, FaBoxOpen, FaThList, FaMoneyCheckAlt, FaTags, FaStar, FaUserFriends, FaCartPlus, FaPercent, FaStore, FaBuilding } from "react-icons/fa"
import { z } from "zod"
import { IStat } from "@/utils/validators"
import { StatSchema } from "./schemas"




// Dummy Data
export const getDashboardStats = (): IStat[] => {
  const stats = [
    {
      title: "Revenue",
      value: "$48,920",
      growth: "+12%",
      icon: FaDollarSign,
    },
    {
      title: "Users",
      value: "2,350",
      growth: "+8%",
      icon: FaUsers,
    },
    {
      title: "Orders",
      value: "1,245",
      growth: "+18%",
      icon: FaShoppingCart,
    },
    {
      title: "Conversion",
      value: "4.6%",
      growth: "+3%",
      icon: FaChartLine,
    },
  ]

  return z.array(StatSchema).parse(stats)
}

export const asideItems = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: FaHome },
      { label: "Reports", href: "/dashboard/reports", icon: FaChartBar },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", href: "/dashboard/products", icon: FaBoxOpen },
      { label: "Categories", href: "/dashboard/categories", icon: FaThList },
      { label: "Units", href: "/dashboard/units", icon: FaMoneyCheckAlt },
      { label: "GST Rates", href: "/dashboard/gst-rates", icon: FaPercent },
      { label: "Coupons", href: "/dashboard/coupons", icon: FaTags },
    ],
  },
  {
    title: "Vendors & B2B",
    items: [
      { label: "Vendors", href: "/dashboard/vendors", icon: FaStore },
      { label: "B2B Customers", href: "/dashboard/b2b", icon: FaBuilding },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Cart", href: "/dashboard/cart", icon: FaCartPlus },
      { label: "Orders", href: "/dashboard/orders", icon: FaShoppingCart },
      { label: "Payments", href: "/dashboard/payments", icon: FaMoneyCheckAlt },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "Users", href: "/dashboard/users", icon: FaUsers },
      { label: "Customers", href: "/dashboard/customers", icon: FaUserFriends },
      { label: "Reviews", href: "/dashboard/reviews", icon: FaStar },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: FaCog },
    ],
  },
];
