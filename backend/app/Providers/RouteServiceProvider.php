<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for('public-api', function (Request $request) {
            $max = (int) env('RATE_LIMIT_PUBLIC', 60);

            return Limit::perMinute($max)->by($request->ip() ?: 'guest');
        });

        RateLimiter::for('staff-api', function (Request $request) {
            $max = (int) env('RATE_LIMIT_STAFF', 120);
            $key = $request->user()?->getAuthIdentifier() ?: $request->ip();

            return Limit::perMinute($max)->by((string) $key);
        });

        RateLimiter::for('auth-login', function (Request $request) {
            $attempts = (int) env('RATE_LIMIT_AUTH_LOGIN_ATTEMPTS', 20);
            $decay = (int) env('RATE_LIMIT_AUTH_LOGIN_DECAY', 5);
            $key = sprintf('%s|%s', $request->ip(), $request->input('username'));

            return Limit::perMinutes($decay, $attempts)->by(hash('sha256', $key.config('app.key')));
        });
    }
}
