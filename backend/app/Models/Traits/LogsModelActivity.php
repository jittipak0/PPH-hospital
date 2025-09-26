<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

trait LogsModelActivity
{
    protected static function bootLogsModelActivity(): void
    {
        static::created(function (Model $model): void {
            Log::info('Model created', [
                'model' => $model::class,
                'id' => $model->getKey(),
                'timestamp' => now()->toIso8601String(),
            ]);
        });
    }
}
