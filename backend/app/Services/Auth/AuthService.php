<?php

namespace App\Services\Auth;

use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Domain\User\Contracts\UserRepository;
use App\Models\User;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\NewAccessToken;

class AuthService
{
    public function __construct(private readonly UserRepository $users) {}

    /**
     * @return array{user: User, token: NewAccessToken}
     */
    public function login(string $username, string $password): array
    {
        $usernameHash = hash('sha256', $username.(string) config('app.key'));

        Log::debug('AuthService: login attempt received.', [
            'username_hash' => $usernameHash,
        ]);

        $user = $this->users->findByUsername($username);

        if (! $user || ! Hash::check($password, $user->getAuthPassword())) {
            Log::debug('AuthService: login failed.', [
                'username_hash' => $usernameHash,
            ]);

            throw new InvalidCredentialsException;
        }

        Context::add(['user_id' => (string) $user->getAuthIdentifier()]);

        $token = $user->createToken('staff-api', $user->abilities());

        $user->last_login_at = now();
        $this->users->save($user);

        Log::debug('AuthService: login succeeded.', [
            'user_id' => $user->getKey(),
            'abilities' => $user->abilities(),
        ]);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        Log::debug('AuthService: logout requested.', [
            'user_id' => $user->getKey(),
        ]);

        $token = $user->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        Log::debug('AuthService: logout completed.', [
            'user_id' => $user->getKey(),
        ]);
    }
}
