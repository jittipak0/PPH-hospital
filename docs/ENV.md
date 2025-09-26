# ENV.md – ตัวแปรแวดล้อมที่ต้องตั้งค่า

เอกสารนี้รวบรวม environment variables ที่จำเป็นสำหรับ Laravel (backend) และ Vite (frontend) หลังจากดึงโค้ดมาใหม่ให้ตรวจสอบไฟล์ `.env.example` ทั้งสองฝั่งเสมอ การตั้งค่าที่สำคัญต่อฟีเจอร์ใหม่ (CMS + แบบฟอร์ม) ถูกสรุปไว้ด้านล่าง

## Backend (Laravel)
| Key | ใช้ทำอะไร | ตัวอย่างค่า | หมายเหตุ |
| --- | --- | --- | --- |
| APP_NAME | ชื่อระบบ | `PPH Hospital API` | แสดงใน mail/log |
| APP_ENV | โหมดระบบ | `local` / `staging` / `production` | มีผลกับ debug, cache |
| APP_KEY | คีย์เข้ารหัส | `base64:...` | สร้างด้วย `php artisan key:generate` |
| APP_URL | URL ของ API | `https://api.hospital.local` | ใช้เป็น base ตอนสร้างลิงก์ไฟล์ `uploads` |
| FILESYSTEM_DISK | ดิสก์หลัก | `local` หรือ `s3` | ค่าเริ่มต้นคือ `local` |
| FILE_MAX_MB | จำกัดขนาดไฟล์อัปโหลด | `10` | ใช้ใน FormRequest สำหรับเวชระเบียน/ใบเสร็จ |
| FRONTEND_ORIGIN | อนุญาต CORS | `https://hospital.local` | ถูกอ่านใน `config/cors.php` |
| SANCTUM_STATEFUL_DOMAINS | รายการโดเมนที่แชร์ session | `hospital.local,localhost:5173` | ต้องตรงกับ origin ของ frontend |
| NOTIFY_EMAIL | อีเมลแจ้งเตือนคำร้อง | `forms@hospital.local` | หากเว้นว่างระบบจะไม่ส่งอีเมล |
| MAIL_MAILER + MAIL_* | การส่งอีเมล | `smtp`, host, port, user, pass | ใช้เมื่อเปิดแจ้งเตือนแบบ queue |
| QUEUE_CONNECTION | งานคิว | `database` / `redis` | แนะนำใช้ queue เมื่อเปิดส่งอีเมล |
| DB_CONNECTION + DB_* | ตั้งค่าฐานข้อมูล | `sqlite` (dev) หรือ `mysql` (prod) | ดูรายละเอียดการสลับใน `docs/DB.md` |

> หลังเปลี่ยนค่าเกี่ยวกับ storage ให้รัน `php artisan storage:link` เพื่อสร้าง symlink `/public/storage/uploads`

## Frontend (Vite/React)
| Key | ใช้ทำอะไร | ตัวอย่างค่า | หมายเหตุ |
| --- | --- | --- | --- |
| VITE_API_BASE_URL | ชี้ไปยัง API | `http://localhost:8000` | หากไม่ตั้งค่าจะ fallback เป็น origin |
| VITE_APP_NAME | ชื่อที่ใช้ใน UI | `โรงพยาบาลโพนพิสัย` | แสดงบนแท็บ/ส่วนหัว |
| SITEMAP_BASE_URL (optional) | ใช้โดยสคริปต์สร้าง `sitemap.xml` | `https://hospital.local` | ตั้งผ่าน `npm run prebuild` (อ่านจาก env runtime) |

## ขั้นตอนแนะนำหลังแก้ไข `.env`
1. คัดลอก `.env.example` → `.env` ทั้ง backend และ frontend
2. กรอกค่าตามสภาพแวดล้อม (dev/staging/prod)
3. รัน `php artisan config:clear && php artisan config:cache`
4. รัน `php artisan migrate --seed` เพื่อให้ตาราง/ข้อมูลอัปเดต
5. ฝั่ง frontend ให้รัน `npm install` (ครั้งแรก) และ `npm run build` ซึ่งจะเรียก `npm run prebuild` เพื่อสร้าง `public/sitemap.xml`
