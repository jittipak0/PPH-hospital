<?php

namespace App\Http\Controllers\Api\Forms;

use App\Application\Forms\FormSubmissionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ArchiveRequestStoreRequest;
use Illuminate\Http\JsonResponse;

class ArchiveRequestController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(ArchiveRequestStoreRequest $request): JsonResponse
    {
        $archiveRequest = $this->service->storeArchiveRequest($request->validated());

        return response()->json([
            'data' => [
                'id' => $archiveRequest->getKey(),
                'status' => $archiveRequest->status,
            ],
        ], 201);
    }
}
