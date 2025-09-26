<?php

namespace App\Models;

use App\Models\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;
    use LogsModelActivity;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'donor_name',
        'phone',
        'email',
        'amount',
        'channel',
        'message',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
    ];
}
