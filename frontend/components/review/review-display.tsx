"use client";

import React from "react";
import { Star } from "lucide-react";
import type { Review } from "@/types/api";

interface ReviewDisplayProps {
  reviews: Review[];
  productName: string;
}

export default function ReviewDisplay({ reviews, productName }: ReviewDisplayProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Reviews for {productName}</h3>
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        Reviews for {productName} ({reviews.length})
      </h3>
      
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
    </div>
  );
} 