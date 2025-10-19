<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\ProductImage;

class CleanupProductImages extends Command
{
    protected $signature = 'app:cleanup-product-images'; // artisan command signature
    protected $description = 'Remove orphaned product images from storage that are no longer in the database.';

    public function handle()
    {
        $this->info('Starting cleanup of orphaned product images...');

        // Define the location of images on the 'public' disk.
        $imageFolderOnDisk = 'products';
        $imageStoragePath = storage_path('app/public/' . $imageFolderOnDisk);

        // 1. Get all image filenames from the database.
        $dbImages = ProductImage::pluck('image_path')->map(function ($path) { // only keep filenames
            return basename($path);
        })->toArray();
        $this->info(count($dbImages) . ' images found in the database.');

        // 2. Get all files from the storage directory using the File facade to ignore .gitignore.
        if (!File::isDirectory($imageStoragePath)) {
            $this->error("The directory does not exist: {$imageStoragePath}");
            return;
        }
    $diskFilenames = array_map(fn($file) => $file->getFilename(), File::files($imageStoragePath)); // ignore .gitignore with File::files
        $this->info(count($diskFilenames) . ' image files found on the disk.');

        // 3. Find orphaned files.
        $orphanedFilenames = array_diff($diskFilenames, $dbImages);

        if (count($orphanedFilenames) === 0) {
            $this->info('No orphaned images to clean up. Everything is in sync!');
            return;
        }

        $this->warn(count($orphanedFilenames) . ' orphaned images will be deleted.');

        if (!$this->confirm('Do you wish to proceed with the deletion?')) {
            $this->info('Cleanup cancelled by user.');
            return;
        }

        $progressBar = $this->output->createProgressBar(count($orphanedFilenames));
        $progressBar->start();
        $deletedCount = 0;
        $failedFiles = [];

        foreach ($orphanedFilenames as $orphan) {
            $pathToDelete = $imageFolderOnDisk . '/' . $orphan;
            
            // IMPORTANT: Explicitly use the 'public' disk for deletion.
            if (Storage::disk('public')->delete($pathToDelete)) {
                $deletedCount++;
            } else {
                $failedFiles[] = $pathToDelete;
            }
            $progressBar->advance();
        }

        $progressBar->finish();

        $this->info("\nCleanup complete.");
        $this->info($deletedCount . ' orphaned images have been deleted.');

        if (count($failedFiles) > 0) {
            $this->error(count($failedFiles) . ' files failed to delete. This is likely a file permission issue.');
            $this->warn('Failed to delete:');
            foreach ($failedFiles as $failure) {
                $this->line('- ' . $failure);
            }
        }
    }
}

// backend\app\Console\Commands\CleanupProductImages.php
// To run the command, use:
// php artisan app:cleanup-product-images
// Make sure to register the command in app/Console/Kernel.php
// protected $commands = [
//     Commands\CleanupProductImages::class,
// ];

// Make sure run this command:
// php artisan storage:link
// to create a symbolic link from "public/storage" to "storage/app/public"