<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\Forms\Contracts\HealthRiderApplicationRepository as HealthRiderApplicationRepositoryContract;
use App\Models\HealthRiderApplication;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class HealthRiderApplicationRepository implements HealthRiderApplicationRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // Memory adapter ignores connection changes.
    }

    public function save(HealthRiderApplication $application): void
    {
        if (! $application->getKey()) {
            $application->setAttribute('id', $this->nextId());
            $application->setAttribute('created_at', Carbon::now()->toDateTimeString());
        }

        $application->setAttribute('updated_at', Carbon::now()->toDateTimeString());

        $this->records[$application->getKey()] = $application->getAttributes();

        Log::debug('HealthRiderApplication stored in memory.', [
            'application_id' => $application->getKey(),
        ]);
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
