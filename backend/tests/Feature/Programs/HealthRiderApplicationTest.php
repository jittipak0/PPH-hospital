<?php

namespace Tests\Feature\Programs;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthRiderApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_apply_for_health_rider(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/programs/health-rider/apply', [
                'full_name' => 'นางสาว ใจดี',
                'hn' => 'HR1234',
                'address' => '45/6 หมู่ 2 ตำบลสุขภาพ อำเภอโพนพิสัย จังหวัดหนองคาย',
                'district' => 'โพนพิสัย',
                'province' => 'หนองคาย',
                'zipcode' => '43120',
                'phone' => '0823456789',
                'line_id' => 'healthline',
                'consent' => '1',
            ]);

        $response->assertCreated()->assertJsonStructure(['ok', 'id', 'message']);

        $this->assertDatabaseHas('health_rider_applications', [
            'hn' => 'HR1234',
            'district' => 'โพนพิสัย',
        ]);
    }

    public function test_requires_valid_zipcode(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/programs/health-rider/apply', [
                'full_name' => 'นางสาว ใจดี',
                'hn' => 'HR1234',
                'address' => '45/6 หมู่ 2',
                'district' => 'โพนพิสัย',
                'province' => 'หนองคาย',
                'zipcode' => '123',
                'phone' => '0823456789',
                'consent' => '1',
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['zipcode']);
    }
}
