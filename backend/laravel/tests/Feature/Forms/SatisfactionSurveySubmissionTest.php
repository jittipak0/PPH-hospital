<?php

namespace Tests\Feature\Forms;

use App\Models\SatisfactionSurvey;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class SatisfactionSurveySubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_satisfaction_survey_submission_creates_record(): void
    {
        Session::start();
        $token = Session::token();

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/forms/satisfaction', [
                'score_overall' => 5,
                'score_waittime' => 4,
                'score_staff' => 5,
                'comment' => 'Excellent service.',
                'service_date' => '2025-01-01',
            ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => ['id', 'submitted_at'],
            'meta' => ['request_id'],
        ]);

        $survey = SatisfactionSurvey::find($response->json('data.id'));
        $this->assertNotNull($survey);
        $this->assertSame(5, $survey->score_overall);
        $this->assertSame('2025-01-01', $survey->service_date?->toDateString());
    }

    public function test_scores_must_be_between_one_and_five(): void
    {
        Session::start();
        $token = Session::token();

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/forms/satisfaction', [
                'score_overall' => 6,
                'score_waittime' => 0,
                'score_staff' => 3,
            ]);

        $response->assertUnprocessable()
            ->assertJsonStructure([
                'errors' => ['score_overall', 'score_waittime'],
            ]);
    }
}
