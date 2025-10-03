<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordRequestStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $maxFileSize = max(1, (int) env('FORM_UPLOAD_MAX_MB', 10)) * 1024;
        $allowedMime = $this->splitList(env('FORM_ALLOWED_MIME', 'application/pdf,image/jpeg,image/png'));
        $allowedExt = $this->splitList(env('FORM_ALLOWED_EXT', 'pdf,jpg,jpeg,png'));

        $fileRules = [
            'required',
            'file',
        ];

        if ($allowedMime !== []) {
            $fileRules[] = 'mimetypes:'.implode(',', $allowedMime);
        }

        if ($allowedExt !== []) {
            $fileRules[] = 'mimes:'.implode(',', $allowedExt);
        }

        $fileRules[] = 'max:'.$maxFileSize;

        return [
            'full_name' => ['required', 'string', 'max:255'],
            'hn' => ['required', 'string', 'max:50'],
            'citizen_id' => ['required', 'regex:/^[0-9]{13}$/'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'reason' => ['nullable', 'string'],
            'consent' => ['accepted'],
            'idcard_file' => $fileRules,
        ];
    }

    /**
     * @return list<string>
     */
    protected function splitList(?string $value): array
    {
        if (! $value) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $value))));
    }
}
