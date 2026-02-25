import ProductCard from "@/components/shop/ProductCard";
import type { IProduct } from "@/types";

interface IRelatedProductsProps {
  products: IProduct[];
}

const RelatedProducts = (props: IRelatedProductsProps) => {
  const { products } = props;
  if (!products.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">
        Related Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;