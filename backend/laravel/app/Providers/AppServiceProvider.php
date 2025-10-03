<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        config([
            'auth.token_abilities' => [
                'viewer' => 'Access public and read-only endpoints.',
                'staff' => 'Manage staff-protected resources.',
                'admin' => 'Perform administrative operations.',
            ],
            'auth.default_token_abilities' => ['viewer'],
        ]);

        Log::debug('Sanctum token abilities configured.', config('auth.token_abilities'));
    }
}
