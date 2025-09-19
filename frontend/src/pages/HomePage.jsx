import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import axiosClient from '../api/axiosClient'; // Impor klien API kita

function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/products');
                setProducts(response.data);
                setError(null);
            } catch (err) {
                let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';
                if (err.response) {
                    errorMessage = `Error ${err.response.status}: ${
                        err.response.data.message ||
                        'Server tidak memberikan pesan detail.'
                    }`;
                } else if (err.request) {
                    errorMessage =
                        'Tidak dapat terhubung ke server. Pastikan server backend berjalan dan konfigurasi CORS sudah benar.';
                } else {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                console.error('Detail Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <section className="bg-blue-600 text-white rounded-lg p-8 md:p-12 mb-8 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-6">
                    Koleksi Terbaru Telah Tiba
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl">
                    Jelajahi gadget dan elektronik terbaik dengan penawaran
                    eksklusif yang tidak akan Anda temukan di tempat lain.
                </p>
                <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                    Belanja Sekarang
                </button>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Produk Unggulan
                </h2>
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

export default HomePage;
