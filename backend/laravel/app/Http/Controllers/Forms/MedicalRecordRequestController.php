<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\MedicalRecordRequestStoreRequest;
use App\Http\Resources\Forms\MedicalRecordRequestResource;
use App\Services\Forms\MedicalRecordRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class MedicalRecordRequestController extends Controller
{
    public function store(MedicalRecordRequestStoreRequest $request, MedicalRecordRequestService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('MedicalRecordRequestController@store: request received.', [
            'route' => 'api.forms.medical-record-request',
        ]);

        Log::debug('MedicalRecordRequestController@store: validating request.', [
            'route' => 'api.forms.medical-record-request',
        ]);

        $validated = $request->validated();

        Log::debug('MedicalRecordRequestController@store: validation passed.', [
            'route' => 'api.forms.medical-record-request',
            'fields' => array_keys($validated),
        ]);

        Log::debug('MedicalRecordRequestController@store: calling service.', [
            'route' => 'api.forms.medical-record-request',
        ]);

        $record = $service->submit(
            $validated,
            (string) $request->getClientIp(),
            $request->userAgent(),
        );

        Log::debug('MedicalRecordRequestController@store: serializing response.', [
            'route' => 'api.forms.medical-record-request',
            'record_id' => $record->getKey(),
        ]);

        $resource = MedicalRecordRequestResource::make($record)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response()->setStatusCode(201);

        Log::debug('MedicalRecordRequestController@store: response ready.', [
            'route' => 'api.forms.medical-record-request',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
