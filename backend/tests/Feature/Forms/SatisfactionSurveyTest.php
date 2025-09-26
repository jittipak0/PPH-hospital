<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SatisfactionSurveyTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_records_satisfaction_feedback(): void
    {
        $payload = [
            'full_name' => 'นางสาว พิมพ์ชนก บุญช่วย',
            'hn' => 'HN567890',
            'service_date' => '2024-07-12',
            'service_type' => 'outpatient',
            'rating' => 5,
            'feedback' => 'บริการรวดเร็ว เจ้าหน้าที่ให้ข้อมูลชัดเจน',
            'phone' => '0900001111',
            'email' => 'patient2@example.com',
            'consent' => 'yes',
        ];

        $response = $this->postJson('/api/forms/satisfaction', $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.rating', 5);
        $this->assertDatabaseHas('satisfaction_surveys', [
            'full_name' => 'นางสาว พิมพ์ชนก บุญช่วย',
            'service_type' => 'outpatient',
            'rating' => 5,
        ]);
    }

    public function test_satisfaction_requires_minimum_fields(): void
    {
        $response = $this->postJson('/api/forms/satisfaction', []);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors' => ['full_name', 'service_date', 'service_type', 'rating', 'consent']]);
    }
}
