<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class DonationFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'min:2', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'channel' => ['required', 'in:cash,bank,promptpay'],
            'phone' => ['required', 'string', 'regex:/^(0[0-9]{8,9})$/'],
            'email' => ['required', 'email'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'donor_name.required' => 'กรุณากรอกชื่อผู้บริจาค',
            'amount.required' => 'กรุณาระบุจำนวนเงินที่ต้องการบริจาค',
            'amount.numeric' => 'จำนวนเงินต้องเป็นตัวเลข',
            'amount.min' => 'จำนวนเงินต้องมากกว่า 0',
            'channel.required' => 'กรุณาเลือกช่องทางการบริจาค',
            'channel.in' => 'ช่องทางการบริจาคไม่ถูกต้อง',
            'phone.required' => 'กรุณากรอกหมายเลขโทรศัพท์',
            'phone.regex' => 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก',
            'email.required' => 'กรุณากรอกอีเมล',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'note.max' => 'หมายเหตุไม่ควรเกิน :max ตัวอักษร',
        ];
    }

    public function attributes(): array
    {
        return [
            'donor_name' => 'ชื่อผู้บริจาค',
            'amount' => 'จำนวนเงิน',
            'channel' => 'ช่องทางการบริจาค',
            'phone' => 'เบอร์โทรศัพท์',
            'email' => 'อีเมล',
            'note' => 'หมายเหตุ',
        ];
    }
}
