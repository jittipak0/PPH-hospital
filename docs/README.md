# Hospital Starter (v2)

สตาร์ตเตอร์ชุดนี้รวบรวมหน้าบ้าน React, API ตัวอย่างของ Laravel และคอนฟิกสำหรับ Nginx/Supervisor ที่ใช้เป็นโครงตั้งต้นให้ทีมพัฒนาระบบโรงพยาบาล สามารถนำไปต่อยอดฟีเจอร์จริงได้อย่างรวดเร็ว

## เทคโนโลยีและเครื่องมือหลัก
- **Frontend:** React 18 + Vite (ESM) พร้อมตัวอย่างการเรียก API ผ่าน fetch
- **Backend:** Laravel 11 (API only) + Sanctum (token abilities) พร้อมสคริปต์ล็อกอิน/จัดการข่าวสาร
- **ฐานข้อมูล:** MySQL หรือ MariaDB
- **เว็บเซิร์ฟเวอร์:** Nginx + PHP-FPM (ตัวอย่างไฟล์คอนฟิกในโฟลเดอร์ `nginx/`)
- **CI/CD:** ตัวอย่าง workflow บน GitHub Actions (build frontend, scaffold PHPUnit สำหรับ backend)
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
- ติดตั้ง ESLint + Prettier (`npm install -D eslint prettier eslint-plugin-react`) และคัดลอกคอนฟิกจาก `docs/CODING_RULES.md`
- ตั้งค่า Git hooks ผ่าน Husky เพื่อตรวจสอบ lint/test ก่อน commit

## การสนับสนุนและการปรับแก้
- อัปเดตเอกสารทุกครั้งเมื่อเพิ่ม endpoint, environment variable หรือขั้นตอน deployment ใหม่
- ใช้ `docs/CODING_RULES.md` เป็นมาตรฐานกลางสำหรับโค้ดทั้งระบบ
- หากพบปัญหา โปรดดูคู่มือ `docs/RUNBOOK.md` และ `docs/SECURITY.md` ก่อน escalated ไปยังทีมโครงสร้างพื้นฐาน
