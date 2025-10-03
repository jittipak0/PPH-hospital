<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\DonationFormStoreRequest;
use App\Http\Resources\Forms\DonationResource;
use App\Services\Forms\DonationFormService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
    public function store(DonationFormStoreRequest $request, DonationFormService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('DonationController@store: request received.', [
            'route' => 'api.forms.donation',
        ]);

        Log::debug('DonationController@store: validating request.', [
            'route' => 'api.forms.donation',
        ]);

        $validated = $request->validated();

        Log::debug('DonationController@store: validation passed.', [
            'route' => 'api.forms.donation',
            'fields' => array_keys($validated),
        ]);

        Log::debug('DonationController@store: calling service.', [
            'route' => 'api.forms.donation',
        ]);

        $donation = $service->submit(
            $validated,
            (string) $request->getClientIp(),
            $request->userAgent(),
        );

        Log::debug('DonationController@store: serializing response.', [
            'route' => 'api.forms.donation',
            'donation_id' => $donation->getKey(),
            'reference_code' => $donation->reference_code,
        ]);

        $resource = DonationResource::make($donation)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response()->setStatusCode(201);

        Log::debug('DonationController@store: response ready.', [
            'route' => 'api.forms.donation',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
