<?php

namespace App\Http\Controllers\Api\Forms;

use App\Application\Forms\FormSubmissionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\SatisfactionSurveyStoreRequest;
use Illuminate\Http\JsonResponse;

class SatisfactionSurveyController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(SatisfactionSurveyStoreRequest $request): JsonResponse
    {
        $survey = $this->service->storeSatisfactionSurvey($request->validated());

        return response()->json([
            'data' => [
                'id' => $survey->getKey(),
                'channel' => $survey->channel,
            ],
        ], 201);
    }
}
