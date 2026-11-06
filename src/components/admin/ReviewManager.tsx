import React from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Sparkles, ShieldCheck } from 'lucide-react';
import { Review } from '../../types';
import { updateReview, deleteReview } from '../../services/dbService';

interface Props {
  reviews: Review[];
}

export const ReviewManager: React.FC<Props> = ({ reviews }) => {
  const handleToggleApprove = async (review: Review) => {
    try {
      await updateReview(review.id, { isApproved: !review.isApproved });
    } catch (err) {
      console.error('Failed to toggle approval:', err);
    }
  };

  const handleToggleFeature = async (review: Review) => {
    try {
      await updateReview(review.id, { isFeatured: !review.isFeatured });
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      try {
        await deleteReview(id);
      } catch (err) {
        console.error('Delete review failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            REVIEW MODERATION & HIGHLIGHTS
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Approve or feature real customer reviews for the public website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888]">Total Reviews:</span>
          <span className="px-3 py-1 rounded-full bg-[#222] border border-[#333] text-xs font-bold text-white">
            {reviews.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between shadow-lg transition-all ${
              rev.isApproved ? 'bg-[#171717] border-[#272727]' : 'bg-[#1c1616] border-red-900/40 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#444]'
                      }`}
                    />
                  ))}
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    rev.isApproved
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {rev.isApproved ? 'Public Approved' : 'Hidden / Unapproved'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#DDD] italic leading-relaxed mb-4">
                "{rev.reviewText}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#252525] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white">{rev.customerName}</h4>
                <span className="text-[10px] text-[#888]">{rev.date || 'Recent review'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleFeature(rev)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    rev.isFeatured
                      ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                      : 'text-[#555] hover:text-white bg-[#222]'
                  }`}
                  title={rev.isFeatured ? 'Featured review' : 'Click to feature'}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  onClick={() => handleToggleApprove(rev)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    rev.isApproved
                      ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10'
                      : 'text-red-400 hover:text-red-300 bg-red-500/10'
                  }`}
                  title={rev.isApproved ? 'Unapprove / Hide' : 'Approve for public view'}
                >
                  {rev.isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
