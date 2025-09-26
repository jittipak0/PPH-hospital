# ROUTES.md – สรุปเส้นทางและสัญญา API

เอกสารนี้รวบรวม endpoint ที่เตรียมไว้ในสตาร์ตเตอร์ (Laravel + Sanctum) พร้อมสิทธิ์ที่ต้องมี พารามิเตอร์ และตัวอย่างการใช้งาน โปรดอัปเดตทุกครั้งที่เพิ่มหรือแก้ไขเส้นทางใหม่

## 1. เส้นทางสาธารณะ (Public)
| Method | Path | Auth | คำอธิบาย | พารามิเตอร์/หมายเหตุ | ตัวอย่าง Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | ไม่ต้องล็อกอิน | ตรวจสุขภาพระบบ (API + DB) | ใช้สำหรับ monitoring | `{ "ok": true }`
| GET | `/api/news` | ไม่ต้องล็อกอิน | รายการข่าวที่เผยแพร่แล้ว | Query: `page` (เริ่ม 1), `limit` (default 20) | Laravel pagination object ที่มี `data`, `links`, `meta`

## 2. Authentication
| Method | Path | Auth | คำอธิบาย | Payload | Response |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | ไม่ต้องล็อกอิน | ล็อกอินด้วยอีเมล + รหัสผ่าน | `{ "email": "admin@example.com", "password": "secret" }` | สำเร็จ: `{ "token": "...", "role": "admin" }` ผิดพลาด: 401 + `{ "error": "Invalid credentials" }`
| POST | `/api/auth/logout` | Bearer token (Sanctum) | ถอนสิทธิ์ token ปัจจุบัน | header `Authorization: Bearer <token>` | `{ "ok": true }`
| GET | `/api/staff/me` | Bearer token | ดูข้อมูลผู้ใช้ปัจจุบัน | - | `{ "id": 1, "name": "นพ.สมชาย", "email": "...", "role": "admin" }`

## 3. เส้นทางสำหรับ Staff / Admin (ข่าว)
| Method | Path | Auth (Ability) | คำอธิบาย | Payload/Query | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/staff/news` | Bearer token (`staff` หรือ `admin`) | รายการข่าวทั้งหมดสำหรับจัดการ | Query: `page`, `limit` (default 20) | Pagination object (`data` + `meta`) | 
| POST | `/api/staff/news` | Bearer token (`staff` หรือ `admin`) | สร้างข่าวใหม่ | `{ "title": "ข้อความ", "body": "รายละเอียด", "published_at": "2025-01-01T10:00:00Z" }` | 201 + JSON ของข่าว | 
| PUT | `/api/staff/news/{id}` | Bearer token (`staff` หรือ `admin`) | แก้ไขข่าว | ค่าเหมือนกับ POST (ช่องใดไม่ส่งจะไม่เปลี่ยน) | 200 + JSON ของข่าวล่าสุด |
| DELETE | `/api/staff/news/{id}` | Bearer token (`admin` เท่านั้น) | ลบข่าว | - | `{ "ok": true }`

## 4. รูปแบบ Error และสถานะ HTTP ที่ใช้
- Validation ผิดพลาด: 422 + `{ "errors": { "field": ["ข้อความ"] } }`
- สิทธิ์ไม่พอ: 403 + `{ "error": "This action is unauthorized." }`
- ไม่พบข้อมูล: 404 + `{ "error": "Not Found" }`
- เกิดข้อผิดพลาดในระบบ: 500 + `{ "error": "Server Error" }` (โปรดเติม logging/trace ใน production)

## 5. แนวทางเพิ่มเติม
- ทุก endpoint ควรรองรับ header `Accept: application/json`
- หากเพิ่มเวอร์ชันใหม่ ให้นำหน้าด้วย `/api/v2/...` และดูแลให้เอกสารทั้ง Postman + README อัปเดตทันที
- เพิ่ม test ใน `tests/Feature` เมื่อมีการเพิ่มเส้นทางใหม่ เพื่อป้องกัน regression
- ระบุความถี่ในการเรียกและ limit ไว้ใน `docs/SECURITY.md` เมื่อมีการกำหนด rate limit เฉพาะ
