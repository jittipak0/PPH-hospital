<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class DonationFormRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'min:2', 'max:150'],
            'amount' => ['required', 'numeric', 'min:1'],
            'channel' => ['required', 'in:cash,bank_transfer,online'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'wants_receipt' => ['required', 'boolean'],
            'consent' => ['accepted'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
