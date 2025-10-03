<?php

namespace App\Services\Forms;

use App\Domain\Forms\Contracts\DonationRepository;
use App\Models\Donation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DonationFormService
{
    public function __construct(private readonly DonationRepository $repository) {}

    /**
     * @param  array{
     *     donor_name: string,
     *     amount: float|int|string,
     *     channel: string,
     *     phone?: ?string,
     *     email?: ?string,
     *     note?: ?string,
     * }  $payload
     */
    public function submit(array $payload, string $ipAddress, ?string $userAgent): Donation
    {
        Log::debug('DonationFormService: submission received.');

        $donation = new Donation([
            'donor_name' => $payload['donor_name'],
            'amount' => (float) $payload['amount'],
            'channel' => $payload['channel'],
            'phone' => $payload['phone'] ?? null,
            'email' => $payload['email'] ?? null,
            'note' => $payload['note'] ?? null,
            'reference_code' => $this->generateReferenceCode(),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $this->repository->save($donation);

        Log::debug('DonationFormService: submission stored.', [
            'donation_id' => $donation->getKey(),
            'reference_code' => $donation->reference_code,
        ]);

        return $donation;
    }

    protected function generateReferenceCode(): string
    {
        return Str::upper(bin2hex(random_bytes(5)));
    }
}
