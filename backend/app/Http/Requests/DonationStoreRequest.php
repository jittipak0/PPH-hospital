<?php

namespace App\Http\Requests;

class DonationStoreRequest extends FormRequest
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
            'donor_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email:rfc,dns'],
            'amount' => ['required', 'numeric', 'min:1'],
            'channel' => ['required', 'in:bank,qr,cash'],
            'message' => ['nullable', 'string', 'max:500'],
        ];
    }
}
