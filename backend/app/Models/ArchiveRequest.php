<?php

namespace App\Models;

use App\Models\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchiveRequest extends Model
{
    use HasFactory;
    use LogsModelActivity;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'staff_id',
        'document_type',
        'ref_no',
        'needed_date',
        'note',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'needed_date' => 'date',
    ];
}
