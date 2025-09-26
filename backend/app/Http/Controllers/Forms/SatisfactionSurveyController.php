<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\SatisfactionSurveyFormRequest;
use App\Http\Resources\Forms\SatisfactionSurveyResource;
use App\Services\Forms\FormSubmissionService;
use Illuminate\Http\JsonResponse;

class SatisfactionSurveyController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(SatisfactionSurveyFormRequest $request): JsonResponse
    {
        $survey = $this->service->createSatisfactionSurvey($request->validated());

        return (new SatisfactionSurveyResource($survey))->response()->setStatusCode(201);
    }
}
