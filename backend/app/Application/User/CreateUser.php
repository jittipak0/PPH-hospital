<?php

declare(strict_types=1);

namespace App\Application\User;

use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\Entities\User;
use App\Domain\User\Entities\NewUser;

final class CreateUser
{
    public function __construct(private readonly UserRepository $users)
    {
    }

    public function handle(string $name, string $email, string $password): User
    {
        $newUser = new NewUser($name, $email, $password);

        return $this->users->create($newUser);
    }
}
