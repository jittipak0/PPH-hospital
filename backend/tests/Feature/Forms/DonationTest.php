<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_donation_form(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/forms/donation', [
                'donor_name' => 'กองทุนทดสอบ',
                'amount' => 1500,
                'channel' => 'bank',
                'phone' => '021234567',
                'email' => 'donor@example.com',
                'note' => 'สนับสนุนเครื่องมือแพทย์',
            ]);

        $response->assertCreated()->assertJsonStructure(['ok', 'id', 'message']);

        $this->assertDatabaseHas('donations', [
            'donor_name' => 'กองทุนทดสอบ',
            'amount' => 1500,
            'channel' => 'bank',
        ]);
    }

    public function test_channel_must_be_valid(): void
    {
        $token = 'test-token';

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeaders([
                'X-CSRF-TOKEN' => $token,
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])
            ->postJson('/api/forms/donation', [
                'donor_name' => 'ผู้ทดสอบ',
                'amount' => 100,
                'channel' => 'crypto',
                'phone' => '021234567',
                'email' => 'donor@example.com',
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['channel']);
    }
}
