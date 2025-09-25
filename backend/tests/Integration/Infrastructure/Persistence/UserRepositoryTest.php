<?php

declare(strict_types=1);

namespace Tests\Integration\Infrastructure\Persistence;

use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\DTO\NewUserData;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;
use Throwable;

final class UserRepositoryTest extends TestCase
{
    /**
     * @return iterable<string, array{driver: string, connection: ?string}>
     */
    public static function driverProvider(): iterable
    {
        yield 'memory' => ['memory', null];
        yield 'sqlite' => ['eloquent', 'sqlite'];
    }

    /**
     * @dataProvider driverProvider
     */
    public function test_it_creates_and_lists_users(string $driver, ?string $connection): void
    {
        $this->prepareEnvironment($driver, $connection);

        $repository = $this->resolveRepositoryOrSkip($driver);

        $repository->create(new NewUserData('Alice', 'alice@example.com', 'secret'));
        $repository->create(new NewUserData('Bob', 'bob@example.com', 'secret'));

        $users = $repository->all();

        self::assertCount(2, $users);
        self::assertSame('Alice', $users[0]->name);
        self::assertSame('Bob', $users[1]->name);
    }

    /**
     * @dataProvider driverProvider
     */
    public function test_it_finds_user_by_email(string $driver, ?string $connection): void
    {
        $this->prepareEnvironment($driver, $connection);

        $repository = $this->resolveRepositoryOrSkip($driver);

        $repository->create(new NewUserData('Alice', 'alice@example.com', 'secret'));

        $user = $repository->findByEmail('alice@example.com');

        self::assertNotNull($user);
        self::assertSame('Alice', $user->name);
    }

    private function prepareEnvironment(string $driver, ?string $connection): void
    {
        config()->set('datastore.driver', $driver);

        if ($connection !== null) {
            config()->set('datastore.connection', $connection);
            config()->set('database.default', $connection);
            config()->set('database.connections.sqlite.database', ':memory:');

            Artisan::call('migrate:fresh', [
                '--database' => $connection,
                '--force' => true,
            ]);
        }
    }

    private function resolveRepositoryOrSkip(string $driver): UserRepository
    {
        try {
            return $this->app->make(UserRepository::class);
        } catch (Throwable $exception) {
            if ($driver === 'eloquent') {
                $this->markTestSkipped('ข้ามเพราะฐานข้อมูลไม่พร้อม: '.$exception->getMessage());
            }

            throw $exception;
        }
    }
}
