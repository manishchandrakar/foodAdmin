import { createCrudHooks } from "./useCrud";
import type { IReviewResponse } from "@/types/api";

const reviewCrud = createCrudHooks<IReviewResponse>("/api/reviews", "reviews", {
  entityName: "Review",
});

export const useReviews = reviewCrud.useGetAll;
export const useReview = reviewCrud.useGetById;
export const useCreateReview = reviewCrud.useCreate;
export const useUpdateReview = reviewCrud.useUpdate;
export const useDeleteReview = reviewCrud.useDelete;
