<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\Staff\NewsController as StaffNewsController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public-api')
    ->get('/health', HealthController::class)
    ->name('api.health');

Route::middleware('throttle:public-api')
    ->get('/news', [NewsController::class, 'index'])
    ->name('api.news.index');

Route::prefix('auth')->name('api.auth.')->group(function () {
    Route::post('login', [AuthController::class, 'login'])
        ->middleware(['throttle:auth-login', 'api.csrf'])
        ->name('login');

    Route::middleware(['auth:sanctum', 'throttle:staff-api', 'api.csrf'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    });
});

Route::middleware(['auth:sanctum', 'throttle:staff-api'])
    ->get('staff/me', [AuthController::class, 'me'])
    ->name('api.staff.me');

Route::prefix('staff')->middleware(['auth:sanctum', 'throttle:staff-api'])->group(function () {
    Route::get('news', [StaffNewsController::class, 'index'])
        ->middleware('abilities:staff')
        ->name('api.staff.news.index');

    Route::post('news', [StaffNewsController::class, 'store'])
        ->middleware(['abilities:admin', 'api.csrf'])
        ->name('api.staff.news.store');

    Route::put('news/{news}', [StaffNewsController::class, 'update'])
        ->middleware(['abilities:admin', 'api.csrf'])
        ->name('api.staff.news.update');

    Route::delete('news/{news}', [StaffNewsController::class, 'destroy'])
        ->middleware(['abilities:admin', 'api.csrf'])
        ->name('api.staff.news.destroy');
});
