<?php

namespace App\Domain\User\Contracts;

use App\Models\User;

interface UserRepository
{
    public function findByUsername(string $username): ?User;

    public function save(User $user): void;
}
