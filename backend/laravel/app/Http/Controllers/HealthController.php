<?php

namespace App\Http\Controllers;

use App\Http\Resources\HealthStatusResource;
use App\Services\Health\HealthCheckService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class HealthController extends Controller
{
    public function __invoke(Request $request, HealthCheckService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('HealthController: request received.', [
            'route' => 'api.health',
            'method' => $request->method(),
        ]);

        Log::debug('HealthController: invoking health check service.', [
            'route' => 'api.health',
        ]);

        $status = $service->check();

        Log::debug('HealthController: health check completed.', [
            'route' => 'api.health',
            'overall_ok' => $status['ok'],
        ]);

        return HealthStatusResource::make($status)->additional([
            'meta' => [
                'request_id' => $requestId,
                'timestamp' => now()->toIso8601String(),
            ],
        ])->response();
    }
}
