<?php

declare(strict_types=1);

namespace App\Domain\User\Exceptions;

use DomainException;

final class UserAlreadyExists extends DomainException
{
    public static function forEmail(string $email): self
    {
        return new self("ผู้ใช้ที่มีอีเมล {$email} มีอยู่แล้ว");
    }
}
