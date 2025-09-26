<?php

namespace App\Http\Requests;

class FuelClaimStoreRequest extends FormRequest
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
            'staff_id' => ['required', 'integer'],
            'dept' => ['required', 'string', 'max:255'],
            'vehicle_plate' => ['required', 'string', 'max:20'],
            'trip_date' => ['required', 'date'],
            'liters' => ['required', 'numeric', 'min:0.1'],
            'amount' => ['required', 'numeric', 'min:0'],
            'receipt' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:' . $this->maxFileKilobytes()],
            'note' => ['nullable', 'string'],
        ];
    }
}
