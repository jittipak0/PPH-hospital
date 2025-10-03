<?php

namespace App\Domain\Forms\Contracts;

use App\Models\SatisfactionSurvey;

interface SatisfactionSurveyRepository
{
    public function save(SatisfactionSurvey $survey): void;
}
