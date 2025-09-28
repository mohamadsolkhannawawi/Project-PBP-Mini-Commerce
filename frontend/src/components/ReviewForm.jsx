import React, { useState } from 'react';
import StarRating from './StarRating';
import axiosClient from '../api/axiosClient';

/**
 * ReviewForm modal
 * Props:
 * - productId
 * - orderItemId
 * - onSuccess (callback after submit)
 * - onClose (close modal)
 */
const ReviewForm = ({ productId, orderItemId, onSuccess, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axiosClient.post('/reviews', {
                product_id: productId,
                order_item_id: orderItemId,
                rating,
                comment,
            });
            if (onSuccess) onSuccess(res.data);
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Gagal submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg font-bold mb-4">Tulis Review</h2>
                <label className="block mb-2">Rating:</label>
                <StarRating
                    rating={rating}
                    readOnly={false}
                    onRate={setRating}
                />
                <label className="block mt-4 mb-2">Komentar:</label>
                <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tulis komentar..."
                />
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <div className="flex gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                        disabled={loading || rating === 0}
                    >
                        {loading ? 'Mengirim...' : 'Kirim Review'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
