<?php

namespace App\Http\Requests;

class SatisfactionSurveyStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'channel' => ['required', 'in:opd,ipd,online'],
            'score_service' => ['required', 'integer', 'min:1', 'max:5'],
            'score_clean' => ['required', 'integer', 'min:1', 'max:5'],
            'score_speed' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
            'contact_optin' => ['sometimes', 'boolean'],
        ];
    }
}
