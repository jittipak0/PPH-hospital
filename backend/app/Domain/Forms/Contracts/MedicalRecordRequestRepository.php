<?php

namespace App\Domain\Forms\Contracts;

use App\Models\MedicalRecordRequest;

interface MedicalRecordRequestRepository
{
    public function save(MedicalRecordRequest $request): void;
}
