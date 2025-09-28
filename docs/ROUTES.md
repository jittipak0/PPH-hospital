# ROUTES.md – สรุปเส้นทางและสัญญา API

เอกสารนี้รวบรวม endpoint ที่เตรียมไว้ในสตาร์ตเตอร์ (Laravel + Sanctum) พร้อมสิทธิ์ที่ต้องมี พารามิเตอร์ และตัวอย่างการใช้งาน โปรดอัปเดตทุกครั้งที่เพิ่มหรือแก้ไขเส้นทางใหม่

## 0. หน้าสาธารณะ (Frontend Pages)
| Path | หมวด | คำอธิบาย | สิทธิ์ |
| --- | --- | --- | --- |
| `/` | หน้าแรก | แสดงบริการ โครงการ Quick links และข่าวล่าสุด | สาธารณะ |
| `/about/leadership` | เกี่ยวกับโรงพยาบาล | ทำเนียบผู้บริหารและโครงสร้างการบริหาร | สาธารณะ |
| `/about/history` | เกี่ยวกับโรงพยาบาล | ลำดับเหตุการณ์สำคัญของโรงพยาบาล | สาธารณะ |
| `/about/vision-mission-values` | เกี่ยวกับโรงพยาบาล | วิสัยทัศน์ พันธกิจ และค่านิยม | สาธารณะ |
| `/ethics`, `/ethics/club`, `/ethics/anti-stigma`, `/ethics/laws-acts` | ธรรมาภิบาล/จริยธรรม | นโยบายธรรมาภิบาล ชมรมจริยธรรม มาตรการลดการตีตรา และกฎหมายที่เกี่ยวข้อง | สาธารณะ |
| `/academic/publications` | วิชาการ | ฐานข้อมูลผลงานวิชาการและงานวิจัย | สาธารณะ |
| `/programs/health-rider` | โครงการเด่น | สมัครบริการ Health Rider ส่งยาถึงบ้าน | สาธารณะ (ใช้ฟอร์ม) |
| `/services/online` | บริการออนไลน์ | รวมบริการนัดหมาย ผลตรวจออนไลน์ และช่องทางติดต่อ | สาธารณะ |
| `/transparency/procurement-ita` | ความโปร่งใส | ข่าวจัดซื้อจัดจ้างและสรุปผล ITA | สาธารณะ |
| `/forms/medical-record-request` | แบบฟอร์ม | คำขอรับสำเนาประวัติการรักษา (อัปโหลดไฟล์ได้) | สาธารณะ |
| `/forms/donation` | แบบฟอร์ม | แบบฟอร์มรับบริจาคและออกใบเสร็จ | สาธารณะ |
| `/forms/satisfaction` | แบบฟอร์ม | แบบประเมินความพึงพอใจผู้รับบริการ | สาธารณะ |
| `/intranet/fuel-reimbursement` | ระบบภายใน | ระบบเบิกจ่ายน้ำมัน (แสดงเฉพาะผู้มีสิทธิ์) | Require login + role=staff |
| `/intranet/document-center` | ระบบภายใน | คลังเอกสารภายในพร้อมตัวกรอง | Require login + role=staff |

## 1. เส้นทางสาธารณะ (Public API)
| Method | Path | Auth | คำอธิบาย | พารามิเตอร์/หมายเหตุ | ตัวอย่าง Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | ไม่ต้องล็อกอิน | ตรวจสุขภาพระบบ (API + DB) | ใช้สำหรับ monitoring | `{ "ok": true }` |
| GET | `/api/news` | ไม่ต้องล็อกอิน | รายการข่าวที่เผยแพร่แล้ว | Query: `page` (เริ่ม 1), `limit` (default 20) | Laravel pagination object ที่มี `data`, `links`, `meta` |
| GET | `/api/security/csrf-token` | ไม่ต้องล็อกอิน | คืนค่า CSRF token สำหรับฟอร์มสาธารณะ | ต้องเรียกก่อน POST พร้อม `credentials: include` | `{ "csrfToken": "..." }` |
| POST | `/api/forms/medical-record-request` | ต้องมี CSRF token | รับคำขอคัดสำเนาประวัติการรักษา พร้อมไฟล์แนบ | Payload JSON + `idcard_file` (multipart), rate limit 10/minute ต่อ IP | 201 + `{ "ok": true, "id": "1", "message": "..." }` |
| POST | `/api/forms/donation` | ต้องมี CSRF token | บันทึกคำขอบริจาคเงิน | `{ "donor_name": "...", "amount": 500, "channel": "bank", "phone": "0...", "email": "..." }` | 201 + `{ "ok": true, "id": "5", "message": "ขอบคุณ..." }` |
| POST | `/api/forms/satisfaction` | ต้องมี CSRF token | แบบประเมินความพึงพอใจผู้ป่วย | `{ "score_overall": 5, "score_waittime": 4, "score_staff": 5, "service_date": "2024-09-01" }` | 201 + `{ "ok": true, "id": "12", "message": "ขอบคุณ..." }` |
| POST | `/api/programs/health-rider/apply` | ต้องมี CSRF token | สมัครบริการส่งยาถึงบ้าน Health Rider | `{ "full_name": "...", "hn": "AB123", "address": "...", "district": "...", "province": "...", "zipcode": "43120", "phone": "0...", "consent": true }` | 201 + `{ "ok": true, "id": "3", "message": "ทีม Health Rider จะติดต่อ..." }` |

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
