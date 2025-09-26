<?php

namespace App\Http\Requests;

class ArchiveRequestStoreRequest extends FormRequest
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
            'document_type' => ['required', 'string', 'max:255'],
            'ref_no' => ['required', 'string', 'max:255'],
            'needed_date' => ['required', 'date', 'after_or_equal:today'],
            'note' => ['nullable', 'string'],
        ];
    }
}
