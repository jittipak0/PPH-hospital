<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsIndexRequest extends FormRequest
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'sort' => ['sometimes', Rule::in(['published_at', '-published_at'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'per_page' => $this->input('per_page', 10),
            'sort' => $this->input('sort', '-published_at'),
        ]);
    }
}
