<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Otorisasi sudah ditangani oleh middleware 'is.admin' di file rute,
        // jadi kita bisa langsung mengizinkan request di sini.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // Mendapatkan ID produk dari rute jika ada (ini hanya terjadi saat proses update)
        $productId = $this->route('product') ? $this->route('product')->id : null;

        return [
            // Saat CREATE: name wajib diisi.
            // Saat UPDATE: name boleh dikirim, boleh tidak (sometimes).
            'name' => 'sometimes|required|string|max:255',

            // Saat CREATE: slug tidak wajib dikirim (akan dibuat otomatis).
            // Saat UPDATE: slug juga tidak wajib, tapi jika dikirim, harus unik
            // (kecuali untuk produk dengan ID yang sedang di-update).
            'slug' => 'sometimes|string|max:255|unique:products,slug,' . $productId,
            
            'description' => 'nullable|string',

            // Aturan 'sometimes' berarti validasi ini hanya berjalan jika field-nya ada di request.
            // Ini penting untuk UPDATE, di mana admin mungkin hanya ingin mengubah stok.
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'sometimes|boolean',
        ];
    }
}

