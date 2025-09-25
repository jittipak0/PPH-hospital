<?php

declare(strict_types=1);

use App\Domain\User\Contracts\UserRepository as UserRepositoryContract;
use App\Infrastructure\Persistence\Eloquent\UserRepository as EloquentUserRepository;
use App\Infrastructure\Persistence\Memory\UserRepository as MemoryUserRepository;

return [
    'driver' => env('DATASTORE_DRIVER', 'eloquent'),
    'connection' => env('DATASTORE_CONNECTION', env('DB_CONNECTION', 'sqlite')),
    'map' => [
        UserRepositoryContract::class => [
            'eloquent' => EloquentUserRepository::class,
            'memory' => MemoryUserRepository::class,
        ],
    ],
];
