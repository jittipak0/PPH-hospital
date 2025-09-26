# DB.md – สคีมาฐานข้อมูลล่าสุด

โครงสร้างฐานข้อมูล Laravel สำหรับระบบนี้รองรับทั้งหน้าเนื้อหา (CMS เบา ๆ) และแบบฟอร์มบริการที่เก็บประวัติคำร้องไว้ครบถ้วน ทุกตารางใช้เวลาปรับเป็น UTC และบันทึก timestamps โดยอัตโนมัติ ข้อมูลด้านล่างสรุปคอลัมน์หลัก ดัชนี และความสัมพันธ์ที่เกี่ยวข้อง

## 1. ตารางหลัก

### 1.1 `pages`
- `id` (PK, auto increment)
- `slug` (string, unique) – ใช้เป็น path บนเว็บและสำหรับ API `/api/pages/{slug}`
- `title` (string)
- `category` (enum/string) – ค่าที่ใช้ใน `frontend/src/pages.config.ts`
- `content_md` (longText) – Markdown เก็บในฐานข้อมูล
- `status` (`draft|published`)
- `published_at` (datetime nullable)
- `updated_by` (nullable unsignedBigInteger) – รองรับเชื่อมผู้ใช้ staff ในอนาคต
- `timestamps`

> โมเดล `App\Models\Page` มี scope `published()` และ policy `PagePolicy` จำกัดการเข้าถึงเฉพาะ `published` หากไม่ล็อกอิน

### 1.2 `medical_record_requests`
- ฟิลด์สำคัญ: `citizen_id`, `hn`, `fullname`, `dob`, `phone`, `email`, `purpose`, `date_range`, `delivery_method`, `consent` (boolean), `files` (json array เก็บ path), `status` (`new|processing|done|rejected`)
- เก็บไฟล์ไว้บน disk `uploads`
- Trait `LogsModelActivity` จะบันทึก log ทุกครั้งที่มีการสร้างคำร้อง

### 1.3 `fuel_claims`
- ฟิลด์: `staff_id` (int), `dept`, `vehicle_plate`, `trip_date`, `liters`, `amount`, `receipt_path`, `note`, `status`
- รับเฉพาะบุคลากรผ่าน Sanctum
- เก็บใบเสร็จใน disk `uploads`

### 1.4 `archive_requests`
- ฟิลด์: `staff_id`, `document_type`, `ref_no`, `needed_date`, `note`, `status`
- ไม่มีไฟล์แนบ แต่มีการ log กิจกรรมผ่าน trait

### 1.5 `donations`
- ฟิลด์: `donor_name`, `phone`, `email`, `amount` (decimal 12,2), `channel` (`bank|qr|cash`), `message`, `status`
- ใช้สำหรับแจ้งเตือนทีมงาน (Mail optional)

### 1.6 `satisfaction_surveys`
- ฟิลด์: `channel` (`opd|ipd|online`), `score_service`, `score_clean`, `score_speed` (int 1..5), `comment`, `contact_optin` (bool)
- ไม่มีข้อมูลระบุตัวตนเพิ่มเติมเพื่อรักษาความเป็นส่วนตัว

### 1.7 `personal_access_tokens`
- มาจาก Laravel Sanctum ใช้จัดการ session บุคลากรสำหรับแบบฟอร์มภายใน

## 2. ความสัมพันธ์และข้อควรทราบ
- ตารางแบบฟอร์มทั้งหมดไม่มี FK กับ `users` ในตอนนี้ แต่คอลัมน์ `staff_id` รองรับการเชื่อมโยงในอนาคต
- ช่อง `files` ของ `medical_record_requests` ใช้ `json` เก็บ path หลายไฟล์ ควรใช้งานผ่าน accessor หรือแปลงเป็น array ก่อนแสดงผล
- ทุกโมเดลที่ใช้ trait `LogsModelActivity` จะส่ง log ไปที่ channel `stack` (`storage/logs/laravel.log`) เพื่อใช้ตรวจสอบย้อนหลัง
- การอัปเดตเนื้อหาใน `pages` สามารถทำผ่าน seeder (`database/seeders/PageSeeder.php`) หรือแก้ไขผ่านฐานข้อมูลโดยตรง แล้วเรียก cache busting (`php artisan cache:clear`) หากมี caching เพิ่มเติม

## 3. การ migrate/seed
```bash
php artisan migrate --seed    # สร้างตารางทั้งหมด + seed หน้าเนื้อหาเริ่มต้น
```
- การรันซ้ำบนสภาพแวดล้อม dev จะใช้ `updateOrCreate` ทำให้แก้ไขเนื้อหาที่ seed ไว้ได้โดยไม่สร้างซ้ำ
- หากต้อง backfill ข้อมูลไฟล์ ให้รัน `php artisan storage:link` เพื่อสร้าง symlink `/public/storage/uploads`

## 4. แนวปฏิบัติเมื่อแก้ schema เพิ่มเติม
1. สร้าง migration ใหม่พร้อม `down()` ครบถ้วน
2. อัปเดต model, request validation และ resource ให้สอดคล้อง
3. เพิ่มข้อมูลตัวอย่างใน seeder หรือ factory ตามความจำเป็น
4. อัปเดตเอกสาร (`docs/DB.md`, `docs/ROUTES.md`, `docs/README.md`)
5. แจ้งทีม Ops หากมีผลกับ production (downtime/maintenance window)

## 5. การเลือกฐานข้อมูล dev/prod
- ค่าเริ่มต้นใช้ SQLite (`DB_CONNECTION=sqlite`) เหมาะสำหรับทดสอบ local
- สำหรับ staging/production ให้สลับเป็น MySQL/MariaDB โดยตั้งค่า `DB_CONNECTION=mysql`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- ปรับ `DATASTORE_CONNECTION` ให้ตรงกับ connection หลักเพื่อให้ repository/adapter (ถ้ามี) ทำงานถูกต้อง
