<?php

namespace App\Services\Forms;

use App\Domain\Forms\Contracts\SatisfactionSurveyRepository;
use App\Models\SatisfactionSurvey;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SatisfactionSurveyService
{
    public function __construct(private readonly SatisfactionSurveyRepository $repository) {}

    /**
     * @param  array{
     *     score_overall: int,
     *     score_waittime: int,
     *     score_staff: int,
     *     comment?: ?string,
     *     service_date?: ?string,
     * }  $payload
     */
    public function submit(array $payload, string $ipAddress, ?string $userAgent): SatisfactionSurvey
    {
        Log::debug('SatisfactionSurveyService: submission received.');

        $survey = new SatisfactionSurvey([
            'score_overall' => (int) $payload['score_overall'],
            'score_waittime' => (int) $payload['score_waittime'],
            'score_staff' => (int) $payload['score_staff'],
            'comment' => $payload['comment'] ?? null,
            'service_date' => isset($payload['service_date']) ? Carbon::parse($payload['service_date']) : null,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $this->repository->save($survey);

        Log::debug('SatisfactionSurveyService: submission stored.', [
            'survey_id' => $survey->getKey(),
        ]);

        return $survey;
    }
}
