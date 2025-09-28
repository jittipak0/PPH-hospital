<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SatisfactionSurveyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_satisfaction_survey(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/forms/satisfaction', [
                'score_overall' => 5,
                'score_waittime' => 4,
                'score_staff' => 5,
                'comment' => 'บริการดีเยี่ยม',
                'service_date' => now()->toDateString(),
            ]);

        $response->assertCreated()->assertJsonStructure(['ok', 'id', 'message']);

        $this->assertDatabaseHas('satisfaction_surveys', [
            'score_overall' => 5,
            'score_waittime' => 4,
            'score_staff' => 5,
        ]);
    }

    public function test_score_must_be_within_range(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/forms/satisfaction', [
                'score_overall' => 6,
                'score_waittime' => 0,
                'score_staff' => 3,
                'service_date' => now()->toDateString(),
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['score_overall', 'score_waittime']);
    }
}
