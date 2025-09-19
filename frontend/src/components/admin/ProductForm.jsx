import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function ProductForm({ product, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: '',
        is_active: true,
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Gagal memuat kategori:', error);
                setError('Gagal memuat daftar kategori.');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                category_id: product.category_id || '',
                image_url: product.image_url || '',
                is_active: product.is_active,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Nama Produk
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Deskripsi
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Harga
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Stok
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Kategori
                </label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    URL Gambar
                </label>
                <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                    Aktifkan Produk
                </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
