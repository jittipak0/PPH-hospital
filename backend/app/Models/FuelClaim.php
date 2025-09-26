<?php

namespace App\Models;

use App\Models\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelClaim extends Model
{
    use HasFactory;
    use LogsModelActivity;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'staff_id',
        'dept',
        'vehicle_plate',
        'trip_date',
        'liters',
        'amount',
        'receipt_path',
        'note',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'trip_date' => 'date',
        'liters' => 'decimal:2',
        'amount' => 'decimal:2',
    ];
}
