"use client";

import React, { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { reviewsApi } from "../../lib/api/reviews";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onReviewSubmitted,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.addReview(productId, {
        rating,
        comment: comment.trim() || "", 
      });
      
      toast.success("Review submitted successfully!");
      window.location.reload();
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Review {productName}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 