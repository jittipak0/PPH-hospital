<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class HealthRiderApplicationStoreRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:255'],
            'hn' => ['nullable', 'string', 'max:50'],
            'address' => ['required', 'string'],
            'district' => ['required', 'string', 'max:120'],
            'province' => ['required', 'string', 'max:120'],
            'zipcode' => ['required', 'string', 'max:10'],
            'phone' => ['required', 'string', 'max:30'],
            'line_id' => ['nullable', 'string', 'max:100'],
            'consent' => ['accepted'],
        ];
    }
}
