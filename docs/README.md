# Hospital Starter (v2)

สตาร์ตเตอร์ชุดนี้รวบรวมหน้าบ้าน React, API ตัวอย่างของ Laravel และคอนฟิกสำหรับ Nginx/Supervisor ที่ใช้เป็นโครงตั้งต้นให้ทีมพัฒนาระบบโรงพยาบาล สามารถนำไปต่อยอดฟีเจอร์จริงได้อย่างรวดเร็ว

## เทคโนโลยีและเครื่องมือหลัก
- **Frontend:** React 18 + Vite (ESM) พร้อมตัวอย่างการเรียก API ผ่าน fetch
- **Backend:** Laravel 11 (API only) + Sanctum (token abilities) พร้อมสคริปต์ล็อกอิน/จัดการข่าวสาร
- **ฐานข้อมูล:** MySQL หรือ MariaDB
- **เว็บเซิร์ฟเวอร์:** Nginx + PHP-FPM (ตัวอย่างไฟล์คอนฟิกในโฟลเดอร์ `nginx/`)
- **CI/CD:** ตัวอย่าง workflow บน GitHub Actions (frontend build/test + backend PHPUnit บน SQLite in-memory)
- **เอกสารเพิ่ม:** Postman collection, systemd unit และ runbook

## โครงสร้างโครงการ
```
frontend/            # โค้ด React (Vite) + ตัวอย่างหน้าข่าวประชาสัมพันธ์
backend/src-snippets # ตัวอย่างไฟล์ Laravel: controller, request, migration, route, test
nginx/               # ไฟล์ server block สำหรับ frontend+backend
systemd/             # ตัวอย่าง service/timer สำหรับ queue worker + schedule
postman/             # Postman collection/fragments ของ API
docs/                # เอกสารประกอบ (Coding rules, ENV, DB, ROUTES, RUNBOOK, SECURITY)
```

> โฟลเดอร์ `backend/` มีเพียงซอร์สตัวอย่าง (snippet) เพื่อคัดลอกไปวางในโปรเจ็กต์ Laravel ที่สร้างใหม่ ทีมยังต้องรัน `composer create-project` เพื่อเตรียมโครง Laravel จริงก่อนเริ่มงาน

## ฟีเจอร์ที่เตรียมไว้ในสตาร์ตเตอร์
- ชุดหน้าเว็บสาธารณะครบหมวด (เกี่ยวกับโรงพยาบาล, ธรรมาภิบาล, วิชาการ, บริการออนไลน์, แบบฟอร์ม และระบบภายใน)
- ฟอร์มออนไลน์ 4 รายการที่เชื่อมกับ Laravel API (`/forms/medical-record-request`, `/forms/donation`, `/forms/satisfaction`, `/programs/health-rider/apply`)
- ระบบเมตาแท็ก (title, description, Open Graph) และ breadcrumb สำหรับทุกหน้า
- โครงสร้าง RBAC ฝั่ง frontend สำหรับหน้า `/intranet/*` และ Quick links หน้าแรกเพื่อเข้าถึงหมวดสำคัญอย่างรวดเร็ว
- Backend API รองรับไฟล์อัปโหลด (จัดเก็บใน `storage/app/private/forms`), ตรวจสอบ CSRF, ตรวจสอบ MIME จริง และล็อก IP/User Agent
- GitHub Actions workflow `backend-ci.yml` และ `web-ci.yml` รัน PHPUnit + Vite test/build อัตโนมัติบนทุก PR

## ขั้นตอนเริ่มต้นอย่างรวดเร็ว

### 1. เตรียม Backend Laravel
```bash
composer create-project laravel/laravel:^11 backend
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
cp -r ../backend/src-snippets/* .
php artisan migrate
php artisan key:generate
```
- สร้างผู้ใช้ตัวอย่างก่อนทดสอบ (เช่น seeder หรือคำสั่ง `php artisan tinker`) พร้อมกำหนด `role` เป็น `admin` หรือ `staff`
- เพิ่ม `SANCTUM_STATEFUL_DOMAINS` ให้ตรงกับโดเมนที่ frontend เรียกใช้งาน

### 2. เตรียม Frontend React
```bash
cd ../frontend
cp .env.example .env        # ระบุ VITE_API_BASE_URL ให้ชี้ไปยัง backend
npm install                 # หรือ pnpm install
npm run dev                 # พัฒนาบน http://localhost:5173
```
- สำหรับ build โปรดใช้ `npm run build` แล้วนำไฟล์ใน `dist/` ไปเสิร์ฟผ่าน Nginx (ดูตัวอย่างที่ `nginx/frontend.conf`)

