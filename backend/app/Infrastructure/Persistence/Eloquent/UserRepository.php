<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Domain\User\Entities\NewUser;
use App\Domain\User\Entities\User as UserEntity;
use App\Domain\User\Exceptions\UserPersistenceException;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Throwable;

final class UserRepository implements UserRepositoryContract
{
    public function __construct(private readonly string $connection)
    {
    }

    /**
     * @return list<UserEntity>
     */
    public function list(): array
    {
        /** @var Collection<int, User> $records */
        $records = $this->query()->get();

        return $records
            ->map(fn (User $user): UserEntity => $this->mapToEntity($user))
            ->values()
            ->all();
    }

    public function create(NewUser $user): UserEntity
    {
        try {
            /** @var User $record */
            $record = $this->query()->create([
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
            ]);
        } catch (Throwable $exception) {
            throw new UserPersistenceException('Unable to create user record.', 0, $exception);
        }

        return $this->mapToEntity($record);
    }

    private function query(): Builder
    {
        $model = new User();
        $model->setConnection($this->connection);

        return $model->newQuery();
    }

    private function mapToEntity(User $user): UserEntity
    {
        return new UserEntity(
            id: (int) $user->getAttribute('id'),
            name: (string) $user->getAttribute('name'),
            email: (string) $user->getAttribute('email'),
            passwordHash: $user->getAttribute('password'),
        );
    }
}
