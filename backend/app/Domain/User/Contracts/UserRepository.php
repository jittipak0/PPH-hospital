<?php

declare(strict_types=1);

namespace App\Domain\User\Contracts;

use App\Domain\User\Entities\NewUser;
use App\Domain\User\Entities\User;

interface UserRepository
{
    /**
     * @return list<User>
     */
    public function list(): array;

    public function create(NewUser $user): User;
}
