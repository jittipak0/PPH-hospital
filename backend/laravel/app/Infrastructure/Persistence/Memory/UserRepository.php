<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;

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
}
