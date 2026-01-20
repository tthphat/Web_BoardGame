import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Loader2, MessageSquare, User, Send, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addRatingApi, getGameRatingsApi } from '@/services/rating.service';
import { toast } from 'sonner';

const GameRatingContent = ({ gameSlug, gameName }) => {
    // --- LOGIC GIỮ NGUYÊN ---
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
            const res = await getGameRatingsApi(gameSlug, currentPage, 3);
            if (res.success) {
                setRatings(res.ratings);
                setStats(res.stats);
                setTotalPages(Math.ceil(res.stats.count / 3)); // limit 3
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
            toast.error("LOGIN REQUIRED", { description: "Please login to rate!" });
            return;
        }
        if (userRating === 0) {
            toast.warning("MISSING RATING", { description: "Please select a star rating!" });
            return;
        }

        try {
            setSubmitting(true);
            const res = await addRatingApi(gameSlug, userRating, comment);
            if (res.success) {
                toast.success("SUCCESS", { description: "Rating submitted successfully!" });
                setComment("");
                setUserRating(0);
                fetchRatings(1); // Refresh
            }
        } catch (error) {
            toast.error("ERROR", { description: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, size = 16) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${star <= rating ? "fill-yellow-400 text-black" : "text-gray-400"} stroke-[1.5px]`}
                    />
                ))}
            </div>
        );
    };

    // --- PHẦN UI THAY ĐỔI (RETRO STYLE) ---
    return (
        <div className="space-y-6 font-mono text-black">

            {/* 1. Header Stats (Bảng điểm số) */}
            <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Ô điểm số: Style Sunken (Lõm) */}
                    <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2 min-w-[80px] text-center shadow-inner">
                        <span className="block text-3xl font-bold text-blue-800 leading-none">
                            {parseFloat(stats.average).toFixed(1)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg uppercase text-black tracking-wide">{gameName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            {renderStars(Math.round(stats.average))}
                            <span className="text-xs font-bold">({stats.count} REVIEWS)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Form Viết Review */}
            <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-1 shadow-md">
                <div className="bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center gap-2 mb-1 uppercase">
                    <MessageSquare size={12} /> Write_New_Review
                </div>

                <div className="p-3">
                    {user ? (
                        <>
                            {/* Chọn sao */}
                            <div className="flex items-center gap-4 mb-3">
                                <label className="text-xs font-bold bg-[#e0e0e0] px-1 border border-gray-500">RATING:</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setUserRating(star)}
                                            className="focus:outline-none transition-transform active:scale-90 active:translate-y-1"
                                        >
                                            <Star
                                                size={24}
                                                className={`${star <= (hoverRating || userRating)
                                                        ? "fill-yellow-400 text-black drop-shadow-sm"
                                                        : "text-gray-400"
                                                    } stroke-2`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-blue-800">
                                    {userRating > 0 ? `[ SELECTED: ${userRating} STARS ]` : '[ SELECT RATING ]'}
                                </span>
                            </div>

                            {/* Textarea: Style Sunken */}
                            <textarea
                                className="w-full bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2 text-sm mb-3 min-h-[80px] focus:outline-none focus:bg-yellow-50 resize-none font-mono shadow-inner placeholder-gray-400 text-black"
                                placeholder="Share your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            {/* Submit Button: Style Raised */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || userRating === 0}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-xs uppercase shadow-md active:shadow-none active:translate-y-[1px] hover:bg-[#d0d0d0] transition-colors text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                    {submitting ? "PROCESSING..." : "POST_TO_BOARD"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-400 bg-[#e0e0e0] text-gray-500 uppercase text-xs">
                            &lt; ACCESS DENIED: PLEASE LOGIN TO REVIEW &gt;
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Danh sách Review */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-gray-500 pb-1 mb-2">
                    <div className="flex items-center gap-2 text-black">
                        <History size={16} />
                        <h3 className="font-bold text-sm uppercase">REVIEW_LOGS</h3>
                    </div>
                    <span className="text-xs text-gray-600 font-bold">{ratings.length} RECORDS FOUND</span>
                </div>

                {loading ? (
                    <div className="text-center py-8 font-mono animate-pulse uppercase text-xs">Reading disk...</div>
                ) : ratings.length > 0 ? (
                    ratings.map((review) => (
                        <div key={review.id} className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-1 shadow-sm mb-3">
                            {/* Header Review Item */}
                            <div className="bg-[#a0a0a0] border border-b-white border-r-white border-t-gray-600 border-l-gray-600 px-2 py-1 flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <User size={12} className="text-black" />
                                    <span className="font-bold text-black text-xs uppercase tracking-wider">
                                        [{review.username || 'ANONYMOUS'}]
                                    </span>
                                    {/* Sao hiển thị ngay trên header */}
                                    <div className="flex bg-black px-1 py-0.5 border border-gray-500 ml-2">
                                        {renderStars(review.rating, 10)}
                                    </div>
                                </div>
                                <span className="text-[10px] text-black font-semibold font-mono">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Nội dung Review: Style Sunken */}
                            <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 min-h-[40px]">
                                <p className="text-sm text-black break-words whitespace-pre-wrap font-mono leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-400 bg-[#e0e0e0] text-gray-500 uppercase text-xs">
                        NO DATA FOUND. BE THE FIRST TO REVIEW!
                    </div>
                )}
            </div>

            {/* 4. Pagination (Retro Style) */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-2 pb-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                    >
                        &lt; PREV
                    </button>

                    {/* Số trang: Style Sunken */}
                    <div className="flex items-center px-4 text-xs font-bold bg-white border-2 border-t-black border-l-black border-r-white border-b-white">
                        PAGE {page} / {totalPages}
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                    >
                        NEXT &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameRatingContent;