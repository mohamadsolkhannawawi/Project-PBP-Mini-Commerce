// Utility functions for handling image URLs
const API_BASE_URL = 'http://127.0.0.1:8000';

export const getImageUrl = (image) => {
    if (!image) return '/no-image.webp';

    if (image.url) {
        return image.url;
    }

    if (image.image_path) {
        if (image.image_path.startsWith('http')) {
            return image.image_path;
        }

        if (image.image_path.startsWith('/storage')) {
            return `${API_BASE_URL}${image.image_path}`;
        }

        return `${API_BASE_URL}/storage/${image.image_path}`;
    }

    return '/no-image.webp';
};

export const getProductImageUrl = (product) => {
    if (!product) return '/no-image.webp';

    if (product.primary_image) {
        return getImageUrl(product.primary_image);
    }

    if (product.images && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }

    return '/no-image.webp';
};
