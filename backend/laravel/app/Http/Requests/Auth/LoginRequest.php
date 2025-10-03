<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        Log::debug('LoginRequest: applying validation rules.');

        return [
            'username' => ['required', 'string', 'max:190'],
            'password' => ['required', 'string', 'min:8', 'max:190'],
        ];
    }

    protected function passedValidation(): void
    {
        Log::debug('LoginRequest: validation passed.');
    }
}
