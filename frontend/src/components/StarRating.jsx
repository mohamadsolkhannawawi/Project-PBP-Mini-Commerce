// frontend/src/components/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

// StarRating component for displaying and selecting ratings
const StarRating = ({ rating = 0, max = 5, onRate, readOnly = true }) => {
    // Calculate number of full, partial, and empty stars
    const fullStars = Math.floor(rating);
    const partialStar = Math.round((rating - fullStars) * 10);
    const emptyStars = max - fullStars - (partialStar > 0 ? 1 : 0);

    return (
        <div style={{ display: 'flex', gap: 2 }}>
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
                            clipPath: `inset(0 ${100 - partialStar * 10}% 0 0)`,
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
