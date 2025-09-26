<x-mail::message>
# แจ้งเตือนการส่งแบบฟอร์มใหม่

มีการส่งแบบฟอร์มประเภท **{{ str_replace('_', ' ', $type) }}** เข้ามาใหม่ กรุณาตรวจสอบในระบบหลังบ้าน
เพื่อดำเนินการต่อไป

@foreach($payload as $label => $value)
- **{{ ucfirst(str_replace('_', ' ', $label)) }}:** {{ $value }}
@endforeach

ขอบคุณครับ/ค่ะ,<br>
{{ config('app.name') }}
</x-mail::message>
