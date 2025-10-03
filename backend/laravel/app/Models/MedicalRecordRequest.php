<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecordRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'hn',
        'citizen_id_hash',
        'citizen_id_masked',
        'phone',
        'email',
        'address',
        'reason',
        'consent',
        'idcard_path',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'consent' => 'boolean',
    ];
}
