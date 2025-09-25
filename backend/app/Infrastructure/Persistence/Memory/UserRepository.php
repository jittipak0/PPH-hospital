<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Domain\User\DTO\NewUserData;
use App\Domain\User\Entities\User as UserEntity;
use DateTimeImmutable;
use Illuminate\Support\Str;

final class UserRepository implements UserRepositoryContract
{
    /** @var array<string, array{id:string,name:string,email:string,created_at:DateTimeImmutable,updated_at:DateTimeImmutable,password:string}> */
    private array $storage = [];

    public function __construct()
    {
    }

    /**
     * @return list<UserEntity>
     */
    public function all(): array
    {
        return array_values(array_map(
            fn (array $row): UserEntity => $this->toEntity($row),
            $this->storage,
        ));
    }

    public function create(NewUserData $data): UserEntity
    {
        $now = new DateTimeImmutable();
        $id = Str::uuid()->toString();

        $this->storage[$id] = [
            'id' => $id,
            'name' => $data->name,
            'email' => $data->email,
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'created_at' => $now,
            'updated_at' => $now,
        ];

        return $this->toEntity($this->storage[$id]);
    }

    public function findByEmail(string $email): ?UserEntity
    {
        foreach ($this->storage as $row) {
            if ($row['email'] === $email) {
                return $this->toEntity($row);
            }
        }

        return null;
    }

    /**
     * @param array{id:string,name:string,email:string,created_at:DateTimeImmutable,updated_at:DateTimeImmutable,password:string} $row
     */
    private function toEntity(array $row): UserEntity
    {
        return new UserEntity(
            id: $row['id'],
            name: $row['name'],
            email: $row['email'],
            createdAt: $row['created_at'],
            updatedAt: $row['updated_at'],
        );
    }
}
