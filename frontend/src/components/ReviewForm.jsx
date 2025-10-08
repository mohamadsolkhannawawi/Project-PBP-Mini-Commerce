import React, { useState } from 'react';
import StarRating from './StarRating';
import axiosClient from '../api/axiosClient';
import { useToast } from '../contexts/ToastContext';

const ReviewForm = ({ productId, orderItemId, onSuccess, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showSuccess, showError, showLoading, updateToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const toastId = showLoading('Mengirim review...');
        setLoading(true);
        setError('');
        
        try {
            const res = await axiosClient.post('/reviews', {
                product_id: productId,
                order_item_id: orderItemId,
                rating,
                comment,
            });
            
            // ✅ SUCCESS TOAST HIJAU
            updateToast(toastId, 'Review berhasil dikirim! Terima kasih atas ulasan Anda.', 'success');
            
            // ✅ TUTUP MODAL + AUTO REFRESH SETELAH TOAST SELESAI (3 detik)
            setTimeout(() => {
                if (onClose) onClose(); // Tutup modal dulu
                
                // ✅ REFRESH HALAMAN SETELAH 500ms (biar modal tutup dulu)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }, 3000); // 3 detik (sesuai durasi toast)
            
        } catch (err) {
            console.error('Error submitting review:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Gagal mengirim review. Silakan coba lagi.';
            
            updateToast(toastId, errorMessage, 'error');
            setError(errorMessage);
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
                    disabled={loading}
                />
                
                {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
                
                <div className="flex gap-2 mt-6">
                    <button
                        type="submit"
                        className={`bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition-all ${
                            loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={loading || rating === 0}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengirim...
                            </div>
                        ) : (
                            'Kirim Review'
                        )}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
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