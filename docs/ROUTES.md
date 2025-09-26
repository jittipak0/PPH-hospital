# ROUTES.md – แผนผังเส้นทางและการเข้าถึง

ระบบโรงพยาบาลโพนพิสัยรุ่นนี้แบ่งเส้นทางหลักออกเป็น 3 กลุ่ม ได้แก่ API สาธารณะสำหรับเนื้อหา (CMS เบา ๆ), แบบฟอร์มบริการ, และหน้าสำหรับบุคลากรภายใน เว็บไซต์ฝั่ง React จะอ้างอิงข้อมูลจากเอกสารนี้เมื่อเพิ่มเมนูใหม่ โปรดอัปเดตไฟล์ทุกครั้งที่มีการเพิ่ม/ยกเลิก endpoint หรือหน้าบริการ

## 1. API สาธารณะ (ไม่ต้องล็อกอิน)
| Method | Path | รายละเอียด | Query/Payload | Response |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | ตรวจสอบสุขภาพระบบ | – | `{ "ok": true }` |
| GET | `/api/pages` | ดึงรายการหน้าเนื้อหาแบบย่อ | Query: `category=about|academic|programs|legal|procurement|services|donation|feedback|internal` (optional) | `{ data: [{ id, title, slug, category, updated_at }, ...] }` |
| GET | `/api/pages/{slug}` | รายละเอียดหน้าเนื้อหา (แปลง Markdown → HTML ให้เรียบร้อย) | Path parameter: `slug` จาก `pages.slug` | `{ data: { title, slug, category, content_html, updated_at } }` |

> หมายเหตุ: หากสถานะหน้า (`pages.status`) เป็น `draft` จะต้องมี session บุคลากร (Sanctum) ถึงจะเรียกได้สำเร็จ

## 2. แบบฟอร์มสาธารณะ (ต้องมี CSRF + throttle 20/min/IP)
ทุกคำร้องต้องเรียก `GET /sanctum/csrf-cookie` ก่อน แล้วส่ง header `X-XSRF-TOKEN` พร้อม cookie `XSRF-TOKEN`

| Method | Path | ใช้ทำอะไร | Payload หลัก | แนบไฟล์ | Response |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/forms/medical-records` | ขอคัดสำเนาเวชระเบียน | `citizen_id`, `hn`, `fullname`, `dob`, `phone`, `email`, `purpose`, `delivery_method` (`pickup|post|elec`), `consent` (boolean), `files[]` (≤5) | PDF/JPG/PNG รวม ≤ FILE_MAX_MB แต่ละไฟล์ | `201 { data: { id, status } }` |
| POST | `/api/forms/donations` | แจ้งความประสงค์บริจาค | `donor_name`, `phone?`, `email?`, `amount`, `channel` (`bank|qr|cash`), `message?` | – | `201 { data: { id, status } }` |
| POST | `/api/forms/satisfaction` | แบบประเมินความพึงพอใจ | `channel` (`opd|ipd|online`), `score_service`, `score_clean`, `score_speed`, `comment?`, `contact_optin?` | – | `201 { data: { id } }` |

> Rate limit ของกลุ่มนี้กำหนดที่ middleware `throttle:public-forms`

## 3. แบบฟอร์มบุคลากร (ต้อง auth:sanctum)
ต้องมี session บุคลากรที่ออกโดย Sanctum (ดูหน้า Login ภายใน) เมื่อไม่ล็อกอินระบบจะตอบ 401

| Method | Path | ใช้ทำอะไร | Payload หลัก | แนบไฟล์ | Response |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/forms/fuel-claims` | เบิกค่าน้ำมัน | `staff_id`, `dept`, `vehicle_plate`, `trip_date`, `liters`, `amount`, `note?` | `receipt` (PDF/JPG/PNG) | `201 { data: { id, status } }` |
| POST | `/api/forms/archive-requests` | ขอใช้เอกสารจากศูนย์จัดเก็บ | `staff_id`, `document_type`, `ref_no`, `needed_date`, `note?` | – | `201 { data: { id, status } }` |

## 4. การแมปหน้าฝั่ง Frontend → API
ตารางนี้ใช้ยืนยันเส้นทางบน React Router (`frontend/src/pages.config.ts`) ว่าครอบคลุมทุกหมวด พร้อมสถานะการเข้าถึง

| เส้นทางหน้าเว็บ | หมวดหมู่ | Auth | API/แหล่งข้อมูล |
| --- | --- | --- | --- |
| `/` | Home | Public | Static (React) |
| `/about/leadership` | About | Public | `/api/pages/leadership` |
| `/about/history` | About | Public | `/api/pages/history` |
| `/about/vision-mission-values` | About | Public | `/api/pages/vision-mission-values` |
| `/academic/publications` | Academic | Public | `/api/pages/publications` |
| `/ethics/club` | Academic & Ethics | Public | `/api/pages/ethics-club` |
| `/programs/health-rider` | Programs | Public | `/api/pages/health-rider` |
| `/programs/anti-stigma` | Programs | Public | `/api/pages/anti-stigma` |
| `/legal/acts` | Legal | Public | `/api/pages/acts` |
| `/procurement-ita` | Procurement & ITA | Public | `/api/pages/procurement-ita` |
| `/online-services` | Online Services landing | Public | Static (React) |
| `/forms/medical-record-request` | Online Services | Public | POST `/api/forms/medical-records` |
| `/donation` | Donation | Public | POST `/api/forms/donations` |
| `/feedback/satisfaction` | Feedback | Public | POST `/api/forms/satisfaction` |
| `/internal/fuel-claims` | Internal | Staff only | POST `/api/forms/fuel-claims` |
| `/internal/archive-center` | Internal | Staff only | POST `/api/forms/archive-requests` |

นอกจากนี้ยังมีหน้าคงที่: `/privacy-policy`, `/terms`, `/sitemap`, `/login`, `/dashboard`

## 5. ตัวอย่างการทดสอบแบบฟอร์ม (curl)
```bash
curl -X POST https://hospital.local/api/forms/medical-records \
  -H 'Content-Type: multipart/form-data' \
  -H "X-XSRF-TOKEN: $(php -r 'echo urlencode($_COOKIE["XSRF-TOKEN"] ?? "");')" \
  -b 'XSRF-TOKEN=...; laravel_session=...' \
  -F citizen_id=1234567890123 \
  -F hn=112233 \
  -F fullname='นางสาวตัวอย่าง ผู้ป่วย' \
  -F dob=1990-01-01 \
  -F phone='0812345678' \
  -F email='patient@example.com' \
  -F purpose='ขอประวัติประกอบการรักษาต่อเนื่อง' \
  -F delivery_method=pickup \
  -F consent=1
```
> จำเป็นต้องเรียก `/sanctum/csrf-cookie` เพื่อรับ cookie มาก่อนทุกคำขอจากฝั่ง public

## 6. สถานะ HTTP ที่ใช้ร่วมกัน
- 201 – สร้างคำร้องสำเร็จ (ทุกแบบฟอร์ม)
- 401 – ไม่มีสิทธิ์เข้าถึง (staff forms)
- 403 – หน้าเนื้อหาเป็น draft และผู้ใช้ไม่ล็อกอิน
- 422 – Validation ล้มเหลว `{ "errors": { "field": ["ข้อความ"] } }`
- 429 – เกิน rate limit (`throttle:public-forms`)
- 500 – ระบบผิดพลาด (ตรวจสอบ log)
