<?php

namespace Tests\Feature\Forms;

use App\Models\Donation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class DonationSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_donation_submission_creates_record_with_reference_code(): void
    {
        Session::start();
        $token = Session::token();

        $response = $this
            ->withSession(['_token' => $token])
            ->withHeader('X-CSRF-TOKEN', $token)
            ->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->postJson('/api/forms/donation', [
                'donor_name' => 'John Smith',
                'amount' => 500,
                'channel' => 'bank',
                'phone' => '0999999999',
                'email' => 'john@example.com',
                'note' => 'For pediatric ward',
            ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => ['id', 'reference_code', 'submitted_at'],
            'meta' => ['request_id'],
        ]);

        $reference = $response->json('data.reference_code');
        $this->assertIsString($reference);
        $this->assertNotEmpty($reference);

        $donation = Donation::find($response->json('data.id'));
        $this->assertNotNull($donation);
        $this->assertSame($reference, $donation->reference_code);
    }
}
