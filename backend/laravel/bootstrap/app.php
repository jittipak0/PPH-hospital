<?php

use App\Http\Middleware\AssignRequestId;
use App\Http\Middleware\VerifyCsrfToken;
use App\Providers\AppServiceProvider;
use App\Providers\DatastoreServiceProvider;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;

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
        ]);
    })
    ->withProviders([
        AppServiceProvider::class,
        DatastoreServiceProvider::class,
        RouteServiceProvider::class,
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
