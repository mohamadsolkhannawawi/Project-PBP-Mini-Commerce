<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'image_url')) {
                $table->renameColumn('image_url', 'image_path');
            }
            if (!Schema::hasColumn('product_images', 'is_primary')) {
                $table->boolean('is_primary')->default(false)->after('id');
            }
            if (Schema::hasColumn('product_images', 'alt_text')) {
                $table->dropColumn('alt_text');
            }
            if (Schema::hasColumn('product_images', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'image_path')) {
                $table->renameColumn('image_path', 'image_url');
            }
            if (Schema::hasColumn('product_images', 'is_primary')) {
                $table->dropColumn('is_primary');
            }
            $table->string('alt_text')->nullable();
            $table->integer('sort_order')->nullable();
        });
    }
};
