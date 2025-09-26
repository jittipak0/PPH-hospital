<?php

namespace App\Models;

use App\Models\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecordRequest extends Model
{
    use HasFactory;
    use LogsModelActivity;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'citizen_id',
        'hn',
        'fullname',
        'dob',
        'phone',
        'email',
        'purpose',
        'date_range',
        'delivery_method',
        'consent',
        'files',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'dob' => 'date',
        'consent' => 'boolean',
        'files' => 'array',
    ];
}
