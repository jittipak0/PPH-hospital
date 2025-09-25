<?php

declare(strict_types=1);

namespace App\Domain\User\Entities;

final class NewUser
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
    ) {
    }
}
