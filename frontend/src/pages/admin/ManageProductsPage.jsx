import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductForm from '../../components/admin/ProductForm';
import { Trash2 } from 'lucide-react';
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
        return <div className="p-4 text-center">Memuat data produk...</div>;
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
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="">Semua Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                    </select>
                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-[#F07167] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        + Tambah Produk
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden flex-1">
                <table className="min-w-full text-sm">
                    <thead className="bg-[#4D809E] text-white">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                No.
                            </th>
                            <th
                                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                                onClick={() =>
                                    setSortConfig({
                                        key: 'name',
                                        direction:
                                            sortConfig.key === 'name' &&
                                            sortConfig.direction === 'asc'
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
                                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                                onClick={() =>
                                    setSortConfig({
                                        key: 'category',
                                        direction:
                                            sortConfig.key === 'category' &&
                                            sortConfig.direction === 'asc'
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
                                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                                onClick={() =>
                                    setSortConfig({
                                        key: 'price',
                                        direction:
                                            sortConfig.key === 'price' &&
                                            sortConfig.direction === 'asc'
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
                                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                                onClick={() =>
                                    setSortConfig({
                                        key: 'stock',
                                        direction:
                                            sortConfig.key === 'stock' &&
                                            sortConfig.direction === 'asc'
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
                                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                                onClick={() =>
                                    setSortConfig({
                                        key: 'is_active',
                                        direction:
                                            sortConfig.key === 'is_active' &&
                                            sortConfig.direction === 'asc'
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
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-xs">
                        {currentProducts.map((product, index) => (
                            <tr
                                key={product.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-3 py-2">
                                    {indexOfFirstProduct + index + 1}
                                </td>
                                <td className="px-3 py-2">{product.name}</td>
                                <td className="px-3 py-2">
                                    {product.category?.name || 'N/A'}
                                </td>
                                <td className="px-3 py-2">
                                    Rp{' '}
                                    {new Intl.NumberFormat('id-ID').format(
                                        product.price
                                    )}
                                </td>
                                <td className="px-3 py-2">{product.stock}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold leading-tight ${
                                            product.is_active
                                                ? 'text-green-700 bg-green-100'
                                                : 'text-red-700 bg-red-100'
                                        }
										rounded-full`}
                                    >
                                        {product.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-right flex items-center">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-[#4D809E] hover:underline mr-4"
                                    >
                                        Edit
                                    </button>
                                    
                                    {/* Toggle Status Button with Loading */}
                                    <button
                                        onClick={() => handleToggleStatus(product)}
                                        disabled={toggleLoading[product.id]}
                                        className={`hover:underline mr-4 ${
                                            product.is_active
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                        } ${
                                            toggleLoading[product.id] 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : ''
                                        }`}
                                    >
                                        {toggleLoading[product.id] ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                                {product.is_active ? 'Menonaktifkan...' : 'Mengaktifkan...'}
                                            </div>
                                        ) : (
                                            product.is_active ? 'Nonaktifkan' : 'Aktifkan'
                                        )}
                                    </button>
                                    
                                    {/* Delete Button with Loading */}
                                    <button
                                        onClick={() => handlePermanentDelete(product.id, product.name)}
                                        disabled={deleteLoading[product.id]}
                                        className={`text-red-600 ${
                                            deleteLoading[product.id] 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : ''
                                        }`}
                                        title="Hapus produk"
                                    >
                                        {deleteLoading[product.id] ? (
                                            <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="inline-block mr-1" size={16} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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