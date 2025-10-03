<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserRepository implements UserRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // In-memory adapter does not require a connection alias but keeps method for parity.
    }

    public function findByUsername(string $username): ?User
    {
        Log::debug('Memory user lookup requested.', [
            'username_hash' => hash('sha256', $username.(string) config('app.key')),
        ]);

        $record = collect($this->records)
            ->first(fn (array $attributes) => $attributes['username'] === $username);

        return $record ? $this->mapToModel($record) : null;
    }

    public function save(User $user): void
    {
        if (! $user->getKey()) {
            $user->setAttribute('id', $this->nextId());
        }

        $attributes = $user->getAttributes();

        $this->records[$user->getKey()] = $attributes;

        Log::debug('User model stored in memory.', [
            'user_id' => $user->getKey(),
        ]);
    }

    protected function mapToModel(array $attributes): User
    {
        $model = new User;
        $model->forceFill($attributes);
        $model->exists = true;

        return $model;
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
