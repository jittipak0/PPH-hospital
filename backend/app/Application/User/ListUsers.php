<?php

declare(strict_types=1);

namespace App\Application\User;

use App\Domain\User\Contracts\UserRepository;
use App\Domain\User\Entities\User;

final class ListUsers
{
    public function __construct(private readonly UserRepository $repository)
    {
    }

    /**
     * @return list<User>
     */
    public function __invoke(): array
    {
        return $this->repository->all();
    }
}
