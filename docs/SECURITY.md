# SECURITY.md – แนวปฏิบัติด้านความปลอดภัยของแพลตฟอร์ม

ระบบนี้ให้บริการฟอร์มสาธารณะและพื้นที่ทำงานสำหรับบุคลากร จึงต้องควบคุมทั้ง CSRF, การอัปโหลดไฟล์, อัตราการเรียก และการจัดการ token อย่างรัดกุม เอกสารนี้สรุปนโยบายล่าสุดที่ทีมต้องปฏิบัติตาม

## 1. แอปพลิเคชันและโค้ด
- ใช้ HTTPS ทุกสภาพแวดล้อม พร้อมเปิด HSTS บน reverse proxy
- ปิด `APP_DEBUG` ใน production และใช้ exception handler ที่ส่งข้อความ generic ให้ผู้ใช้ (log รายละเอียดไว้ที่ server เท่านั้น)
- ทุก endpoint ใช้ Laravel Form Request ตรวจสอบ input และ resource จัดรูปแบบ response เพื่อลดข้อมูลเกินจำเป็น
- เปิดใช้ Sanctum personal access token พร้อม abilities: `viewer`, `staff`, `admin`
  - `/api/news` ใช้งานได้โดยไม่ต้องมี token
  - `/api/staff/news` ต้องมี ability `staff`
  - เขียน/แก้/ลบข่าวต้องมี ability `admin`
- ตรวจสอบสิทธิ์ด้วย middleware `abilities:<name>` เสมอเพื่อกัน token ที่ถูกยกระดับโดยไม่ตั้งใจ
- เปิด rate limit ตาม ENV: `RATE_LIMIT_PUBLIC`, `RATE_LIMIT_STAFF`, `RATE_LIMIT_AUTH_LOGIN_ATTEMPTS`/`RATE_LIMIT_AUTH_LOGIN_DECAY`
- Dependency ทั้งหมดต้องอัปเดตผ่าน Dependabot/Renovate และตรวจ `composer audit` ทุกเดือน

## 2. CSRF & Session Flow สำหรับ Public Forms
1. Frontend เรียก `GET /api/security/csrf-token` → ระบบส่ง cookie `XSRF-TOKEN` (SameSite=Lax) และ body `{ csrf_token }`
2. ทุกคำขอ `POST`/`PUT`/`DELETE` ต้องส่ง header `X-CSRF-TOKEN` (ค่าเดียวกับใน body) และ `X-Requested-With: XMLHttpRequest`
3. Middleware `api.csrf` จะตรวจสอบทั้ง token และ header ข้างต้น รวมถึง reject เมื่อ environment ไม่อนุญาต (ไม่มี bypass สำหรับ unit test)
4. หาก token mismatch จะได้ HTTP 419 พร้อม message generic

## 3. Upload Policy
- รองรับการอัปโหลดเฉพาะฟอร์ม `medical-record-request`
- ตรวจ MIME และนามสกุลจาก ENV (`FORM_ALLOWED_MIME`, `FORM_ALLOWED_EXT`) ก่อนบันทึก
- จำกัดขนาดไฟล์ด้วย `FORM_UPLOAD_MAX_MB` และส่ง error 422 หากเกิน
- เปลี่ยนชื่อไฟล์เป็น SHA-256 hash + extension ก่อนเก็บลง `storage/app/private/forms/medical-records`
- เก็บไฟล์นอก webroot พร้อมสิทธิ์ 750 / owner = web user (`www-data`)
- Log เฉพาะ hash, ขนาดไฟล์ (bytes) และ MIME ห้ามบันทึกชื่อไฟล์จริงหรือ path เต็ม

## 4. Logging & Observability
- Middleware `AssignRequestId` แนบ `X-Request-Id` ในทุกคำขอ พร้อมบันทึกลง Context
- Processor `RequestContextProcessor` เพิ่ม context ปลอดภัยในทุก log record: `request_id`, `user_id`, `ip`, `user_agent`
- ระดับ DEBUG ต้องเปิดด้วย `LOG_LEVEL=debug` เท่านั้น และห้ามใช้ใน production ยกเว้นช่วง incident (หลังจากนั้นปรับกลับเป็น `info`)
- ห้าม log credential, citizen_id, เบอร์โทร, อีเมล หรือข้อมูล PHI อื่น ๆ ให้ใช้ hash/summary หากจำเป็นต้องอ้างอิง
- เก็บ log ลง channel `structured` (JSON) เพื่อให้ง่ายต่อการ ingest เข้าสู่ระบบรวมศูนย์ เช่น Loki/ELK

