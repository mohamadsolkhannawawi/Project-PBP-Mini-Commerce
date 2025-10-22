<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Seeder for default users (admin and regular)
class UserSeeder extends Seeder
{
    public function run(): void // create admin and multiple users
    {
        // admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        // ensure a persistent test user exists (do not remove) for manual testing
        // use updateOrCreate so the password and role are set even if the user already exists
        User::updateOrCreate([
            'email' => 'user@example.com',
        ], [
            'name' => 'Regular User',
            'password' => Hash::make('Password123!'),
            'role' => 'user',
        ]);

        // create 18 additional regular users (admin + test user + 18 = 20 total)
        \App\Models\User::factory()->count(18)->create()->each(function ($user, $index) {
            $user->role = 'user';
            $user->save();
        });
    }
}

// backend\database\seeders\UserSeeder.php