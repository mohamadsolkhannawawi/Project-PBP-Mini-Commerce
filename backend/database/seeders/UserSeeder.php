<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Seeder for default users (admin and regular)
class UserSeeder extends Seeder
{
    public function run(): void // create admin and user
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'user',
        ]);
    }
}

// backend\database\seeders\UserSeeder.php