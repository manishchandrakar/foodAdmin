import { getDiscountPercent } from "@/utils/priceUtils";
import type { IProduct } from "@/types";

interface IProductPriceProps {
  product: IProduct;
}

const ProductPrice = ({ product }: IProductPriceProps) => {
  const discount = getDiscountPercent(product.price, product.mrp);

  return (
    <div className="mb-4">
      <div className="flex items-end gap-3">
        <span className="text-3xl sm:text-4xl font-bold text-themeColor">
          ₹{product.price}
        </span>

        {product.mrp && product.mrp > product.price && (
          <span className="line-through text-gray-400">
            ₹{product.mrp}
          </span>
        )}

        {product.mrp && discount > 0 && (
          <span className="text-green-600 font-semibold">
            Save ₹{product.mrp - product.price}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductPrice;