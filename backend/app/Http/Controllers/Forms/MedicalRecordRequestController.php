<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\MedicalRecordRequestFormRequest;
use App\Http\Resources\Forms\MedicalRecordRequestResource;
use App\Services\Forms\FormSubmissionService;
use Illuminate\Http\JsonResponse;

class MedicalRecordRequestController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(MedicalRecordRequestFormRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $file = $request->file('idcard_file');

        $record = $this->service->createMedicalRecordRequest($validated, $file);

        return (new MedicalRecordRequestResource($record))->response()->setStatusCode(201);
    }
}
