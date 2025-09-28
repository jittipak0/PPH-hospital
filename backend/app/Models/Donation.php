<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_name',
        'amount',
        'channel',
        'phone',
        'email',
        'note',
        'reference_code',
        'ip_address',
        'user_agent',
    ];
}
