<?php

namespace App\Models;

use App\Models\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SatisfactionSurvey extends Model
{
    use HasFactory;
    use LogsModelActivity;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'channel',
        'score_service',
        'score_clean',
        'score_speed',
        'comment',
        'contact_optin',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'contact_optin' => 'boolean',
    ];
}
