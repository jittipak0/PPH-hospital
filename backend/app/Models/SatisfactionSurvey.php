<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SatisfactionSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'hn',
        'service_date',
        'service_type',
        'rating',
        'feedback',
        'phone',
        'email',
        'consent',
    ];

    protected $casts = [
        'service_date' => 'date',
        'rating' => 'integer',
        'consent' => 'boolean',
    ];
}
