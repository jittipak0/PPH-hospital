<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthRiderApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'hn',
        'address',
        'district',
        'province',
        'zipcode',
        'phone',
        'line_id',
        'consent',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'consent' => 'boolean',
    ];
}
