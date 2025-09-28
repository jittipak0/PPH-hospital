<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class SatisfactionSurveyFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'score_overall' => ['required', 'integer', 'between:1,5'],
            'score_waittime' => ['required', 'integer', 'between:1,5'],
            'score_staff' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:600'],
            'service_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'score_overall.required' => 'กรุณาให้คะแนนความพึงพอใจโดยรวม',
            'score_overall.between' => 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5',
            'score_waittime.required' => 'กรุณาให้คะแนนความรวดเร็วในการให้บริการ',
            'score_waittime.between' => 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5',
            'score_staff.required' => 'กรุณาให้คะแนนการดูแลของบุคลากร',
            'score_staff.between' => 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5',
            'comment.max' => 'ข้อเสนอแนะไม่ควรเกิน :max ตัวอักษร',
            'service_date.required' => 'กรุณาระบุวันที่เข้ารับบริการ',
            'service_date.date' => 'รูปแบบวันที่ไม่ถูกต้อง',
        ];
    }

    public function attributes(): array
    {
        return [
            'score_overall' => 'คะแนนความพึงพอใจโดยรวม',
            'score_waittime' => 'คะแนนความรวดเร็วในการให้บริการ',
            'score_staff' => 'คะแนนการดูแลของบุคลากร',
            'comment' => 'ข้อเสนอแนะ',
            'service_date' => 'วันที่เข้ารับบริการ',
        ];
    }
}
