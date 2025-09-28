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
    // Calculate stars: full, half, empty
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const halfStars = hasHalfStar ? 1 : 0;
    const emptyStars = max - fullStars - halfStars;

    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {/* Full stars */}
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                    key={`full-${i}`}
                    size={20}
                    color="#facc15"
                    fill="#facc15"
                    style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    onClick={() => !readOnly && onRate && onRate(i + 1)}
                    data-testid="star-filled"
                />
            ))}
            {/* Half star */}
            {halfStars === 1 && (
                <span key="half" style={{ position: 'relative', width: 20, height: 20, display: 'inline-block' }}>
                    <Star
                        size={20}
                        color="#facc15"
                        fill="#facc15"
                        style={{ position: 'absolute', left: 0, top: 0, clipPath: 'inset(0 50% 0 0)' }}
                        data-testid="star-half"
                    />
                    <Star
                        size={20}
                        color="#d1d5db"
                        fill="#d1d5db"
                        style={{ position: 'absolute', left: 0, top: 0, clipPath: 'inset(0 0 0 50%)' }}
                        data-testid="star-half-empty"
                    />
                </span>
            )}
            {/* Empty stars */}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    size={20}
                    color="#d1d5db"
                    fill="none"
                    style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    onClick={() => !readOnly && onRate && onRate(fullStars + halfStars + i + 1)}
                    data-testid="star-empty"
                />
            ))}
        </div>
    );
};

export default StarRating;
