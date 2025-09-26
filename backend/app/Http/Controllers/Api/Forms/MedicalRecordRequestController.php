<?php

namespace App\Http\Controllers\Api\Forms;

use App\Application\Forms\FormSubmissionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\MedicalRecordRequestStoreRequest;
use Illuminate\Http\JsonResponse;

class MedicalRecordRequestController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(MedicalRecordRequestStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['files'] = $request->file('files', []);

        $record = $this->service->storeMedicalRecord($data);

        return response()->json([
            'data' => [
                'id' => $record->getKey(),
                'status' => $record->status,
            ],
        ], 201);
    }
}
