<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_name',
        'amount',
        'channel',
        'phone',
        'email',
        'wants_receipt',
        'consent',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'wants_receipt' => 'boolean',
        'consent' => 'boolean',
    ];
}
