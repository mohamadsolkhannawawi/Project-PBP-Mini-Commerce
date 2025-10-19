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
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'nullable|in:true,false', // Accept string values; converted in controller
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        // Primary image required only on creation (POST without route-model binding)
        if ($this->isMethod('post') && !$this->route('product')) {
            $rules['primary_image'] = 'required|image|mimes:jpeg,png,jpg,gif|max:2048';
        } else {
            $rules['primary_image'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
        }
        return $rules;
    }
}

// backend\app\Http\Requests\StoreProductRequest.php
