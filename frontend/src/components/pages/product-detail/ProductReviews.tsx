import type { IReview } from "@/types";

interface IProductReviewsProps {
  reviews: IReview[];
}

const ProductReviews = ({ reviews }: IProductReviewsProps) => {
  if (!reviews.length) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 border rounded-lg"
        >
          <p className="font-semibold">{review.user?.name}</p>
          <p className="text-sm text-gray-500">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;