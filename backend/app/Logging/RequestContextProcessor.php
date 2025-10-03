<?php

namespace App\Logging;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;

class RequestContextProcessor
{
    public function __invoke(array $record): array
    {
        $context = $record['extra'] ?? [];

        $context['request_id'] = $context['request_id'] ?? Context::get('request_id');
        $context['user_id'] = $context['user_id'] ?? $this->resolveUserId();
        $context['ip'] = $context['ip'] ?? Context::get('ip');
        $context['user_agent'] = $context['user_agent'] ?? Context::get('user_agent');

        $record['extra'] = array_filter($context, static fn ($value) => $value !== null && $value !== '');

        return $record;
    }

    protected function resolveUserId(): ?string
    {
        if (Context::has('user_id')) {
            return (string) Context::get('user_id');
        }

        if (! app()->bound('request')) {
            return Auth::check() ? (string) Auth::id() : null;
        }

        /** @var Request $request */
        $request = app(Request::class);

        $user = $request->user();

        if ($user instanceof Authenticatable) {
            $id = (string) $user->getAuthIdentifier();
            Context::add(['user_id' => $id]);

            return $id;
        }

        if (Auth::check()) {
            return (string) Auth::id();
        }

        return null;
    }
}
