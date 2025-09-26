<?php

use App\Http\Controllers\Forms\DonationController;
use App\Http\Controllers\Forms\MedicalRecordRequestController;
use App\Http\Controllers\Forms\SatisfactionSurveyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]));

Route::prefix('forms')->group(function (): void {
    Route::post('/medical-record-request', [MedicalRecordRequestController::class, 'store']);
    Route::post('/donation', [DonationController::class, 'store']);
    Route::post('/satisfaction', [SatisfactionSurveyController::class, 'store']);
});
