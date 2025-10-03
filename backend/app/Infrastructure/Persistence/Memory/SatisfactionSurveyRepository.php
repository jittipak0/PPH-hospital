<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\Forms\Contracts\SatisfactionSurveyRepository as SatisfactionSurveyRepositoryContract;
use App\Models\SatisfactionSurvey;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SatisfactionSurveyRepository implements SatisfactionSurveyRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // Memory adapter does not need connection switching.
    }

    public function save(SatisfactionSurvey $survey): void
    {
        if (! $survey->getKey()) {
            $survey->setAttribute('id', $this->nextId());
            $survey->setAttribute('created_at', Carbon::now()->toDateTimeString());
        }

        $survey->setAttribute('updated_at', Carbon::now()->toDateTimeString());

        $this->records[$survey->getKey()] = $survey->getAttributes();

        Log::debug('SatisfactionSurvey stored in memory.', [
            'survey_id' => $survey->getKey(),
        ]);
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
