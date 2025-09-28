import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component
 * @param {number} rating - current rating (1-5)
 * @param {number} max - max stars (default 5)
 * @param {function} onRate - optional callback for interactive rating
 * @param {boolean} readOnly - if true, stars are not clickable
 */
const StarRating = ({ rating = 0, max = 5, onRate, readOnly = true }) => {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    size={20}
                    color={i < rating ? '#facc15' : '#d1d5db'} // gold for filled, gray for empty
                    fill={i < rating ? '#facc15' : 'none'}
                    style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    onClick={() => !readOnly && onRate && onRate(i + 1)}
                    data-testid={i < rating ? 'star-filled' : 'star-empty'}
                />
            ))}
        </div>
    );
};

export default StarRating;
