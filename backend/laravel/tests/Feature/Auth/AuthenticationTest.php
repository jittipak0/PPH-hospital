<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'username' => 'staff001',
            'password' => Hash::make('TopSecret1!'),
            'role' => 'staff',
        ]);

        $csrf = 'test-csrf-token';

        $response = $this
            ->withSession(['_token' => $csrf])
            ->withCookie('XSRF-TOKEN', $csrf)
            ->withHeaders([
                'X-CSRF-TOKEN' => $csrf,
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->postJson('/api/auth/login', [
                'username' => 'staff001',
                'password' => 'TopSecret1!',
            ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token' => ['access_token', 'token_type', 'abilities'],
                    'user' => ['id', 'username', 'name', 'email', 'role', 'abilities', 'last_login_at'],
                ],
                'meta' => ['request_id'],
            ]);

        $user->refresh();

        $this->assertNotNull($user->last_login_at);
        $this->assertSame(['viewer', 'staff'], $user->abilities());
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'username' => 'staff002',
            'password' => Hash::make('AnotherSecret1!'),
            'role' => 'staff',
        ]);

        $csrf = 'bad-login-token';

        $response = $this
            ->withSession(['_token' => $csrf])
            ->withCookie('XSRF-TOKEN', $csrf)
            ->withHeaders([
                'X-CSRF-TOKEN' => $csrf,
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->postJson('/api/auth/login', [
                'username' => 'staff002',
                'password' => 'wrong-password',
            ]);

        $response->assertStatus(401)
            ->assertJsonStructure([
                'error' => ['message'],
                'meta' => ['request_id'],
            ]);
    }

    public function test_me_returns_authenticated_user_profile(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'password' => Hash::make('AdminSecret1!'),
        ]);

        $token = $user->createToken('test', $user->abilities())->plainTextToken;

        $response = $this
            ->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/staff/me');

        $response->assertOk()
            ->assertJsonPath('data.id', (string) $user->getKey())
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonStructure([
                'data' => ['id', 'username', 'name', 'email', 'role', 'abilities', 'last_login_at'],
                'meta' => ['request_id'],
            ]);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
            'password' => Hash::make('LogoutSecret1!'),
        ]);

        $token = $user->createToken('session', $user->abilities());
        $plain = $token->plainTextToken;

        $csrf = 'logout-token';

        $response = $this
            ->withHeader('Authorization', 'Bearer '.$plain)
            ->withSession(['_token' => $csrf])
            ->withCookie('XSRF-TOKEN', $csrf)
            ->withHeaders([
                'X-CSRF-TOKEN' => $csrf,
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->postJson('/api/auth/logout');

        $response->assertOk()
            ->assertJsonPath('data.success', true);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $token->accessToken->getKey(),
        ]);
    }
}
