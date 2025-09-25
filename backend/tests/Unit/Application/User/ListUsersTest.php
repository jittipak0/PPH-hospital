<?php

declare(strict_types=1);

namespace Tests\Unit\Application\User;

use App\Application\User\ListUsers;
use App\Domain\User\DTO\NewUserData;
use App\Infrastructure\Persistence\Memory\UserRepository;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(ListUsers::class)]
final class ListUsersTest extends TestCase
{
    public function test_it_returns_all_users_from_repository(): void
    {
        $repository = new UserRepository();
        $repository->create(new NewUserData('Alice', 'alice@example.com', 'secret'));
        $repository->create(new NewUserData('Bob', 'bob@example.com', 'secret'));

        $useCase = new ListUsers($repository);

        $result = $useCase();

        self::assertCount(2, $result);
        self::assertSame('Alice', $result[0]->name);
        self::assertSame('Bob', $result[1]->name);
    }
}
