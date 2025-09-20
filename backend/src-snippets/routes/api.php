<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\AuthController;

Route::get('/health', fn()=>response()->json(['ok'=>true]));
Route::get('/news', [NewsController::class, 'index']);

// Auth (basic token via Sanctum suggested; endpoints stubbed)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Staff scope
Route::middleware('auth:sanctum')->prefix('staff')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/news', [NewsController::class, 'staffIndex']);
    Route::post('/news', [NewsController::class, 'store'])->middleware('ability:admin,staff');
    Route::put('/news/{id}', [NewsController::class, 'update'])->middleware('ability:admin,staff');
    Route::delete('/news/{id}', [NewsController::class, 'destroy'])->middleware('ability:admin');
});
