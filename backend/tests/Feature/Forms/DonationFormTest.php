<?php

namespace Tests\Feature\Forms;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonationFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_donation_submission(): void
    {
        $payload = [
            'donor_name' => 'บริษัท เมตตา จำกัด',
            'amount' => 5000,
            'channel' => 'bank_transfer',
            'phone' => '026789000',
            'email' => 'donor@example.com',
            'wants_receipt' => true,
            'consent' => true,
            'notes' => 'ขอใบเสร็จเพื่อนำไปลดหย่อนภาษี',
        ];

        $response = $this->postJson('/api/forms/donation', $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.donor_name', 'บริษัท เมตตา จำกัด');
        $this->assertDatabaseHas('donation_submissions', [
            'donor_name' => 'บริษัท เมตตา จำกัด',
            'amount' => 5000,
            'channel' => 'bank_transfer',
            'wants_receipt' => true,
            'consent' => true,
        ]);
    }

    public function test_donation_requires_fields(): void
    {
        $response = $this->postJson('/api/forms/donation', []);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors' => ['donor_name', 'amount', 'channel', 'consent']]);
    }
}
