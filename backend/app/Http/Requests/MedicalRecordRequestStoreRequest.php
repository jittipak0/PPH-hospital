<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class MedicalRecordRequestStoreRequest extends FormRequest
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
            'citizen_id' => ['required', 'string', 'regex:/^\d{6,13}$/'],
            'hn' => ['required', 'string', 'max:20'],
            'fullname' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date', 'before_or_equal:today'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email:rfc,dns'],
            'purpose' => ['required', 'string'],
            'date_range' => ['nullable', 'string', 'max:255'],
            'delivery_method' => ['required', Rule::in(['pickup', 'post', 'elec'])],
            'consent' => ['accepted'],
            'files' => ['nullable', 'array', 'max:5'],
            'files.*' => ['file', 'mimes:pdf,jpg,jpeg,png', 'max:' . $this->maxFileKilobytes()],
        ];
    }
}
