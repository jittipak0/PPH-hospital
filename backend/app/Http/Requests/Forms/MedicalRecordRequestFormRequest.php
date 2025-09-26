<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordRequestFormRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:3', 'max:150'],
            'hn' => ['required', 'string', 'max:20'],
            'citizen_id' => ['required', 'digits:13'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email'],
            'address' => ['required', 'string', 'max:500'],
            'reason' => ['required', 'string', 'max:1000'],
            'consent' => ['accepted'],
            'idcard_file' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:5120'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
