<?php

declare(strict_types=1);

namespace App\Application\User;

use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\DTO\NewUserData;
use App\Domain\User\Entities\User;
use App\Domain\User\Exceptions\UserAlreadyExists;

final class CreateUser
{
    public function __construct(private readonly UserRepository $repository)
    {
    }

    public function __invoke(NewUserData $data): User
    {
        $existing = $this->repository->findByEmail($data->email);

        if ($existing !== null) {
            throw UserAlreadyExists::forEmail($data->email);
        }

        return $this->repository->create($data);
    }
}
