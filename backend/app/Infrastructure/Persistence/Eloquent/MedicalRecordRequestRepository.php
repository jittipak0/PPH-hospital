<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Forms\Contracts\MedicalRecordRequestRepository as MedicalRecordRequestRepositoryContract;
use App\Models\MedicalRecordRequest;
use Illuminate\Support\Facades\Log;

class MedicalRecordRequestRepository implements MedicalRecordRequestRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function save(MedicalRecordRequest $request): void
    {
        if ($this->connection) {
            $request->setConnection($this->connection);
        }

        $request->save();

        Log::debug('MedicalRecordRequest persisted.', [
            'connection' => $this->connection,
            'record_id' => $request->getKey(),
        ]);
    }
}
