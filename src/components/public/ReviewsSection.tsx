import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { Review } from '../../types';
import { submitReview } from '../../services/dbService';

interface Props {
  reviews: Review[];
}

export const ReviewsSection: React.FC<Props> = ({ reviews }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Only display approved reviews on customer-facing site
  const approvedReviews = reviews.filter((r) => r.isApproved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) return;

    setSubmitting(true);
    try {
      await submitReview({
        customerName: customerName.trim(),
        rating,
        reviewText: reviewText.trim(),
        date: 'Today',
        isApproved: true, // Default active or can be moderated
        isFeatured: false,
        source: 'Verified Customer Review',
      });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setModalOpen(false);
        setCustomerName('');
        setReviewText('');
        setRating(5);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-[#101010] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>COMMUNITY LOVE</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
              WHAT OUR BITE LOVERS <span className="text-[#E63932]">SAY</span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8B8B8] max-w-lg mt-2">
              Authentic feedback from real diners who experienced our signature smash burgers in Mian Gujar.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-white border border-[#333] hover:border-[#E63932] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#E63932]" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#171717] rounded-2xl p-6 border border-[#252525] flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
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
                  <span className="text-[11px] text-[#888] font-medium">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#DDD] leading-relaxed italic mb-6">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{rev.customerName}</h4>
                  <span className="text-[10px] text-[#888]">{rev.source || 'Verified Customer'}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2e2e2e] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {successMessage ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bebas text-2xl text-white">Review Received!</h3>
                <p className="text-xs text-[#B8B8B8] mt-1">
                  Thank you for your feedback! Your review helps us keep serving the biggest bites in Peshawar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-bebas text-2xl text-white mb-1">Share Your Experience</h3>
                <p className="text-xs text-[#B8B8B8] mb-6">
                  Tell us how much you enjoyed your burger or delivery experience.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-[#444]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-amber-400 font-bold ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Your Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What was your favorite burger? How was the service and taste?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs text-white placeholder-[#555] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all cursor-pointer mt-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Honest Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
