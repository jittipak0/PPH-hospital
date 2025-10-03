<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (User::query()->count() === 0) {
            User::factory()->create([
                'username' => 'admin',
                'name' => 'System Administrator',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'password' => Hash::make('ChangeMe123!'),
            ]);
        }
    }
}
