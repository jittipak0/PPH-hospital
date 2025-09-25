<?php

declare(strict_types=1);

namespace Tests\Unit\Application\User;

use App\Application\User\CreateUser;
use App\Domain\User\DTO\NewUserData;
use App\Domain\User\Exceptions\UserAlreadyExists;
use App\Infrastructure\Persistence\Memory\UserRepository;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(CreateUser::class)]
final class CreateUserTest extends TestCase
{
    public function test_it_creates_a_user_when_email_is_unique(): void
    {
        $repository = new UserRepository();
        $useCase = new CreateUser($repository);

        $user = $useCase(new NewUserData('Alice', 'alice@example.com', 'secret'));

        self::assertSame('Alice', $user->name);
        self::assertSame('alice@example.com', $user->email);
    }

    public function test_it_throws_when_email_exists(): void
    {
        $repository = new UserRepository();
        $useCase = new CreateUser($repository);

        $useCase(new NewUserData('Alice', 'alice@example.com', 'secret'));

        $this->expectException(UserAlreadyExists::class);
        $useCase(new NewUserData('Bob', 'alice@example.com', 'secret'));
    }
}
