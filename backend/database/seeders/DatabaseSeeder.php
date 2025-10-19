<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// Main database seeder, calls all other seeders
class DatabaseSeeder extends Seeder
{
    public function run(): void // call all seeders
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}

// backend\database\seeders\DatabaseSeeder.php