'use client'

import { useState } from 'react'
import { createReview } from '@/app/actions/companies'
import { Button } from '@/components/ui/button'

interface CompanyProfileProps {
  company: any
  reviews: any[]
}

export default function CompanyProfile({
  company,
  reviews,
}: CompanyProfileProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createReview(company.id, rating, comment)
      setComment('')
      setRating(5)
      setShowReviewForm(false)
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">About</h2>
            {company?.rating && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-semibold text-slate-900">
                  {Number(company.rating).toFixed(1)}
                </span>
                <span className="text-slate-600">
                  ({company.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
        {company?.description && (
          <p className="text-slate-700 text-base leading-relaxed">
            {company.description}
          </p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
          {!showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Write Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-500' : 'text-slate-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                  className="border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-slate-600">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">
                      {'⭐'.repeat(review.rating)}
                    </span>
                    <span className="text-sm text-slate-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
