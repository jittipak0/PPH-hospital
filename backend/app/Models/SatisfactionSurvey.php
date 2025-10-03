<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SatisfactionSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'score_overall',
        'score_waittime',
        'score_staff',
        'comment',
        'service_date',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'score_overall' => 'integer',
        'score_waittime' => 'integer',
        'score_staff' => 'integer',
        'service_date' => 'date',
    ];
}
