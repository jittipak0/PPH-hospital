<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class NewsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:200'],
            'body' => ['sometimes', 'nullable', 'string'],
            'published_at' => ['sometimes', 'nullable', 'date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $hasAtLeastOneField = collect(['title', 'body', 'published_at'])
                ->contains(fn (string $field) => $this->filled($field) || $this->has($field));

            if (! $hasAtLeastOneField) {
                $validator->errors()->add('payload', 'At least one field must be provided.');
            }
        });
    }
}
