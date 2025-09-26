<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class SatisfactionSurveyFormRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'max:150'],
            'hn' => ['nullable', 'string', 'max:20'],
            'service_date' => ['required', 'date'],
            'service_type' => ['required', 'in:outpatient,inpatient,emergency,telemedicine'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['nullable', 'string', 'max:1500'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'consent' => ['accepted'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
