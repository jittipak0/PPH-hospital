<?php

use App\Http\Middleware\AssignRequestId;
use App\Http\Middleware\VerifyCsrfToken;
use App\Providers\AppServiceProvider;
use App\Providers\DatastoreServiceProvider;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Context;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('api', [
            AssignRequestId::class,
            StartSession::class,
        ]);

        $middleware->alias([
            'request.id' => AssignRequestId::class,
            'api.csrf' => VerifyCsrfToken::class,
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
        ]);
    })
    ->withProviders([
        AppServiceProvider::class,
        DatastoreServiceProvider::class,
        RouteServiceProvider::class,
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $exception, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            $requestId = Context::get('request_id', $request->attributes->get('request_id'));

            return response()->json([
                'error' => [
                    'code' => 'AUTH_UNAUTHENTICATED',
                    'message' => 'Unauthenticated.',
                ],
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], 401);
        });

        $exceptions->render(function (ValidationException $exception, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            $requestId = Context::get('request_id', $request->attributes->get('request_id'));

            return response()->json([
                'message' => $exception->getMessage(),
                'errors' => $exception->errors(),
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], $exception->status);
        });

        $exceptions->render(function (HttpExceptionInterface $exception, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            $requestId = Context::get('request_id', $request->attributes->get('request_id'));

            return response()->json([
                'error' => [
                    'code' => $exception->getStatusCode(),
                    'message' => $exception->getMessage() ?: 'Http Error',
                ],
                'meta' => [
                    'request_id' => $requestId,
                ],
            ], $exception->getStatusCode(), $exception->getHeaders());
        });
    })->create();
