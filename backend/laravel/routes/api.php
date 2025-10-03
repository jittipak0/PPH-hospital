<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/health', function (Request $request) {
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
