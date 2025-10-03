<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\Forms\Contracts\MedicalRecordRequestRepository as MedicalRecordRequestRepositoryContract;
use App\Models\MedicalRecordRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class MedicalRecordRequestRepository implements MedicalRecordRequestRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // Not required for in-memory adapter.
    }

    public function save(MedicalRecordRequest $request): void
    {
        if (! $request->getKey()) {
            $request->setAttribute('id', $this->nextId());
            $request->setAttribute('created_at', Carbon::now()->toDateTimeString());
        }

        $request->setAttribute('updated_at', Carbon::now()->toDateTimeString());

        $this->records[$request->getKey()] = $request->getAttributes();

        Log::debug('MedicalRecordRequest stored in memory.', [
            'record_id' => $request->getKey(),
        ]);
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
