import { FiShare2 } from "react-icons/fi";
import CustomButton from "@/components/custom/CustomButton";
import { getDiscountPercent } from "@/utils/priceUtils";
import { modal } from "@/utils/modal";
import type { IProduct } from "@/types";

interface IProductImageProps {
  product: IProduct;
}

const ProductImage = ({ product }: IProductImageProps) => {
  const discount = getDiscountPercent(product.price, product.mrp);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    modal.success("Link copied!");
  };

  return (
    <div className="relative">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {discount > 0 && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
          -{discount}% OFF
        </span>
      )}

      <CustomButton
        text=""
        onPress={handleShare}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md"
        leftIcon={<FiShare2 size={18} />}
      />
    </div>
  );
};

export default ProductImage;