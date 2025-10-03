<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class UserRepository implements UserRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function connectionName(): ?string
    {
        return $this->connection;
    }

    public function findByUsername(string $username): ?User
    {
        $query = $this->query();

        Log::debug('Eloquent user lookup requested.', [
            'username_hash' => hash('sha256', $username.(string) config('app.key')),
            'connection' => $this->connection,
        ]);

        return $query->where('username', $username)->first();
    }

    public function save(User $user): void
    {
        if ($this->connection) {
            $user->setConnection($this->connection);
        }

        $user->save();

        Log::debug('User model persisted.', [
            'user_id' => $user->getKey(),
            'connection' => $this->connection,
        ]);
    }

    protected function query(): Builder
    {
        return $this->connection
            ? User::on($this->connection)
            : User::query();
    }
}
