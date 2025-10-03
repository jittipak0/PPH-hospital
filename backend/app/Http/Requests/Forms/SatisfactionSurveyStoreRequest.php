<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class SatisfactionSurveyStoreRequest extends FormRequest
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
        return [
            'score_overall' => ['required', 'integer', 'between:1,5'],
            'score_waittime' => ['required', 'integer', 'between:1,5'],
            'score_staff' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string'],
            'service_date' => ['nullable', 'date'],
        ];
    }
}
