<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
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
