<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'title' => ['sometimes','required','string','max:200'],
            'body' => ['nullable','string'],
            'published_at' => ['nullable','date'],
        ];
    }
}
