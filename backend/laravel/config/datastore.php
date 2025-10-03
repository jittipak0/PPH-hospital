<?php

return [
    'driver' => env('DATASTORE_DRIVER', 'eloquent'),

    'connection' => env('DATASTORE_CONNECTION', env('DB_CONNECTION', 'sqlite')),

    'repositories' => [
        App\Domain\User\Contracts\UserRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\UserRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\UserRepository::class,
        ],
    ],
];
