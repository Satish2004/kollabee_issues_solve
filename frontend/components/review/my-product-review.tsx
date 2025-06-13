import React, { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { reviewsApi } from "@/lib/api/reviews";
import { toast } from "sonner";

interface MyProductReviewProps {
  productId: string;
  myReview: {
    id: string;
    rating: number;
    comment?: string;
  } | null;
  orderStatus: string;
  productName: string;
  onReviewAdded?: (review: any) => void;
}

export default function MyProductReview({ productId, myReview, orderStatus, productName, onReviewAdded }: MyProductReviewProps) {
  const [showForm, setShowForm] = useState(!myReview);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState(myReview);

  if (orderStatus !== "DELIVERED") return null;

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleStarHover = (star: number | null) => {
    setHoverRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await reviewsApi.addReview(productId, { rating, comment });
      setReview(res.data);
      setShowForm(false);
      toast.success("Review submitted! Thank you for your feedback.");
      onReviewAdded?.(res.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm && review) {
    return (
      <div className="p-5 border rounded-lg bg-gradient-to-br from-yellow-50 to-white shadow mb-6">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-800 mr-2">Your Review for</span>
          <span className="font-bold text-blue-700">{productName}</span>
        </div>
        <div className="flex items-center mb-1">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} className={
              `h-5 w-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`
            } />
          ))}
          <span className="ml-2 text-sm text-gray-600">{review.rating} / 5</span>
        </div>
        {review.comment && <div className="text-gray-700 italic mt-2">“{review.comment}”</div>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-lg bg-gradient-to-br from-blue-50 to-white shadow mb-6 max-w-xl">
      <div className="font-semibold text-lg mb-2 text-gray-800">Add Your Review for <span className="text-blue-700">{productName}</span></div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating <span className="text-red-500">*</span></label>
        <div className="flex items-center space-x-1">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={() => handleStarHover(null)}
              className="focus:outline-none transition-transform duration-100 hover:scale-125"
            >
              {star <= (hoverRating ?? rating) ? (
                <Star className="h-7 w-7 fill-yellow-400 text-yellow-400 drop-shadow" />
              ) : (
                <StarOff className="h-7 w-7 text-gray-300 hover:text-yellow-400" />
              )}
            </button>
          ))}
          <span className="ml-3 text-base text-gray-600">
            {rating > 0 ? `${rating} / 5` : 'Select rating'}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full min-h-[90px] border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1 text-right">{comment.length}/500 characters</div>
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-100 transition"
          onClick={() => setShowForm(false)}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 