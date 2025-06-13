"use client";

import React, { useState, useEffect } from "react";
import { Star, StarOff, MessageSquare, Plus } from "lucide-react";
import { reviewsApi } from "../../lib/api/reviews";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  productId: string;
  buyerId: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    user: {
      name: string;
      imageUrl?: string;
    };
  };
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
  initialReviews?: Review[];
}

export default function ReviewSection({ 
  productId, 
  productName, 
  initialReviews = [] 
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(initialReviews.length === 0);

  useEffect(() => {
    // If we don't have initial reviews, fetch them
    if (initialReviews.length === 0) {
      fetchReviews();
    } else {
      setReviews(initialReviews);
      setIsLoading(false);
    }
  }, [productId, initialReviews]);

  const fetchReviews = async () => {
    try {
      const response = await reviewsApi.getProductReviews(productId);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.addReview(productId, {
        rating,
        comment: comment.trim() || "",
      });
      
      // Reset form
      setRating(0);
      setComment("");
      setShowReviewForm(false);
      
      // Refresh reviews
      await fetchReviews();
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Reviews for {productName} ({reviews.length})
        </h3>
        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-medium mb-4">Write Your Review</h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map((starIndex) => (
                  <button
                    key={starIndex}
                    type="button"
                    onClick={() => handleStarClick(starIndex)}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    {starIndex < rating ? (
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
                    )}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setComment("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {review.buyer.user.imageUrl ? (
                      <img
                        src={review.buyer.user.imageUrl}
                        alt={review.buyer.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">
                        {review.buyer.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{review.buyer.user.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {review.comment && (
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 