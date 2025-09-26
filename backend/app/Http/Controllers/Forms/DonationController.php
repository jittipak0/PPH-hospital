<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\DonationFormRequest;
use App\Http\Resources\Forms\DonationSubmissionResource;
use App\Services\Forms\FormSubmissionService;
use Illuminate\Http\JsonResponse;

class DonationController extends Controller
{
    public function __construct(private readonly FormSubmissionService $service)
    {
    }

    public function store(DonationFormRequest $request): JsonResponse
    {
        $donation = $this->service->createDonation($request->validated());

        return (new DonationSubmissionResource($donation))->response()->setStatusCode(201);
    }
}
