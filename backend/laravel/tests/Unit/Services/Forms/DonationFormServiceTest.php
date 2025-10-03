<?php

namespace Tests\Unit\Services\Forms;

use App\Domain\Forms\Contracts\DonationRepository;
use App\Models\Donation;
use App\Services\Forms\DonationFormService;
use Tests\TestCase;

class DonationFormServiceTest extends TestCase
{
    public function test_submit_casts_payload_and_persists_donation(): void
    {
        $repository = $this->createMock(DonationRepository::class);

        $repository->expects($this->once())
            ->method('save')
            ->with($this->callback(function (Donation $donation): bool {
                return $donation->donor_name === 'John Doe'
                    && $donation->amount === 500.0
                    && $donation->channel === 'bank'
                    && $donation->ip_address === '127.0.0.1';
            }));

        $service = new class($repository) extends DonationFormService
        {
            public function __construct(DonationRepository $repository)
            {
                parent::__construct($repository);
            }

            protected function generateReferenceCode(): string
            {
                return 'STATICCODE';
            }
        };

        $donation = $service->submit([
            'donor_name' => 'John Doe',
            'amount' => '500',
            'channel' => 'bank',
            'phone' => '0890000000',
        ], '127.0.0.1', 'Mozilla/5.0');

        $this->assertInstanceOf(Donation::class, $donation);
        $this->assertSame('STATICCODE', $donation->reference_code);
        $this->assertSame('Mozilla/5.0', $donation->user_agent);
    }
}
