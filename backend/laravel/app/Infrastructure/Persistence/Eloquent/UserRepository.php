<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;

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
}
