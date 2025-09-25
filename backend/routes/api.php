<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]));
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
