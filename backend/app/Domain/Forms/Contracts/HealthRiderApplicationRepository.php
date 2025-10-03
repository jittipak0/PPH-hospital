<?php

namespace App\Domain\Forms\Contracts;

use App\Models\HealthRiderApplication;

interface HealthRiderApplicationRepository
{
    public function save(HealthRiderApplication $application): void;
}
