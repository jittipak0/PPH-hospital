<?php

namespace App\Http\Requests\Forms;

use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordRequestFormRequest extends FormRequest
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
            'citizen_id' => ['required', 'string', 'regex:/^[0-9]{13}$/'],
            'phone' => ['required', 'string', 'regex:/^(0[0-9]{8,9})$/'],
            'email' => ['required', 'email'],
            'address' => ['required', 'string', 'min:10'],
            'reason' => ['required', 'string', 'min:10'],
            'consent' => ['accepted'],
            'idcard_file' => [
                'nullable',
                'file',
                'max:' . config('forms.upload.max_kb'),
                'mimes:' . implode(',', config('forms.upload.allowed_extensions')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'กรุณากรอกชื่อ-นามสกุล',
            'hn.required' => 'กรุณากรอกหมายเลข HN',
            'hn.regex' => 'หมายเลข HN ต้องเป็นตัวอักษรหรือตัวเลข 3-20 ตัว',
            'citizen_id.required' => 'กรุณากรอกเลขประจำตัวประชาชน',
            'citizen_id.regex' => 'เลขประจำตัวประชาชนต้องมี 13 หลัก',
            'phone.required' => 'กรุณากรอกหมายเลขโทรศัพท์',
            'phone.regex' => 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก',
            'email.required' => 'กรุณากรอกอีเมล',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'address.required' => 'กรุณาระบุที่อยู่สำหรับติดต่อ',
            'address.min' => 'ที่อยู่ควรมีความยาวอย่างน้อย 10 ตัวอักษร',
            'reason.required' => 'กรุณาระบุเหตุผลในการขอข้อมูล',
            'reason.min' => 'เหตุผลควรมีความยาวอย่างน้อย 10 ตัวอักษร',
            'consent.accepted' => 'กรุณายืนยันการยินยอมให้โรงพยาบาลจัดเก็บข้อมูล',
            'idcard_file.file' => 'ไฟล์แนบไม่ถูกต้อง',
            'idcard_file.max' => 'ไฟล์แนบต้องมีขนาดไม่เกิน :max KB',
            'idcard_file.mimes' => 'รองรับเฉพาะไฟล์ PDF, JPG หรือ PNG เท่านั้น',
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'ชื่อ-นามสกุล',
            'hn' => 'หมายเลข HN',
            'citizen_id' => 'เลขประจำตัวประชาชน',
            'phone' => 'เบอร์โทรศัพท์',
            'email' => 'อีเมล',
            'address' => 'ที่อยู่',
            'reason' => 'เหตุผลในการขอข้อมูล',
            'idcard_file' => 'สำเนาบัตรประชาชน',
        ];
    }
}