### 3. ทดสอบการเชื่อมต่อ
- เรียก `GET /api/health` จาก backend ควรได้ `{ "ok": true }`
- เปิดหน้า frontend แล้วตรวจสอบว่าแสดงรายการข่าวจาก API (`GET /api/news`)
- สร้างข่าวใหม่ผ่าน Postman หรือสคริปต์ `createNews` และตรวจสอบว่า endpoint ของ staff ตรวจสอบสิทธิ์ถูกต้อง

## คำสั่งที่ใช้บ่อย
- Backend: `php artisan serve`, `php artisan migrate`, `php artisan test`
- Frontend: `npm run lint`, `npm run test` (โปรดตั้งค่า ESLint/Vitest เพิ่มเติมตามเอกสาร)
- Docker/Deployment: ใช้ไฟล์ตัวอย่างใน `nginx/` และ `systemd/` เป็นฐานประกอบระบบจริง

## การติดตั้งเครื่องมือเสริม (แนะนำ)
- เปิดใช้ Laravel Pint (`composer require laravel/pint --dev`) สำหรับจัดรูปแบบโค้ด
- ตั้งค่า ESLint/Vitest เพิ่มเติมตามกฎใน `docs/CODING_RULES.md`
- ตั้งค่า Git hooks ผ่าน Husky เพื่อตรวจสอบ lint/test ก่อน commit

## แนวทางสภาพแวดล้อมพัฒนาและดีพลอย

### พัฒนาใน Windows ด้วย WSL
- ติดตั้ง WSL แล้ว `git clone` รีโปลงใน Linux filesystem (เช่น `~/projects/PPH-hospital`) เพื่อหลีกเลี่ยงปัญหา permission/ประสิทธิภาพจากการทำงานบนไดรฟ์ Windows หรือ `/var/www`
- รันคำสั่งทั้งหมดของ Composer, npm และ Artisan ภายใน WSL เท่านั้น รวมถึงการสร้างโปรเจ็กต์ Laravel จริงด้วย `composer create-project`, การติดตั้ง Sanctum และการคัดลอกไฟล์จาก `backend/src-snippets`
- ตั้งค่า MySQL/MariaDB สำหรับการพัฒนา (จะรันภายใน WSL หรือใช้ฐานข้อมูลภายนอกก็ได้) แล้วรัน `php artisan migrate`/`php artisan db:seed` ตามต้องการ
- คัดลอก `.env.example` ไปเป็น `.env` ทั้งฝั่ง backend และ frontend พร้อมกรอกค่า `APP_KEY`, `DB_*`, `SANCTUM_STATEFUL_DOMAINS`, `VITE_API_BASE_URL` เป็นต้น โดยอ้างอิงรายละเอียดจาก `docs/ENV.md`
- ใช้สคริปต์มาตรฐานเช่น `php artisan serve`, `php artisan test`, `npm run dev` เพื่อทดสอบก่อนส่งงาน และตรวจสอบ `GET /api/health`/หน้าเว็บว่าเชื่อมต่อกันได้

### เตรียมเซิร์ฟเวอร์ Linux 9 สำหรับดีพลอย
- ติดตั้ง Git, PHP-FPM 8.x, Composer และส่วนขยาย Laravel ที่จำเป็น จากนั้น `git pull` โค้ด production, รัน `composer install --no-dev`, อัปเดต `.env`, แล้วสั่ง `php artisan migrate --force` พร้อมคำสั่ง cache (`config:cache`, `route:cache`, `queue:restart`)
- ฝั่ง frontend ให้รัน `npm ci` และ `npm run build` แล้วนำไฟล์ใน `dist/` ไปเสิร์ฟผ่าน Nginx โดยใช้ไฟล์ตัวอย่างใน `nginx/` เป็นแม่แบบ (ตั้งค่า proxy `/api` ไป backend)
- เปิดใช้ systemd service/timer ตามไฟล์ใน `systemd/` สำหรับ queue worker (`queue:work`) และ scheduler (`schedule:run`) เพื่อให้ artisan ทำงานอัตโนมัติ
- สร้างโฟลเดอร์ `storage/app/private/forms` และกำหนดสิทธิ์ให้ web user เขียนได้ (ใช้เก็บไฟล์แนบจากฟอร์มคำขอเวชระเบียน)
- หลังดีพลอยตรวจสอบ `GET /api/health`, ดูสถานะบริการ (`systemctl status nginx php-fpm`), และทำตามขั้นตอน post-deploy/checklist ใน `docs/RUNBOOK.md`

## การสนับสนุนและการปรับแก้
- อัปเดตเอกสารทุกครั้งเมื่อเพิ่ม endpoint, environment variable หรือขั้นตอน deployment ใหม่
- ใช้ `docs/CODING_RULES.md` เป็นมาตรฐานกลางสำหรับโค้ดทั้งระบบ
- หากพบปัญหา โปรดดูคู่มือ `docs/RUNBOOK.md` และ `docs/SECURITY.md` ก่อน escalated ไปยังทีมโครงสร้างพื้นฐาน
