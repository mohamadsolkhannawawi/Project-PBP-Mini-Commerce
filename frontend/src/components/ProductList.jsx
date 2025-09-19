import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products }) {
    if (!products || products.length === 0) {
        return <p>Tidak ada produk untuk ditampilkan.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
