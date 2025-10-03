<?php

namespace App\Http\Controllers;

use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request, AuthService $authService): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('AuthController@login: request received.', [
            'route' => 'api.auth.login',
            'method' => $request->method(),
        ]);

        $credentials = $request->validated();

        try {
            $result = $authService->login($credentials['username'], $credentials['password']);
        } catch (InvalidCredentialsException $exception) {
            Log::debug('AuthController@login: authentication failed.', [
                'route' => 'api.auth.login',
            ]);

            return response()->json([
                'error' => [
                    'message' => 'Authentication failed.',
                ],
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], 401);
        }

        $user = $result['user'];
        $token = $result['token'];

        Log::debug('AuthController@login: authentication succeeded.', [
            'route' => 'api.auth.login',
            'user_id' => $user->getKey(),
        ]);

        return response()->json([
            'data' => [
                'token' => [
                    'access_token' => $token->plainTextToken,
                    'token_type' => 'Bearer',
                    'abilities' => $user->abilities(),
                ],
                'user' => UserResource::make($user)->resolve($request),
            ],
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);
    }

    public function logout(Request $request, AuthService $authService): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));
        $user = $request->user();

        Log::debug('AuthController@logout: request received.', [
            'route' => 'api.auth.logout',
            'user_id' => $user?->getKey(),
        ]);

        if ($user) {
            $authService->logout($user);
        }

        return response()->json([
            'data' => [
                'success' => true,
            ],
            'meta' => [
                'request_id' => $requestId,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $requestId = Context::get('request_id', $request->attributes->get('request_id'));

        Log::debug('AuthController@me: request received.', [
            'route' => 'api.staff.me',
            'user_id' => $request->user()?->getKey(),
        ]);

        return UserResource::make($request->user())
            ->additional([
                'meta' => [
                    'request_id' => $requestId,
                ],
            ])->response();
    }
}
