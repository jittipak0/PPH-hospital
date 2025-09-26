<?php

namespace App\Http\Controllers\Api\Forms;

use App\Application\Forms\FormSubmissionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\DonationStoreRequest;
use Illuminate\Http\JsonResponse;

class DonationController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(DonationStoreRequest $request): JsonResponse
    {
        $donation = $this->service->storeDonation($request->validated());

        return response()->json([
            'data' => [
                'id' => $donation->getKey(),
                'status' => $donation->status,
            ],
        ], 201);
    }
}
