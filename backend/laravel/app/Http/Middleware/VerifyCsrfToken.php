<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var list<string>
     */
    protected $except = [
        'sanctum/csrf-cookie',
    ];

    protected function tokensMatch($request): bool
    {
        if (! $this->isReading($request) && ! app()->runningUnitTests()) {
            $requestedWith = $request->headers->get('X-Requested-With');

            if (strcasecmp((string) $requestedWith, 'XMLHttpRequest') !== 0) {
                Log::debug('CSRF token rejected due to missing X-Requested-With header.', [
                    'route' => optional($request->route())->getName(),
                    'method' => $request->method(),
                ]);

                return false;
            }
        }

        return parent::tokensMatch($request);
    }
}
