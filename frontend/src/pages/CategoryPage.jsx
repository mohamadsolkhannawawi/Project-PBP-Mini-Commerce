import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
function CategoryPage() {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            setLoading(true);
            try {
                // First, get the category details to display the name
                const categoryResponse = await axiosClient.get(`/categories/${categoryId}`);
                setCategory(categoryResponse.data);

                // Then, get the products for that category
                const productsResponse = await axiosClient.get(`/products?category_id=${categoryId}`);
                setProducts(productsResponse.data);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch products for this category.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [categoryId]);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && category && (
                <>
                    <h1 className="text-3xl font-bold mb-6 text-center">{category.name}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {products.length === 0 && (
                        <p className="text-center text-gray-500">No products found in this category.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default CategoryPage;
