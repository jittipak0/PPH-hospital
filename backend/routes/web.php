<?php

use App\Http\Controllers\Api\Forms\DonationController;
use App\Http\Controllers\Api\Forms\MedicalRecordRequestController;
use App\Http\Controllers\Api\Forms\SatisfactionSurveyController;
use App\Http\Controllers\Api\Programs\HealthRiderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->middleware(['web'])->group(function () {
    Route::get('/security/csrf-token', static fn (Request $request) => response()->json([
        'csrfToken' => csrf_token(),
    ]));

    Route::prefix('forms')->group(function () {
        Route::post('/medical-record-request', [MedicalRecordRequestController::class, 'store'])
            ->middleware('throttle:public-forms');
        Route::post('/donation', [DonationController::class, 'store'])
            ->middleware('throttle:public-forms');
        Route::post('/satisfaction', [SatisfactionSurveyController::class, 'store'])
            ->middleware('throttle:public-forms');
    });

    Route::prefix('programs')->group(function () {
        Route::post('/health-rider/apply', [HealthRiderController::class, 'apply'])
            ->middleware('throttle:public-forms');
    });
});
