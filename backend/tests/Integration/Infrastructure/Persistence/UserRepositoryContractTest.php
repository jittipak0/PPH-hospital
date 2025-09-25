<?php

declare(strict_types=1);

namespace Tests\Integration\Infrastructure\Persistence;

use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\Entities\NewUser;
use App\Infrastructure\Persistence\Memory\UserRepository as MemoryUserRepository;
use Illuminate\Support\Facades\DB;
use PDO;
use Tests\TestCase;

final class UserRepositoryContractTest extends TestCase
{
    /**
     * @dataProvider datastoreProvider
     */
    public function test_user_repository_contract(string $driver, ?string $connection): void
    {
        config(['datastore.driver' => $driver]);

        if ($connection !== null) {
            config(['datastore.connection' => $connection]);
        }

        if ($driver === 'memory') {
            MemoryUserRepository::clear();
        }

        if ($driver === 'eloquent') {
            if (!\in_array('sqlite', PDO::getAvailableDrivers(), true)) {
                $this->markTestSkipped('SQLite PDO driver not available.');
            }

            config(['database.default' => $connection]);
            config(["database.connections.{$connection}.database" => ':memory:']);
            DB::purge($connection);
            DB::connection($connection)->getPdo();
            $this->artisan('migrate', ['--database' => $connection, '--force' => true])->run();
        }

        /** @var UserRepository $repository */
        $repository = $this->app->make(UserRepository::class);

        $created = $repository->create(new NewUser(
            name: 'Test User',
            email: uniqid('user', true).'@example.com',
            password: 'password1234',
        ));

        $this->assertSame('Test User', $created->name);
        $this->assertNotEmpty($created->passwordHash);

        $users = $repository->list();

        $this->assertNotEmpty($users);
        $this->assertSame($created->id, $users[0]->id);
    }

    /**
     * @return array<string, array{0:string,1:?string}>
     */
    public static function datastoreProvider(): array
    {
        return [
            'memory' => ['memory', null],
            'sqlite' => ['eloquent', 'sqlite'],
        ];
    }
}
