<?php

namespace App\Domain\Forms\Contracts;

use App\Models\Donation;

interface DonationRepository
{
    public function save(Donation $donation): void;
}
