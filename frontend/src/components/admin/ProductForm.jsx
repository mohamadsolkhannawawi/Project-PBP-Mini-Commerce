import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { getImageUrl } from '../../utils/imageUtils';

function ProductForm({ product, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        is_active: true,
    });
    const [primaryImage, setPrimaryImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Gagal memuat kategori:', error);
                setErrors({ general: 'Gagal memuat daftar kategori.' });
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
                is_active: product.is_active == 1,
            });
            setPrimaryImage(null);
            setGalleryImages([]);

            let galleryImages = [];
            if (product.galleryImages && Array.isArray(product.galleryImages)) {
                galleryImages = product.galleryImages;
            } else if (product.images && Array.isArray(product.images)) {
                galleryImages = product.images.filter((img) => !img.is_primary);
            }

            setExistingGalleryImages(galleryImages);
        } else {
            setPrimaryImage(null);
            setGalleryImages([]);
            setExistingGalleryImages([]);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePrimaryImageChange = (e) => {
        setPrimaryImage(e.target.files[0]);
    };

    const handleGalleryImagesChange = (e) => {
        setGalleryImages((prev) => [...prev, ...e.target.files]);
    };

    const handleRemoveGalleryImage = (idx) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleRemoveExistingGalleryImage = (imgId) => {
        setExistingGalleryImages((prev) =>
            prev.filter((img) => img.id !== imgId)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        for (const key in formData) {
            if (key === 'is_active') {
                data.append(key, formData[key] ? 'true' : 'false');
            } else {
                data.append(key, formData[key]);
            }
        }

        if (primaryImage) {
            data.append('primary_image', primaryImage);
        }
        if (galleryImages.length > 0) {
            galleryImages.forEach((image) => {
                data.append('gallery_images[]', image);
            });
        }
        if (product) {
            existingGalleryImages.forEach((img) => {
                data.append('keep_gallery_image_ids[]', img.id);
            });
            if (existingGalleryImages.length === 0) {
                data.append('keep_gallery_image_ids[]', '');
            }
        }

        setErrors({});

        try {
            await onSave(data);
            setPrimaryImage(null);
            setGalleryImages([]);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Terjadi kesalahan saat menyimpan produk.',
                });
                console.error(error);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto"
        >
            {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">
                            Nama Produk
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600">
                                Harga
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.price[0]}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">
                                Stok
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                            {errors.stock && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.stock[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600">
                            Kategori
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category_id[0]}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">
                            Primary Image / Thumbnail
                        </label>
                        <input
                            type="file"
                            name="primary_image"
                            onChange={handlePrimaryImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                        />
                        {primaryImage ? (
                            <img
                                src={URL.createObjectURL(primaryImage)}
                                alt="Primary Preview"
                                className="mt-2 w-32 h-32 object-cover rounded border"
                            />
                        ) : product?.primary_image ? (
                            <img
                                src={getImageUrl(product.primary_image)}
                                alt="Primary"
                                className="mt-2 w-32 h-32 object-cover rounded border"
                            />
                        ) : null}
                        {errors.primary_image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.primary_image[0]}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600">
                            Gallery Images
                        </label>
                        <input
                            type="file"
                            name="gallery_images"
                            onChange={handleGalleryImagesChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                            multiple
                        />

                        {existingGalleryImages.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">
                                    Gambar Gallery yang ada:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {existingGalleryImages.map((img, idx) => (
                                        <div
                                            key={img.id || idx}
                                            className="relative group"
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`Existing Gallery ${
                                                    idx + 1
                                                }`}
                                                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveExistingGalleryImage(
                                                        img.id
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg transition-colors"
                                                title="Hapus gambar ini"
                                            >
                                                ×
                                            </button>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {galleryImages.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">
                                    Gambar baru yang akan ditambahkan:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group"
                                        >
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`New Gallery Preview ${
                                                    idx + 1
                                                }`}
                                                className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveGalleryImage(
                                                        idx
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg transition-colors"
                                                title="Hapus gambar ini"
                                            >
                                                ×
                                            </button>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {errors.gallery_images && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.gallery_images[0]}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Aktifkan Produk
                        </label>
                    </div>
                    {errors.is_active && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.is_active[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}

export default ProductForm;