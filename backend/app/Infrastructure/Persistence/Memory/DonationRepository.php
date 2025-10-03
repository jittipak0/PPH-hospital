<?php

namespace App\Infrastructure\Persistence\Memory;

use App\Domain\Forms\Contracts\DonationRepository as DonationRepositoryContract;
use App\Models\Donation;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class DonationRepository implements DonationRepositoryContract
{
    /**
     * @var array<int, array<string, mixed>>
     */
    protected array $records = [];

    public function setConnectionName(?string $connection): void
    {
        // Not used for memory adapter.
    }

    public function save(Donation $donation): void
    {
        if (! $donation->getKey()) {
            $donation->setAttribute('id', $this->nextId());
            $donation->setAttribute('created_at', Carbon::now()->toDateTimeString());
        }

        $donation->setAttribute('updated_at', Carbon::now()->toDateTimeString());

        $this->records[$donation->getKey()] = $donation->getAttributes();

        Log::debug('Donation stored in memory.', [
            'donation_id' => $donation->getKey(),
            'reference_code' => $donation->reference_code,
        ]);
    }

    protected function nextId(): int
    {
        return empty($this->records)
            ? 1
            : (max(array_keys($this->records)) + 1);
    }
}
