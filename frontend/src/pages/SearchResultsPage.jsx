import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

function SearchResultsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(
                    `/products?search=${query}&limit=100&all=1`
                );
                let arr =
                    response.data?.data?.data ||
                    response.data?.data ||
                    response.data;
                setSearchResults(Array.isArray(arr) ? arr : []);
                setError(null);
            } catch (err) {
                setError('Gagal memuat hasil pencarian.');
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <LoadingSpinner text="Mencari produk..." size="lg" className="py-12" />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                Hasil Pencarian untuk "{query}"
            </h1>
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>Tidak ada produk yang ditemukan untuk "{query}".</p>
            )}
        </div>
    );
}

export default SearchResultsPage;