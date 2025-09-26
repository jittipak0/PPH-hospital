<?php

namespace App\Http\Controllers\Api\Forms;

use App\Application\Forms\FormSubmissionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\FuelClaimStoreRequest;
use Illuminate\Http\JsonResponse;

class FuelClaimController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(FuelClaimStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['receipt'] = $request->file('receipt');

        $claim = $this->service->storeFuelClaim($data);

        return response()->json([
            'data' => [
                'id' => $claim->getKey(),
                'status' => $claim->status,
            ],
        ], 201);
    }
}
