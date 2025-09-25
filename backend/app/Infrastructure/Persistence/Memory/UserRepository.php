<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Domain\User\Entities\NewUser;
use App\Domain\User\Entities\User;

final class UserRepository implements UserRepositoryContract
{
    /**
     * @var array<int, User>
     */
    private static array $store = [];

    private static int $nextId = 1;

    /**
     * @return list<User>
     */
    public function list(): array
    {
        return array_values(self::$store);
    }

    public function create(NewUser $user): User
    {
        $id = self::$nextId++;
        $entity = new User(
            id: $id,
            name: $user->name,
            email: $user->email,
            passwordHash: password_hash($user->password, PASSWORD_DEFAULT),
        );

        self::$store[$id] = $entity;

        return $entity;
    }

    public static function clear(): void
    {
        self::$store = [];
        self::$nextId = 1;
    }
}
