"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { IProduct } from "@/types";
import { getDiscountPercent } from "@/utils/priceUtils";
import { useCart } from "@/context/CartContext";

interface IProductCardProps {
  product: IProduct;
  compact?: boolean;
}

const ProductCard = (props: IProductCardProps) => {
  const { product, compact = false } = props;
  const router = useRouter();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const discount = getDiscountPercent(product.price, product.mrp);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 600);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={
            product.image ??
            "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80"
          }
          alt={product.name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${compact ? "h-32 sm:h-40" : "h-40 sm:h-52"}`}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-2 right-2 bg-white/90 text-themeColor text-xs font-medium px-2 py-0.5 rounded-full">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className={`font-semibold text-gray-800 truncate ${compact ? "text-sm" : "text-base"}`}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <FaStar size={12} className="text-yellow-400" />
            <span className="text-xs text-gray-600">
              {product.avgRating.toFixed(1)}
              {product.totalReviews ? ` (${product.totalReviews})` : ""}
            </span>
          </div>
        )}

        {/* Unit */}
        {product.unit && (
          <p className="text-xs text-gray-400 mt-0.5">
            per {product.unit.symbol}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span
              className={`font-bold text-themeColor ${compact ? "text-base" : "text-lg"}`}
            >
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ₹{product.mrp}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock || adding}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : adding
                  ? "bg-green-100 text-themeColor"
                  : "bg-themeColor text-white hover:bg-themeColorDark"
            }`}
            onClick={handleAddToCart}
          >
            {adding ? (
              <FiStar size={14} className="animate-spin" />
            ) : (
              <FiShoppingCart size={14} />
            )}
          </button>
        </div>

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-orange-500 mt-1">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
