<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Forms\Contracts\SatisfactionSurveyRepository as SatisfactionSurveyRepositoryContract;
use App\Models\SatisfactionSurvey;
use Illuminate\Support\Facades\Log;

class SatisfactionSurveyRepository implements SatisfactionSurveyRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function save(SatisfactionSurvey $survey): void
    {
        if ($this->connection) {
            $survey->setConnection($this->connection);
        }

        $survey->save();

        Log::debug('SatisfactionSurvey persisted.', [
            'connection' => $this->connection,
            'survey_id' => $survey->getKey(),
        ]);
    }
}
