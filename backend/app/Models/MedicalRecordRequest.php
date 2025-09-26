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
        'citizen_id_last4',
        'phone',
        'email',
        'address',
        'reason',
        'consent',
        'idcard_path',
    ];

    protected $casts = [
        'consent' => 'boolean',
    ];
}
