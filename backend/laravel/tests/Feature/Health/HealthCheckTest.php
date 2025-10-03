<?php

namespace Tests\Feature\Health;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_reports_status(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertOk()
            ->assertJsonPath('data.ok', true)
            ->assertJsonStructure([
                'data' => [
                    'ok',
                    'app' => ['name', 'environment', 'version'],
                    'services' => [
                        'database' => ['status', 'connection'],
                        'queue' => ['status', 'connection'],
                        'storage' => ['status', 'disk'],
                    ],
                ],
                'meta' => ['request_id', 'timestamp'],
            ]);
    }
}
