// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import axiosClient from '../api/axiosClient';
import BannerSlider from '../components/BannerSlider';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const slides = [
        { src: undefined, title: 'A suit and A shoe' },
        { src: undefined, title: 'New arrivals for you' },
        { src: undefined, title: 'Deals of the week' },
    ];

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                const [productsResponse, categoriesResponse] = await Promise.all([
                    axiosClient.get('/products'),
                    axiosClient.get('/categories')
                ]);
                setProducts(productsResponse.data);
                setCategories(categoriesResponse.data);
                setError(null);
            } catch (err) {
                let msg = 'Terjadi kesalahan yang tidak diketahui.';
                if (err.response)
                    msg = `Error ${err.response.status}: ${
                        err.response.data.message ||
                        'Server tidak memberikan pesan detail.'
                    }`;
                else if (err.request)
                    msg =
                        'Tidak dapat terhubung ke server. Pastikan server backend berjalan dan konfigurasi CORS sudah benar.';
                else msg = err.message;
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    return (
        <div
            className="px-4 md:px-2"
            style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
            <section className="w-full">
                <BannerSlider height={`calc(80vh)`} />
            </section>

            <section id="all-categories" className="mb-8 mt-6 flex flex-wrap gap-4 justify-center">
                {/* Static "All Categories" Button */}
                <Link to="/">
                    <button
                        className="px-5 py-2 rounded-full text-base font-semibold text-white bg-[#0D1B2A] transition-transform transform hover:scale-105 shadow-md"
                    >
                        All Categories
                    </button>
                </Link>

                {/* Dynamic Category Buttons */}
                {categories.map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.id}`}>
                        <button className="px-5 py-2 rounded-full text-base font-medium text-white bg-[#415A77] hover:bg-[#1B263B] transition-colors shadow-sm">
                            {cat.name}
                        </button>
                    </Link>
                ))}
            </section>

            <section>
                {loading && <p>Memuat produk...</p>}
                {error && (
                    <p className="text-red-500 font-semibold bg-red-100 p-4 rounded-lg">
                        Error: {error}
                    </p>
                )}
                {!loading && !error && <ProductList products={products} />}
            </section>
        </div>
    );
}