import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductForm from '../../components/admin/ProductForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Edit3, ToggleRight, ToggleLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

function ManageProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleLoading, setToggleLoading] = useState({});
    const [deleteLoading, setDeleteLoading] = useState({});

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { showSuccess, showError, showLoading, updateToast } = useToast();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (categoryFilter) {
                params.append('category_id', categoryFilter);
            }
            const response = await axiosClient.get('/admin/products', {
                params,
            });
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat produk. Pastikan Anda login sebagai admin.');
        } finally {
            setLoading(false);
        }
    }, [categoryFilter]);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (productData) => {
        const toastId = showLoading(
            selectedProduct ? 'Memperbarui produk...' : 'Menambah produk baru...'
        );

        try {
            if (selectedProduct) {
                await axiosClient.post(
                    `/admin/products/${selectedProduct.id}`,
                    productData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                updateToast(toastId, 'Produk berhasil diperbarui!', 'success');
            } else {
                await axiosClient.post('/admin/products', productData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                updateToast(toastId, 'Produk baru berhasil ditambahkan!', 'success');
            }
            setIsModalOpen(false);
            setSelectedProduct(null);
            await fetchProducts();
        } catch (err) {
            const errorMessages = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(' \n')
                : 'Gagal menyimpan produk. Periksa kembali data Anda.';
            updateToast(toastId, errorMessages, 'error');
        }
    };

    const handleToggleStatus = async (product) => {
        setToggleLoading(prev => ({ ...prev, [product.id]: true }));
        const toastId = showLoading(
            `${product.is_active ? 'Menonaktifkan' : 'Mengaktifkan'} produk...`
        );

        try {
            const response = await axiosClient.patch(
                `/admin/products/${product.id}/toggle-status`
            );
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.id === product.id ? response.data.product : p
                )
            );
            updateToast(
                toastId, 
                `Status produk berhasil ${product.is_active ? 'dinonaktifkan' : 'diaktifkan'}!`,
                'success'
            );
        } catch (err) {
            updateToast(toastId, 'Gagal mengubah status produk.', 'error');
        } finally {
            setToggleLoading(prev => ({ ...prev, [product.id]: false }));
        }
    };

    const handlePermanentDelete = async (productId, productName) => {
        setDeleteLoading(prev => ({ ...prev, [productId]: true }));
        const toastId = showLoading('Menghapus produk...');

        try {
            await axiosClient.delete(`/admin/products/${productId}`);
            setProducts((prevProducts) =>
                prevProducts.filter((p) => p.id !== productId)
            );
            updateToast(toastId, `Produk "${productName}" berhasil dihapus!`, 'success');
        } catch (err) {
            updateToast(toastId, 'Gagal menghapus produk.', 'error');
        } finally {
            setDeleteLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    let filteredProducts = products.filter(
        (product) =>
            product.name &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter) {
        filteredProducts = filteredProducts.filter((product) =>
            statusFilter === 'aktif' ? product.is_active : !product.is_active
        );
    }

    if (sortConfig.key) {
        filteredProducts = [...filteredProducts].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            if (sortConfig.key === 'category') {
                aValue = a.category?.name || '';
                bValue = b.category?.name || '';
            }
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (loading)
        return <LoadingSpinner text="Memuat data produk..." size="lg" className="py-12" />;
    if (error)
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">
                        Manajemen Produk
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Total Produk: {filteredProducts.length}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Cari Nama Produk..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        style={{ minWidth: 200 }}
                    />
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="">Semua Status</option>
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-[#415A77] text-white px-4 py-2 rounded-md hover:bg-[#364e60] transition-colors"
                    >
                        + Tambah Produk
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="bg-white shadow-md rounded-md overflow-hidden p-6 w-full">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] rounded-l-md">
                                        No.
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                                        onClick={() =>
                                            setSortConfig({
                                                key: 'name',
                                                direction:
                                                    sortConfig.key === 'name' &&
                                                    sortConfig.direction ===
                                                        'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }
                                    >
                                        Nama Produk{' '}
                                        {sortConfig.key === 'name'
                                            ? sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'
                                            : ''}
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                                        onClick={() =>
                                            setSortConfig({
                                                key: 'category',
                                                direction:
                                                    sortConfig.key ===
                                                        'category' &&
                                                    sortConfig.direction ===
                                                        'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }
                                    >
                                        Kategori{' '}
                                        {sortConfig.key === 'category'
                                            ? sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'
                                            : ''}
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                                        onClick={() =>
                                            setSortConfig({
                                                key: 'price',
                                                direction:
                                                    sortConfig.key ===
                                                        'price' &&
                                                    sortConfig.direction ===
                                                        'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }
                                    >
                                        Harga{' '}
                                        {sortConfig.key === 'price'
                                            ? sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'
                                            : ''}
                                    </th>
                                    <th
                                        className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                                        onClick={() =>
                                            setSortConfig({
                                                key: 'stock',
                                                direction:
                                                    sortConfig.key ===
                                                        'stock' &&
                                                    sortConfig.direction ===
                                                        'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }
                                    >
                                        Stok{' '}
                                        {sortConfig.key === 'stock'
                                            ? sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'
                                            : ''}
                                    </th>
                                    <th
                                        className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                                        onClick={() =>
                                            setSortConfig({
                                                key: 'is_active',
                                                direction:
                                                    sortConfig.key ===
                                                        'is_active' &&
                                                    sortConfig.direction ===
                                                        'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }
                                    >
                                        Status{' '}
                                        {sortConfig.key === 'is_active'
                                            ? sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'
                                            : ''}
                                    </th>
                                    <th className="px-3 py-4 text-center text-sm font-medium text-white bg-[#415A77]">
                                        Kelola Produk
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] rounded-r-md">
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-xs">
                                {currentProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 align-middle text-center">
                                            {indexOfFirstProduct + index + 1}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-left">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-left">
                                            {product.category?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-left">
                                            Rp{' '}
                                            {new Intl.NumberFormat(
                                                'id-ID'
                                            ).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-center">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-center">
                                            <span
                                                className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-md ${
                                                    product.is_active
                                                        ? 'text-green-800 bg-green-100'
                                                        : 'text-red-800 bg-red-100'
                                                }`}
                                            >
                                                <span
                                                    className={`w-2 h-2 rounded-full ${
                                                        product.is_active
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                />
                                                {product.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 align-middle text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(
                                                            product
                                                        );
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-[#4D809E] p-1 rounded hover:bg-gray-100"
                                                    aria-label="Edit produk"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            product
                                                        )
                                                    }
                                                    className={`p-1 rounded hover:bg-gray-100 ${
                                                        product.is_active
                                                            ? 'text-yellow-600'
                                                            : 'text-green-600'
                                                    }`}
                                                    aria-label={
                                                        product.is_active
                                                            ? 'Nonaktifkan produk'
                                                            : 'Aktifkan produk'
                                                    }
                                                    title={
                                                        product.is_active
                                                            ? 'Nonaktifkan'
                                                            : 'Aktifkan'
                                                    }
                                                >
                                                    {product.is_active ? (
                                                        <ToggleLeft className="w-5 h-5" />
                                                    ) : (
                                                        <ToggleRight className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 align-middle text-center">
                                            <button
                                                onClick={() =>
                                                    handlePermanentDelete(
                                                        product.id
                                                    )
                                                }
                                                className="text-red-600"
                                            >
                                                <Trash2
                                                    className="inline-block"
                                                    size={16}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center items-center mt-4 mb-4">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md disabled:opacity-50 mx-2"
                >
                    Back
                </button>
                <span className="mx-4 text-sm font-medium">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md disabled:opacity-50 mx-2"
                >
                    Next
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedProduct
                                ? 'Edit Produk'
                                : 'Tambah Produk Baru'}
                        </h2>
                        <ProductForm
                            product={selectedProduct}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedProduct(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageProductsPage;