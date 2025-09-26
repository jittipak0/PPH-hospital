# PPH Hospital Portal – คู่มือภาพรวม

ชุดโค้ดนี้ประกอบด้วย **Laravel 11 (API)** และ **React 18 (Vite)** สำหรับพัฒนาเว็บไซต์โรงพยาบาลโพนพิสัย โดยรอบนี้เพิ่มหน้าเนื้อหาแบบ CMS, แบบฟอร์มบริการประชาชน/บุคลากร, ดีไซน์หน้าแรกใหม่ และเครื่องมือประกอบ เช่น sitemap generator และชุดเอกสารอัปเดต

## ฟีเจอร์สำคัญ
- หน้าเนื้อหา (About, Programs, Legal ฯลฯ) แบ่งหมวดชัดเจน ข้อมูลเก็บในตาราง `pages` และดึงผ่าน `/api/pages/{slug}`
- แบบฟอร์มสาธารณะ 3 รายการ: ขอเวชระเบียน, การรับบริจาค, ประเมินความพึงพอใจ (รองรับไฟล์แนบ + rate limit)
- แบบฟอร์มบุคลากร 2 รายการ: เบิกค่าน้ำมัน, ขอเอกสารจากศูนย์จัดเก็บ (ต้องล็อกอินด้วย Sanctum)
- ระบบแจ้งเตือนอีเมล (optional) ผ่าน `NOTIFY_EMAIL` + Mail queue
- หน้า Home และ Online Services ปรับดีไซน์ใหม่ พร้อม Toast แจ้งผลการส่งฟอร์ม
- สคริปต์ `npm run prebuild` สร้าง `public/sitemap.xml` จาก `src/pages.config.ts`

## การตั้งค่าเริ่มต้น

### 1. Backend (Laravel)
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link   # เพื่อเปิด path /storage/uploads
php artisan serve          # เริ่ม API ที่ http://127.0.0.1:8000
```
- ตรวจสอบค่า `.env`
  - `APP_URL` ให้ตรงกับ origin ของ API (ใช้ https ใน production)
  - `FRONTEND_ORIGIN` กำหนดโดเมนที่ frontend ใช้เรียก API
  - `FILE_MAX_MB`, `NOTIFY_EMAIL`, `SANCTUM_STATEFUL_DOMAINS` ตามสภาพแวดล้อม
  - หากต้องการส่งอีเมล ให้ตั้งค่า `MAIL_MAILER`, `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- ตารางและ seeder ใหม่จะถูกสร้างเมื่อรัน `php artisan migrate --seed`
- ต้องเปิด queue worker (`php artisan queue:work`) หากเปิดการส่งอีเมลแบบ queue

### 2. Frontend (React)
```bash
cd frontend
cp .env.example .env    # ระบุ VITE_API_BASE_URL หาก backend ไม่ได้รันบน origin เดียวกัน
npm install
npm run dev             # เริ่ม development server ที่ http://localhost:5173
```
- คำสั่ง `npm run build` จะเรียก `npm run prebuild` เพื่อสร้าง `public/sitemap.xml`
- หากต้องการปรับค่าพื้นฐานของ sitemap ให้ตั้ง `SITEMAP_BASE_URL` ก่อนรัน build

## การแก้ไขหน้าเนื้อหา (Pages)
- หน้า CMS ทั้งหมด seed จาก `database/seeders/PageSeeder.php`
- สามารถแก้เนื้อหาได้สองวิธี
  1. แก้ไข Markdown ใน seeder แล้วรัน `php artisan db:seed --class=PageSeeder`
  2. แก้ข้อมูลโดยตรงในตาราง `pages` (แนะนำใช้ Admin tool) แล้วตั้ง `status=published`
- Frontend จะ fetch HTML ผ่าน `/api/pages/{slug}` และ sanitize ด้วย DOMPurify
- ถ้าต้องสร้างหมวดใหม่ให้เพิ่ม entry ที่ `frontend/src/pages.config.ts` พร้อม slug/route

## แบบฟอร์มและการทดสอบ
| ฟอร์ม | เส้นทางบนเว็บ | API | หมายเหตุ |
| --- | --- | --- | --- |
| ขอเวชระเบียน | `/forms/medical-record-request` | `POST /api/forms/medical-records` | รองรับแนบไฟล์ 5 ชิ้น (PDF/JPG/PNG) |
| การรับบริจาค | `/donation` | `POST /api/forms/donations` | ต้องระบุช่องทางบริจาคและจำนวนเงิน |
| ประเมินความพึงพอใจ | `/feedback/satisfaction` | `POST /api/forms/satisfaction` | คะแนน 1–5 + opt-in สำหรับติดต่อกลับ |
| เบิกค่าน้ำมัน (staff) | `/internal/fuel-claims` | `POST /api/forms/fuel-claims` | ต้องล็อกอิน Sanctum + แนบใบเสร็จได้ |
| ขอเอกสาร (staff) | `/internal/archive-center` | `POST /api/forms/archive-requests` | ต้องล็อกอิน Sanctum |

การทดสอบฝั่ง backend สามารถใช้ Postman หรือ curl ตัวอย่างใน `docs/ROUTES.md` ตรวจสอบสถานะ 201/422/401/429 ตามกรณี ตัวอย่าง flow สาธารณะ:
1. `GET /sanctum/csrf-cookie`
2. `POST /api/forms/medical-records` พร้อม header `X-XSRF-TOKEN`

## การสลับฐานข้อมูล dev / prod
- ค่าเริ่มต้นใน `.env.example` ใช้ `DB_CONNECTION=sqlite` สำหรับ local dev
- เมื่อย้ายสภาพแวดล้อมให้ตั้งค่า MySQL/MariaDB ตาม `docs/DB.md` (อย่าลืมเปลี่ยน `DATASTORE_CONNECTION`)
- production ควรรัน `php artisan migrate --force` บน maintenance window และสำรองฐานข้อมูลก่อนทุกครั้ง

## การดีพลอย / CI
- Workflow เดิม (GitHub Actions) สร้าง build ของ frontend และเตรียม PHPUnit scaffolding สำหรับ backend ยังใช้งานได้
- ก่อน deploy ให้รัน
  - `composer install --no-dev && php artisan migrate --force`
  - `npm ci && npm run build`
- ตรวจสอบให้แน่ใจว่าได้ตั้งค่า `FRONTEND_ORIGIN`, `SANCTUM_STATEFUL_DOMAINS`, `NOTIFY_EMAIL`, `FILE_MAX_MB` ใน `.env` ของเซิร์ฟเวอร์จริง

## ตรวจสอบหลัง deploy
1. `GET /api/health` ต้องได้ `{ "ok": true }`
2. `GET /api/pages/vision-mission-values` ตอบ 200 พร้อม HTML
3. ส่งคำขอ `/api/forms/medical-records` (ตัวอย่าง) แล้วได้ 201 + log ใน `storage/logs/laravel.log`
4. เรียก `/internal/fuel-claims` โดยไม่ล็อกอิน → 401
5. ดูหน้า `/sitemap` และไฟล์ `public/sitemap.xml` ควรมีเส้นทางครบทุกหมวด

## อ้างอิงเพิ่มเติม
- `docs/ROUTES.md` – รายละเอียด endpoint และตัวอย่าง curl
- `docs/DB.md` – สคีมา + แนวทาง migration
- `docs/ENV.md` – รายการ environment variables
- `docs/SECURITY.md` – แนวทาง PDPA, rate limit, upload safety
