<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public-api')->get('/health', function (Request $request) {
    $requestId = Context::get('request_id', $request->attributes->get('request_id'));

    Log::debug('Health check requested.', [
        'route' => 'api.health',
        'method' => $request->method(),
    ]);

    return response()->json([
        'ok' => true,
        'request_id' => $requestId,
    ]);
})->name('api.health');

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
