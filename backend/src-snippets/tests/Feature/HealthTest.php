<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_ok(): void
    {
        $this->getJson('/api/health')->assertOk()->assertJson(['ok'=>true]);
    }
}
