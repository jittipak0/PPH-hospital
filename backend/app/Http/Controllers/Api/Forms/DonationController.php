<?php

namespace App\Http\Controllers\Api\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forms\DonationFormRequest;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    public function store(DonationFormRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $donation = Donation::create([
            'donor_name' => $validated['donor_name'],
            'amount' => $validated['amount'],
            'channel' => $validated['channel'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'note' => $validated['note'] ?? null,
            'reference_code' => $this->generateReferenceCode(),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
        ]);

        return response()->json([
            'ok' => true,
            'id' => (string) $donation->getKey(),
            'message' => 'ขอบคุณสำหรับการบริจาค ทีมงานจะติดต่อยืนยันและออกใบเสร็จภายใน 7 วันทำการ',
        ], 201);
    }

    private function generateReferenceCode(): string
    {
        do {
            $code = 'DN-' . Str::upper(Str::random(8));
        } while (Donation::where('reference_code', $code)->exists());

        return $code;
    }
}