## 5. Token & Authentication Policy
- Sanctum token สร้างผ่าน `POST /api/auth/login` โดย map role → abilities ดังนี้
  - `viewer` → `['viewer']`
  - `staff` → `['staff']`
  - `admin` → `['admin', 'staff']`
- Logout ใช้ `POST /api/auth/logout` ซึ่งจะลบ token ปัจจุบันเสมอ (แม้เรียกซ้ำ)
- ควรตั้ง cron ลบ token ที่หมดอายุหรือไม่ได้ใช้งานเกิน 90 วัน (`personal_access_tokens`)
- ข้อความ error ทุกกรณีต้องเป็น generic เช่น `Authentication failed.` เพื่อป้องกัน user enumeration

## 6. Rate Limiting
| Limiter | ค่า default | ครอบคลุม |
| --- | --- | --- |
| `public-api` | `RATE_LIMIT_PUBLIC` requests/นาที/ไอพี | `/api/health`, `/api/news`, `/api/security/csrf-token`, ฟอร์มสาธารณะ |
| `auth-login` | `RATE_LIMIT_AUTH_LOGIN_ATTEMPTS` ครั้งต่อ `RATE_LIMIT_AUTH_LOGIN_DECAY` นาที/ไอพี | `/api/auth/login` |
| `staff-api` | `RATE_LIMIT_STAFF` requests/นาที/ผู้ใช้ | `/api/auth/logout`, `/api/staff/me`, `/api/staff/news*` |

เพิ่ม limiter ใหม่เมื่อมี endpoint สำคัญอื่น ๆ และอัปเดตเอกสารนี้ทุกครั้ง

## 7. ข้อมูลและความเป็นส่วนตัว
- แฮชหมายเลขบัตรประชาชนด้วย `hash('sha256', citizen_id.APP_KEY)` และเก็บ mask (`1234******23`) เพื่อใช้อ้างอิง
- เก็บ IP และ User Agent ของทุกฟอร์มเพื่อการตรวจสอบ/ป้องกัน fraud แต่ให้ anonymise ตาม retention policy
- พิจารณาเข้ารหัสข้อมูลอ่อนไหวเพิ่มเติมด้วย `Crypt::encryptString` หากต้องเก็บเลขเวชระเบียนหรือเบอร์โทรในอนาคต
- ตรวจสอบ retention ตาม `docs/DB.md` และตั้ง batch job เพื่อลบ/เบลอข้อมูลเมื่อครบกำหนด

## 8. โครงสร้างพื้นฐาน
- Reverse proxy/Nginx ต้องตั้ง security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`)
- จำกัดสิทธิ์ระบบปฏิบัติการ: web user ไม่มีสิทธิ์ sudo และมีสิทธิ์เขียนเฉพาะ `storage/` และ `bootstrap/cache`
- เปิด firewall อนุญาตเฉพาะพอร์ตจำเป็น (80/443) และจำกัด SSH ให้เฉพาะ IP ที่อนุญาตพร้อม 2FA
- สำรองฐานข้อมูลและไฟล์แนบตามตารางใน `docs/DB.md`

## 9. กระบวนการและการอบรม
- ทำ access review (GitHub, Database, Server) ทุกไตรมาสและบันทึกผล
- จัดอบรม security awareness ปีละครั้ง และทบทวนนโยบาย PDPA เป็นประจำ
- ใช้ incident response plan ใน `docs/RUNBOOK.md` เมื่อเกิดเหตุผิดปกติ พร้อมเก็บหลักฐาน (log + request_id)

## 10. การรายงานช่องโหว่
- ภายใน: สร้าง ticket หมวด Security และแจ้งช่องทาง Teams `#hospital-ops`
- ภายนอก: เตรียมอีเมล `security@hospital.local` รับแจ้งและตอบรับภายใน 3 วันทำการ
- ติดตามการแก้ไขจนเสร็จ พร้อมทดสอบซ้ำและบันทึกลง `docs/CHANGELOG.md`
