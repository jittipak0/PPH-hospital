<?php

declare(strict_types=1);

namespace App\Domain\User\Entities;

use DateTimeImmutable;

final class User
{
    public function __construct(
        public readonly int|string $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?DateTimeImmutable $createdAt = null,
        public readonly ?DateTimeImmutable $updatedAt = null,
    ) {
    }
}
