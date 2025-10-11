import React from 'react';

const LoadingSpinner = ({ 
    text = 'Memuat...', 
    size = 'md', 
    showText = true,
    className = '',
    textClassName = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6', 
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            {/* Spinner */}
            <div 
                className={`${sizeClasses[size]} border-2 border-gray-200 border-t-[#415A77] rounded-full animate-spin`}
            ></div>
            
            {/* Text */}
            {showText && (
                <p className={`mt-2 text-sm text-gray-600 animate-pulse ${textClassName}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;