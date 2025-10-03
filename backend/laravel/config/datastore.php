<?php

return [
    'driver' => env('DATASTORE_DRIVER', 'eloquent'),

    'connection' => env('DATASTORE_CONNECTION', env('DB_CONNECTION', 'sqlite')),

    'repositories' => [
        App\Domain\User\Contracts\UserRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\UserRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\UserRepository::class,
        ],
        App\Domain\News\Contracts\NewsRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\NewsRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\NewsRepository::class,
        ],
        App\Domain\Forms\Contracts\MedicalRecordRequestRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\MedicalRecordRequestRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\MedicalRecordRequestRepository::class,
        ],
        App\Domain\Forms\Contracts\DonationRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\DonationRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\DonationRepository::class,
        ],
        App\Domain\Forms\Contracts\SatisfactionSurveyRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\SatisfactionSurveyRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\SatisfactionSurveyRepository::class,
        ],
        App\Domain\Forms\Contracts\HealthRiderApplicationRepository::class => [
            'eloquent' => App\Infrastructure\Persistence\Eloquent\HealthRiderApplicationRepository::class,
            'memory' => App\Infrastructure\Persistence\Memory\HealthRiderApplicationRepository::class,
        ],
    ],
];
