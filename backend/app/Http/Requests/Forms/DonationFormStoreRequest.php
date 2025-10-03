<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class DonationFormStoreRequest extends FormRequest
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
            'donor_name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'channel' => ['required', 'string', 'in:cash,bank,promptpay'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'note' => ['nullable', 'string'],
        ];
    }
}
