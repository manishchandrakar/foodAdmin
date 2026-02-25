"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct, useProducts } from "@/lib/hooks/useProducts";
import { useProductReviews } from "@/lib/hooks/useReviews";
import { useCart } from "@/context/CartContext";
import CustomButton from "@/components/custom/CustomButton";
import ProductImage from "@/components/pages/product-detail/ProductImage";
import ProductTabs from "@/components/pages/product-detail/ProductTabs";
import RelatedProducts from "@/components/pages/product-detail/RelatedProducts";
import ProductInfo from "@/components/pages/product-detail/ProductInfo";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";


const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addToCart } = useCart();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const { data: reviews = [] } = useProductReviews(product?.id ?? 0);

  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (p) =>
          p.categoryId === product.categoryId && p.id !== product.id
      )
      .slice(0, 4);
  }, [allProducts, product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <CustomButton
          text="Back to Shop"
          onPress={() => router.push("/shop")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <CustomButton
        text="Back"
        className="mb-4 sm:mb-6"
        onPress={() => router.back()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-12">
        <ProductImage product={product} />
        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          addToCart={addToCart}
        />
      </div>

      <ProductTabs product={product} reviews={reviews} />

      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductDetailPage;
