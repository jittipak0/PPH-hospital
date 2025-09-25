<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Domain\User\DTO\NewUserData;
use App\Domain\User\Entities\User as UserEntity;
use App\Models\User as UserModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

final class UserRepository implements UserRepositoryContract
{
    public function __construct(
        private readonly UserModel $model,
        private readonly string $connectionName
    ) {
        $this->model->setConnection($this->connectionName);
    }

    /**
     * @return list<UserEntity>
     */
    public function all(): array
    {
        return $this->query()
            ->get()
            ->map(fn (UserModel $user): UserEntity => $this->toEntity($user))
            ->all();
    }

    public function create(NewUserData $data): UserEntity
    {
        $record = $this->query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        return $this->toEntity($record);
    }

    public function findByEmail(string $email): ?UserEntity
    {
        $record = $this->query()->where('email', $email)->first();

        return $record instanceof UserModel ? $this->toEntity($record) : null;
    }

    private function query(): Builder
    {
        return $this->model->newQuery()->setConnection($this->connectionName);
    }

    private function toEntity(UserModel $model): UserEntity
    {
        $key = $model->getKey();

        return new UserEntity(
            id: is_int($key) || is_string($key) ? $key : (string) $key,
            name: (string) $model->name,
            email: (string) $model->email,
            createdAt: $model->created_at?->toDateTimeImmutable(),
            updatedAt: $model->updated_at?->toDateTimeImmutable(),
        );
    }
}
