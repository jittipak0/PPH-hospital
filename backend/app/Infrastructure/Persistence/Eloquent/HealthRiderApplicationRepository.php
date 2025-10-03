<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Forms\Contracts\HealthRiderApplicationRepository as HealthRiderApplicationRepositoryContract;
use App\Models\HealthRiderApplication;
use Illuminate\Support\Facades\Log;

class HealthRiderApplicationRepository implements HealthRiderApplicationRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function save(HealthRiderApplication $application): void
    {
        if ($this->connection) {
            $application->setConnection($this->connection);
        }

        $application->save();

        Log::debug('HealthRiderApplication persisted.', [
            'connection' => $this->connection,
            'application_id' => $application->getKey(),
        ]);
    }
}
