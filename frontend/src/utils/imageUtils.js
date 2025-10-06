// Utility functions for handling image URLs
const API_BASE_URL = 'http://127.0.0.1:8000';

export const getImageUrl = (image) => {
    if (!image) return '/no-image.webp';

    // If image has url property (from backend accessor), use it directly
    if (image.url) {
        return image.url;
    }

    // If image_path exists, construct URL
    if (image.image_path) {
        // If already a full URL, return as is
        if (image.image_path.startsWith('http')) {
            return image.image_path;
        }

        // If starts with /storage, prepend base URL
        if (image.image_path.startsWith('/storage')) {
            return `${API_BASE_URL}${image.image_path}`;
        }

        // If relative path like products/filename.jpg, construct full URL
        return `${API_BASE_URL}/storage/${image.image_path}`;
    }

    return '/no-image.webp';
};

export const getProductImageUrl = (product) => {
    if (!product) return '/no-image.webp';

    // Try primary image first
    if (product.primary_image) {
        return getImageUrl(product.primary_image);
    }

    // Try first image from images array
    if (product.images && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }

    return '/no-image.webp';
};
