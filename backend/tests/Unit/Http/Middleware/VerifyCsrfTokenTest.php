<?php

namespace Tests\Unit\Http\Middleware;

use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class VerifyCsrfTokenTest extends TestCase
{
    public function test_tokens_match_fails_without_ajax_header(): void
    {
        Session::start();
        $token = Session::token();

        $middleware = new class(app(), app('encrypter')) extends VerifyCsrfToken
        {
            public function check(Request $request): bool
            {
                return parent::tokensMatch($request);
            }
        };

        $request = Request::create('/forms', 'POST');
        $request->setLaravelSession(Session::driver());
        $request->headers->set('X-CSRF-TOKEN', $token);

        $this->assertFalse($middleware->check($request));
    }

    public function test_tokens_match_passes_with_ajax_header(): void
    {
        Session::start();
        $token = Session::token();

        $middleware = new class(app(), app('encrypter')) extends VerifyCsrfToken
        {
            public function check(Request $request): bool
            {
                return parent::tokensMatch($request);
            }
        };

        $request = Request::create('/forms', 'POST');
        $request->setLaravelSession(Session::driver());
        $request->headers->set('X-CSRF-TOKEN', $token);
        $request->headers->set('X-Requested-With', 'XMLHttpRequest');

        $this->assertTrue($middleware->check($request));
    }
}
