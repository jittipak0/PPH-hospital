<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the administrator account configured via environment variables.
     */
    public function run(): void
    {
        $username = env('ADMIN_INITIAL_USERNAME', 'admin');
        $name = env('ADMIN_INITIAL_NAME', 'System Administrator');
        $email = env('ADMIN_INITIAL_EMAIL', 'admin@example.com');
        $password = env('ADMIN_INITIAL_PASSWORD', 'ChangeMe123!');

        if (empty($password)) {
            Log::warning('Admin seeder skipped because ADMIN_INITIAL_PASSWORD is empty.');

            return;
        }

        $user = User::query()->firstOrNew(['username' => $username]);
        $user->fill([
            'name' => $name,
            'email' => $email,
            'role' => 'admin',
        ]);
        $user->password = Hash::make($password);

        $user->save();

        Log::info('Admin user seeded.', [
            'user_id' => $user->getKey(),
            'username_hash' => hash('sha256', $username.(string) config('app.key')),
        ]);
    }
}
