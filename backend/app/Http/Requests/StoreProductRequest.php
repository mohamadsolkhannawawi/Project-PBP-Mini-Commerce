<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product') ? $this->route('product')->id : null;

        if ($this->isMethod('post')) {
            // Aturan untuk CREATE
            return [
                'name'        => 'required|string|max:255',
                'slug'        => 'nullable|string|max:255|unique:products,slug',
                'description' => 'nullable|string',
                'price'       => 'required|numeric|min:0',
                'stock'       => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,id',
                'image_url'   => 'nullable|string|max:500',
                'is_active'   => 'sometimes|boolean', // <- pastikan boolean
            ];
        } else {
            // Aturan untuk UPDATE
            return [
                'name'        => 'sometimes|required|string|max:255',
                'slug'        => 'sometimes|string|max:255|unique:products,slug,' . $productId,
                'description' => 'nullable|string',
                'price'       => 'sometimes|required|numeric|min:0',
                'stock'       => 'sometimes|required|integer|min:0',
                'category_id' => 'sometimes|required|exists:categories,id',
                'image_url'   => 'nullable|string|max:500',
                'is_active'   => 'sometimes|boolean', // <- tetap boolean
            ];
        }
    }
}
