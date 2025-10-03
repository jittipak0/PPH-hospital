<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class SecurityController extends Controller
{
    public function csrfToken(Request $request): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('SecurityController@csrfToken: request received.', [
            'route' => 'api.security.csrf-token',
        ]);

        $request->session()->regenerateToken();
        $token = $request->session()->token();

        Log::debug('SecurityController@csrfToken: token issued.', [
            'route' => 'api.security.csrf-token',
        ]);

        $response = response()->json([
            'data' => [
                'csrf_token' => $token,
            ],
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);

        Log::debug('SecurityController@csrfToken: response ready.', [
            'route' => 'api.security.csrf-token',
            'status' => $response->status(),
        ]);

        return $response;
    }
}
