import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component
 * @param {number} rating - current rating (1-5, with 0.1 precision)
 * @param {number} max - max stars (default 5)
 * @param {function} onRate - optional callback for interactive rating
 * @param {boolean} readOnly - if true, stars are not clickable
 */
const StarRating = ({ rating = 0, max = 5, onRate, readOnly = true }) => {
    // Calculate full, partial, and empty stars
    const fullStars = Math.floor(rating); // Full stars
    const partialStar = Math.round((rating - fullStars) * 10); // Partial star (e.g., 4.1 becomes 1, 4.2 becomes 2)
    const emptyStars = max - fullStars - (partialStar > 0 ? 1 : 0); // Empty stars

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
            {/* Partial star */}
            {partialStar > 0 && (
                <span
                    key="partial"
                    style={{
                        position: 'relative',
                        width: 20,
                        height: 20,
                        display: 'inline-block',
                    }}
                >
                    <Star
                        size={20}
                        color="#facc15"
                        fill="#facc15"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            clipPath: `inset(0 ${100 - (partialStar * 10)}% 0 0)`,
                        }}
                        data-testid="star-partial"
                    />
                    <Star
                        size={20}
                        color="#d1d5db"
                        fill="#d1d5db"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            clipPath: `inset(0 0 0 ${partialStar * 10}%)`,
                        }}
                        data-testid="star-empty-partial"
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
                    onClick={() =>
                        !readOnly &&
                        onRate &&
                        onRate(fullStars + (partialStar > 0 ? 0.1 : 0) + i + 1)
                    }
                    data-testid="star-empty"
                />
            ))}
        </div>
    );
};

export default StarRating;
