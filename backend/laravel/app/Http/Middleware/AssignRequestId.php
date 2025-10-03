<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AssignRequestId
{
    public function handle(Request $request, Closure $next): Response
    {
        $provided = $request->headers->get('X-Request-Id');
        $requestId = $this->sanitizeRequestId($provided) ?: (string) Str::orderedUuid();

        $request->attributes->set('request_id', $requestId);

        Context::add([
            'request_id' => $requestId,
            'ip' => $request->ip(),
            'user_agent' => $this->truncateUserAgent($request->userAgent()),
        ]);

        if ($user = $request->user()) {
            Context::add(['user_id' => $user->getAuthIdentifier()]);
        }

        Log::withContext([
            'request_id' => $requestId,
            'ip' => $request->ip(),
        ]);

        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        $response->headers->set('X-Request-Id', $requestId);

        return $response;
    }

    protected function sanitizeRequestId(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $value = trim($value);

        if ($value === '') {
            return null;
        }

        return Str::limit(preg_replace('/[^A-Za-z0-9\-_.]/', '', $value) ?? '', 64, '');
    }

    protected function truncateUserAgent(?string $userAgent): ?string
    {
        if ($userAgent === null) {
            return null;
        }

        return Str::limit($userAgent, 255, '');
    }
}
