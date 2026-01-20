import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addRatingApi, getGameRatingsApi } from '@/services/rating.service';
import { toast } from 'sonner';

const GameRatingContent = ({ gameSlug, gameName, gameConfig }) => {
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form state
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const fetchRatings = async (currentPage = 1) => {
        try {
            setLoading(true);
            const res = await getGameRatingsApi(gameSlug, currentPage);
            if (res.success) {
                setRatings(res.ratings);
                setStats(res.stats);
                setTotalPages(Math.ceil(res.stats.count / 10)); // limit 10
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gameSlug) {
            fetchRatings(page);
        }
    }, [gameSlug, page]);

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to rate!");
            return;
        }
        if (userRating === 0) {
            toast.error("Please select a star rating!");
            return;
        }

        try {
            setSubmitting(true);
            const res = await addRatingApi(gameSlug, userRating, comment);
            if (res.success) {
                toast.success("Rating submitted successfully!");
                setComment("");
                setUserRating(0);
                fetchRatings(1); // Refresh
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between bg-black text-white p-3 rounded-t-sm">
                <span className="font-bold text-lg uppercase">{gameName}</span>
                <div className="flex items-center gap-2 text-sm text-yellow-400 bg-gray-900 px-3 py-1 rounded-full border border-yellow-600">
                    <Star className="fill-yellow-400" size={16} />
                    <span className="font-bold">{parseFloat(stats.average).toFixed(1)} / 5</span>
                    <span className="text-gray-400">({stats.count} reviews)</span>
                </div>
            </div>

            <div className="bg-[#e0e0e0] dark:bg-[#333] border-x-4 border-b-4 border-black p-4">
                {/* Writing a review */}
                {user ? (
                    <div className="bg-[#f0f0f0] dark:bg-[#1a1a1a] p-4 border-2 border-gray-400 dark:border-gray-600 rounded-sm mb-6 shadow-inner">
                        <h3 className="font-bold mb-2 text-sm uppercase tracking-wider border-b border-gray-300 pb-1">Write a Review</h3>
                        <div className="flex gap-2 mb-3 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setUserRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={24}
                                        className={`${star <= (hoverRating || userRating)
                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                                            : "text-gray-300 dark:text-gray-600"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="w-full bg-white dark:bg-[#252525] border-2 border-gray-300 dark:border-gray-500 p-3 text-sm mb-3 min-h-[100px] focus:outline-none focus:border-blue-500 resize-none font-sans"
                            placeholder="Share your experience with this game..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || userRating === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            >
                                {submitting ? "Submitting..." : "Post Review"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 text-gray-500 mb-6 font-mono">
                        Login to write a review
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 font-mono animate-pulse">Loading reviews...</div>
                    ) : ratings.length > 0 ? (
                        ratings.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-[#222] p-4 border-l-4 border-blue-500 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                                            {review.username?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{review.username || 'Anonymous'}</div>
                                            <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 pl-14 leading-relaxed font-sans">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-50 italic border-2 border-dashed border-gray-300 rounded-lg">
                            No reviews yet. Be the first to rate!
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Prev
                        </Button>
                        <span className="flex items-center px-4 text-sm font-bold bg-white dark:bg-black border border-gray-300 rounded">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameRatingContent;
