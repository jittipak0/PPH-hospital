<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as BaseFormRequest;

abstract class FormRequest extends BaseFormRequest
{
    protected function maxFileKilobytes(): int
    {
        $maxMb = (int) config('filesystems.max_upload_mb', (int) env('FILE_MAX_MB', 10));

        return max(1, $maxMb * 1024);
    }
}
