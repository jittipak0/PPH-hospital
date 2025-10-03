<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\HealthRiderApplicationStoreRequest;
use App\Http\Resources\Forms\HealthRiderApplicationResource;
use App\Services\Forms\HealthRiderApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class HealthRiderApplicationController extends Controller
{
    public function store(HealthRiderApplicationStoreRequest $request, HealthRiderApplicationService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('HealthRiderApplicationController@store: request received.', [
            'route' => 'api.programs.health-rider.apply',
        ]);

        Log::debug('HealthRiderApplicationController@store: validating request.', [
            'route' => 'api.programs.health-rider.apply',
        ]);

        $validated = $request->validated();

        Log::debug('HealthRiderApplicationController@store: validation passed.', [
            'route' => 'api.programs.health-rider.apply',
            'fields' => array_keys($validated),
        ]);

        Log::debug('HealthRiderApplicationController@store: calling service.', [
            'route' => 'api.programs.health-rider.apply',
        ]);

        $application = $service->submit(
            $validated,
            (string) $request->getClientIp(),
            $request->userAgent(),
        );

        Log::debug('HealthRiderApplicationController@store: serializing response.', [
            'route' => 'api.programs.health-rider.apply',
            'application_id' => $application->getKey(),
        ]);

        $resource = HealthRiderApplicationResource::make($application)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response()->setStatusCode(201);

        Log::debug('HealthRiderApplicationController@store: response ready.', [
            'route' => 'api.programs.health-rider.apply',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
