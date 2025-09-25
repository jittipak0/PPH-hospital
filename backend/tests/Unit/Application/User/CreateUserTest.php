<?php

declare(strict_types=1);

namespace Tests\Unit\Application\User;

use App\Application\User\CreateUser;
use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\Entities\NewUser;
use App\Domain\User\Entities\User;
use Tests\TestCase;

final class CreateUserTest extends TestCase
{
    public function test_handle_creates_user_through_repository(): void
    {
        $repository = new class implements UserRepository {
            /** @var list<User> */
            public array $createdUsers = [];

            public function list(): array
            {
                return $this->createdUsers;
            }

            public function create(NewUser $user): User
            {
                $entity = new User(1, $user->name, $user->email);
                $this->createdUsers[] = $entity;

                return $entity;
            }
        };

        $useCase = new CreateUser($repository);

        $user = $useCase->handle('Alice', 'alice@example.com', 'secret1234');

        $this->assertSame('Alice', $user->name);
        $this->assertCount(1, $repository->createdUsers);
        $this->assertSame('alice@example.com', $repository->createdUsers[0]->email);
    }
}
