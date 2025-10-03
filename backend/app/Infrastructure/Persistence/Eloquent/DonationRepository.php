<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Forms\Contracts\DonationRepository as DonationRepositoryContract;
use App\Models\Donation;
use Illuminate\Support\Facades\Log;

class DonationRepository implements DonationRepositoryContract
{
    protected ?string $connection = null;

    public function setConnectionName(?string $connection): void
    {
        $this->connection = $connection;
    }

    public function save(Donation $donation): void
    {
        if ($this->connection) {
            $donation->setConnection($this->connection);
        }

        $donation->save();

        Log::debug('Donation persisted.', [
            'connection' => $this->connection,
            'donation_id' => $donation->getKey(),
            'reference_code' => $donation->reference_code,
        ]);
    }
}
