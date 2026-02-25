import { Dispatch, SetStateAction } from "react";
import { FiShoppingCart } from "react-icons/fi";
import CustomButton from "@/components/custom/CustomButton";
import QuantitySelector from "./QuantitySelector";
import ProductPrice from "./ProductPrice";
import type { IProduct } from "@/types";

interface IProductInfoProps {
  product: IProduct;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  addToCart: (product: IProduct, qty: number) => void;
}

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  addToCart,
}: IProductInfoProps) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.name}</h1>

      <ProductPrice product={product} />

      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        stock={product.stock}
        price={product.price}
      />

      <div className="flex gap-3 mt-6">
        <CustomButton
          variant="bordered"
          className="flex-1"
          text={
            <span className="flex items-center gap-2">
              <FiShoppingCart size={16} /> Add to Cart
            </span>
          }
          onPress={() => addToCart(product, quantity)}
        />

        <CustomButton
          className="flex-1"
          text="Buy Now"
          onPress={() => {
            addToCart(product, quantity);
            window.location.href = "/cart";
          }}
        />
      </div>
    </div>
  );
};

export default ProductInfo;