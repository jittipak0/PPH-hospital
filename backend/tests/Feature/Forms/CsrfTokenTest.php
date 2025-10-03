<?php

namespace Tests\Feature\Forms;

use Illuminate\Support\Str;
use Tests\TestCase;

class CsrfTokenTest extends TestCase
{
    public function test_it_returns_a_csrf_token_and_sets_cookie(): void
    {
        $response = $this->getJson('/api/security/csrf-token');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => ['csrf_token'],
            'meta' => ['request_id'],
        ]);

        $token = $response->json('data.csrf_token');
        $this->assertIsString($token);
        $this->assertTrue(Str::length($token) > 20);

        $this->assertNotEmpty($response->headers->getCookies());
    }
}
