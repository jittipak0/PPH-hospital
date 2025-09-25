<?php

declare(strict_types=1);

namespace Tests\Unit\Application\User;

use App\Application\User\ListUsers;
use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\Entities\NewUser;
use App\Domain\User\Entities\User;
use Tests\TestCase;

final class ListUsersTest extends TestCase
{
    public function test_handle_returns_users_from_repository(): void
    {
        $expected = [
            new User(1, 'Alice', 'alice@example.com'),
            new User(2, 'Bob', 'bob@example.com'),
        ];

        $repository = new class($expected) implements UserRepository {
            /** @param list<User> $users */
            public function __construct(private readonly array $users)
            {
            }

            public function list(): array
            {
                return $this->users;
            }

            public function create(NewUser $user): User
            {
                return new User(3, $user->name, $user->email);
            }
        };

        $useCase = new ListUsers($repository);

        $users = $useCase->handle();

        $this->assertSame($expected, $users);
    }
}
