<?php

declare(strict_types=1);

return [
    'driver' => env('DATASTORE_DRIVER', 'eloquent'),
    'connection' => env('DATASTORE_CONNECTION', env('DB_CONNECTION', 'sqlite')),
    'map' => [
        App\Domain\User\Contracts\UserRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\UserRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\UserRepository::class,
        ],
    ],
];
