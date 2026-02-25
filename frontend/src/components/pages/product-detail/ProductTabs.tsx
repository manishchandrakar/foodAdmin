import { useState } from "react";
import ProductReviews from "./ProductReviews";
import type { IProduct, IReview } from "@/types";

interface IProductTabsProps {
  product: IProduct;
  reviews: IReview[];
}

const ProductTabs = ({ product, reviews }: IProductTabsProps) => {
  const [tab, setTab] = useState<"desc" | "reviews">("desc");

  return (
    <div className="mb-12">
      <div className="flex gap-6 border-b mb-6">
        <button onClick={() => setTab("desc")}>
          Description
        </button>
        <button onClick={() => setTab("reviews")}>
          Reviews ({reviews.length})
        </button>
      </div>

      {tab === "desc" ? (
        <p>{product.description}</p>
      ) : (
        <ProductReviews reviews={reviews} />
      )}
    </div>
  );
};

export default ProductTabs;