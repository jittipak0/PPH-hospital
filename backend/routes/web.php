<?php

use App\Http\Controllers\Api\Forms\ArchiveRequestController;
use App\Http\Controllers\Api\Forms\DonationController;
use App\Http\Controllers\Api\Forms\FuelClaimController;
use App\Http\Controllers\Api\Forms\MedicalRecordRequestController;
use App\Http\Controllers\Api\Forms\SatisfactionSurveyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api/forms')->group(function () {
    Route::middleware('throttle:public-forms')->group(function () {
        Route::post('/medical-records', [MedicalRecordRequestController::class, 'store']);
        Route::post('/donations', [DonationController::class, 'store']);
        Route::post('/satisfaction', [SatisfactionSurveyController::class, 'store']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/fuel-claims', [FuelClaimController::class, 'store']);
        Route::post('/archive-requests', [ArchiveRequestController::class, 'store']);
    });
});
