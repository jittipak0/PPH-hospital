<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\SatisfactionSurveyStoreRequest;
use App\Http\Resources\Forms\SatisfactionSurveyResource;
use App\Services\Forms\SatisfactionSurveyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class SatisfactionSurveyController extends Controller
{
    public function store(SatisfactionSurveyStoreRequest $request, SatisfactionSurveyService $service): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('SatisfactionSurveyController@store: request received.', [
            'route' => 'api.forms.satisfaction',
        ]);

        Log::debug('SatisfactionSurveyController@store: validating request.', [
            'route' => 'api.forms.satisfaction',
        ]);

        $validated = $request->validated();

        Log::debug('SatisfactionSurveyController@store: validation passed.', [
            'route' => 'api.forms.satisfaction',
            'fields' => array_keys($validated),
        ]);

        Log::debug('SatisfactionSurveyController@store: calling service.', [
            'route' => 'api.forms.satisfaction',
        ]);

        $survey = $service->submit(
            $validated,
            (string) $request->getClientIp(),
            $request->userAgent(),
        );

        Log::debug('SatisfactionSurveyController@store: serializing response.', [
            'route' => 'api.forms.satisfaction',
            'survey_id' => $survey->getKey(),
        ]);

        $resource = SatisfactionSurveyResource::make($survey)->additional([
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        $response = $resource->response()->setStatusCode(201);

        Log::debug('SatisfactionSurveyController@store: response ready.', [
            'route' => 'api.forms.satisfaction',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
