<?php

namespace App\Http\Controllers\Api\Programs;

use App\Http\Controllers\Controller;
use App\Http\Requests\Programs\HealthRiderApplicationRequest;
use App\Models\HealthRiderApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class HealthRiderController extends Controller
{
    public function apply(HealthRiderApplicationRequest $request): JsonResponse
    {
        Log::debug('Health Rider application received', [
            'ip_address' => $request->ip(),
        ]);

        $application = HealthRiderApplication::create([
            'full_name' => $request->input('full_name'),
            'hn' => $request->input('hn'),
            'address' => $request->input('address'),
            'district' => $request->input('district'),
            'province' => $request->input('province'),
            'zipcode' => $request->input('zipcode'),
            'phone' => $request->input('phone'),
            'line_id' => $request->input('line_id'),
            'consent' => (bool) $request->boolean('consent'),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
        ]);

        Log::debug('Persisted Health Rider application', [
            'hn' => $application->hn,
            'consent' => (bool) $application->consent,
        ]);

        Log::debug('Health Rider application stored', [
            'application_id' => (string) $application->getKey(),
            'ip_address' => $application->ip_address,
            'consent' => (bool) $application->consent,
        ]);

        return response()->json([
            'ok' => true,
            'id' => (string) $application->getKey(),
            'message' => 'รับข้อมูลเรียบร้อย ทีม Health Rider จะติดต่อยืนยันภายใน 24 ชั่วโมงทำการ',
        ], 201);
    }
}
