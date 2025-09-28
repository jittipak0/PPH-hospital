<?php

namespace App\Http\Requests\Programs;

use Illuminate\Foundation\Http\FormRequest;

class HealthRiderApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'hn' => ['required', 'string', 'max:50', 'regex:/^[A-Za-z0-9\-]{3,20}$/'],
            'address' => ['required', 'string', 'min:10'],
            'district' => ['required', 'string', 'max:120'],
            'province' => ['required', 'string', 'max:120'],
            'zipcode' => ['required', 'string', 'regex:/^[0-9]{5}$/'],
            'phone' => ['required', 'string', 'regex:/^(0[0-9]{8,9})$/'],
            'line_id' => ['nullable', 'string', 'max:50'],
            'consent' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'กรุณากรอกชื่อ-นามสกุลผู้ป่วย',
            'hn.required' => 'กรุณากรอกหมายเลข HN',
            'hn.regex' => 'หมายเลข HN ต้องเป็นตัวอักษรหรือตัวเลข 3-20 ตัว',
            'address.required' => 'กรุณาระบุที่อยู่จัดส่งยา',
            'address.min' => 'ที่อยู่ควรมีความยาวอย่างน้อย 10 ตัวอักษร',
            'district.required' => 'กรุณากรอกเขต/อำเภอ',
            'province.required' => 'กรุณากรอกจังหวัด',
            'zipcode.required' => 'กรุณากรอกรหัสไปรษณีย์',
            'zipcode.regex' => 'รหัสไปรษณีย์ต้องมี 5 หลัก',
            'phone.required' => 'กรุณากรอกหมายเลขโทรศัพท์',
            'phone.regex' => 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก',
            'line_id.max' => 'Line ID ไม่ควรเกิน :max ตัวอักษร',
            'consent.accepted' => 'กรุณายืนยันการยินยอมให้จัดเก็บและใช้ข้อมูลตามนโยบาย PDPA',
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'ชื่อ-นามสกุล',
            'hn' => 'หมายเลข HN',
            'address' => 'ที่อยู่',
            'district' => 'เขต/อำเภอ',
            'province' => 'จังหวัด',
            'zipcode' => 'รหัสไปรษณีย์',
            'phone' => 'เบอร์โทรศัพท์',
            'line_id' => 'Line ID',
        ];
    }
}
