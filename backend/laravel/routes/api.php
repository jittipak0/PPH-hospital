<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Forms\DonationController;
use App\Http\Controllers\Forms\HealthRiderApplicationController;
use App\Http\Controllers\Forms\MedicalRecordRequestController;
use App\Http\Controllers\Forms\SatisfactionSurveyController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\Staff\NewsController as StaffNewsController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public-api')
    ->get('/health', HealthController::class)
    ->name('api.health');

Route::middleware('throttle:public-api')
    ->get('/news', [NewsController::class, 'index'])
    ->name('api.news.index');

Route::middleware('throttle:public-api')
    ->get('/security/csrf-token', [SecurityController::class, 'csrfToken'])
    ->name('api.security.csrf-token');

Route::middleware(['throttle:public-api', 'api.csrf'])->group(function () {
    Route::post('forms/medical-record-request', [MedicalRecordRequestController::class, 'store'])
        ->name('api.forms.medical-record-request');

    Route::post('forms/donation', [DonationController::class, 'store'])
        ->name('api.forms.donation');

    Route::post('forms/satisfaction', [SatisfactionSurveyController::class, 'store'])
        ->name('api.forms.satisfaction');

    Route::post('programs/health-rider/apply', [HealthRiderApplicationController::class, 'store'])
        ->name('api.programs.health-rider.apply');
});

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
