<?php

namespace Tests\Feature\Forms;

use App\Models\HealthRiderApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class HealthRiderApplicationSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_application_submission_creates_record(): void
    {
        Session::start();
        $token = Session::token();

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/programs/health-rider/apply', [
                'full_name' => 'Mary Poppins',
                'hn' => 'HR456',
                'address' => '456 Rider Road',
                'district' => 'Central',
                'province' => 'Bangkok',
                'zipcode' => '10110',
                'phone' => '0888888888',
                'line_id' => 'maryline',
                'consent' => 'yes',
            ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => ['id', 'submitted_at'],
            'meta' => ['request_id'],
        ]);

        $application = HealthRiderApplication::find($response->json('data.id'));
        $this->assertNotNull($application);
        $this->assertTrue($application->consent);
        $this->assertSame('Mary Poppins', $application->full_name);
    }

    public function test_consent_is_required(): void
    {
        Session::start();
        $token = Session::token();

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/programs/health-rider/apply', [
                'full_name' => 'Mary Poppins',
                'address' => '456 Rider Road',
                'district' => 'Central',
                'province' => 'Bangkok',
                'zipcode' => '10110',
                'phone' => '0888888888',
            ]);

        $response->assertUnprocessable()
            ->assertJsonStructure([
                'errors' => ['consent'],
            ]);
    }
}
