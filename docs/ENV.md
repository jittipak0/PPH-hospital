# ENV.md – ตัวแปรแวดล้อมที่ต้องใช้

สตาร์ตเตอร์นี้ใช้ Laravel 11 (API only) + Sanctum สำหรับ backend และ React (Vite) สำหรับ frontend ตารางด้านล่างสรุปตัวแปรที่ต้องเตรียมในทุกสภาพแวดล้อม โปรดจัดเก็บค่า secret ผ่าน Secret Manager หรือไฟล์ `.env` ที่อยู่นอก Git ตามนโยบายความปลอดภัย

## Backend (Laravel API)
| Key | ใช้ทำอะไร | ค่าแนะนำ (ตัวอย่าง) | หมายเหตุ |
| --- | --- | --- | --- |
| APP_NAME | ชื่อระบบ | `PPH Hospital API` | แสดงใน log และ response health |
| APP_ENV | โหมดการทำงาน | `local` / `staging` / `production` | มีผลกับ log และ cache |
| APP_KEY | คีย์เข้ารหัส | `base64:...` | สร้างด้วย `php artisan key:generate` ห้ามเวียนใช้ |
| APP_DEBUG | เปิดรายละเอียด error | `true` (local) / `false` (staging/prod) | ปิดใน production เสมอ |
| APP_URL | ฐาน URL ของ API | `https://api.hospital.local` | ใช้ประกอบลิงก์และ cookie |
| LOG_CHANNEL | ช่องหลักของ log | `stack` | ค่าเริ่มใช้ stack + structured |
| LOG_STACK | รายการ channel ที่ซ้อน | `structured` | ต้องมี channel ชื่อเดียวกันใน `config/logging.php` |
| LOG_LEVEL | ระดับ log เริ่มต้น | `debug` (local) / `info` (staging/prod) | เปิด DEBUG ตามความจำเป็นเท่านั้น |
| DATASTORE_DRIVER | ตัวเลือก repository adapter | `eloquent` / `memory` | `memory` ใช้เฉพาะ dev/test |
| DATASTORE_CONNECTION | alias การเชื่อมต่อฐานข้อมูล | `sqlite` / `mysql` / `pgsql` | ต้องมีใน `config/database.php` |
| DB_CONNECTION | ค่า default connection Laravel | `sqlite` หรือ `mysql` | ใช้เมื่อ adapter อ่านค่าไม่ได้ |
| DB_HOST | โฮสต์ฐานข้อมูล | `127.0.0.1` | ใส่ service name เมื่อรันใน container |
| DB_PORT | พอร์ตฐานข้อมูล | `3306` | เปลี่ยนตามชนิดฐานข้อมูล |
| DB_DATABASE | ชื่อฐานข้อมูล | `pph_hospital` | สร้างก่อน migrate |
| DB_USERNAME | ผู้ใช้ฐานข้อมูล | `hospital_app` | จำกัดสิทธิ์ตามหลัก least privilege |
| DB_PASSWORD | รหัสผ่านฐานข้อมูล | `********` | จัดเก็บผ่าน secret manager |
| ADMIN_INITIAL_USERNAME | Username ผู้ดูแลเริ่มต้น | `admin` | ใช้โดย `AdminUserSeeder` |
| ADMIN_INITIAL_NAME | ชื่อจริงผู้ดูแลเริ่มต้น | `System Administrator` | ปรากฏใน UI staff |
| ADMIN_INITIAL_EMAIL | อีเมลผู้ดูแลเริ่มต้น | `admin@example.com` | ใช้รับแจ้งเตือน |
| ADMIN_INITIAL_PASSWORD | รหัสผ่านเริ่มต้น | `ChangeMe123!` | เปลี่ยนทันทีหลัง deploy |
| SANCTUM_STATEFUL_DOMAINS | รายการโดเมนที่แชร์ cookie | `localhost,127.0.0.1,staff.hospital.local` | คั่นด้วยคอมมา ไม่มีช่องว่าง |
| RATE_LIMIT_PUBLIC | อัตราเรียกสำหรับ public | `60` | หน่วย: requests/นาที/ไอพี |
| RATE_LIMIT_STAFF | อัตราเรียกสำหรับ staff API | `120` | หน่วย: requests/นาที/ผู้ใช้ |
| RATE_LIMIT_AUTH_LOGIN_ATTEMPTS | จำนวน login ที่อนุญาต | `20` | ร่วมกับ decay คุม brute-force |
| RATE_LIMIT_AUTH_LOGIN_DECAY | นาทีที่รีเซ็ต counter login | `5` | ใช้กับ limiter `auth-login` |
| FORM_ALLOWED_MIME | MIME type ที่อนุญาตให้อัปโหลด | `application/pdf,image/jpeg,image/png` | ใช้ในฟอร์มคำขอเวชระเบียน |
| FORM_ALLOWED_EXT | นามสกุลไฟล์ที่อนุญาต | `pdf,jpg,jpeg,png` | ต้องตรงกับ MIME |
| FORM_UPLOAD_MAX_MB | จำกัดขนาดไฟล์แนบ | `10` | หน่วย MB |
| SESSION_DRIVER | ตัวจัดการ session | `database` | ใช้กับ CSRF และ queue |
| QUEUE_CONNECTION | ตัวจัดการคิว | `database` / `redis` | กำหนดตาม infra |
| CACHE_STORE | ตัวจัดการแคช | `database` / `redis` | ปรับตามสภาพแวดล้อม |
| FILESYSTEM_DISK | ดิสก์หลักของ Laravel | `local` | ต้องรองรับ storage private |
| MAIL_MAILER | ช่องส่งอีเมล | `log` / `smtp` | กำหนด host/port เพิ่มตามจริง |

## Frontend (React + Vite)
| Key | ใช้ทำอะไร | ค่าแนะนำ (ตัวอย่าง) | หมายเหตุ |
| --- | --- | --- | --- |
| VITE_API_BASE_URL | จุดเชื่อมต่อ API | `http://localhost:8000` (dev) / `https://api.hospital.local` (prod) | ต้องลงท้ายแบบไม่ใส่ `/` |
| VITE_APP_NAME | ชื่อที่แสดงบนหน้าเว็บ | `PPH Hospital Portal` | ใช้ใน title และ header |

## แนวทางจัดการค่า ENV
- สร้างไฟล์ `.env.example` พร้อม placeholder เพื่อช่วย onboarding แต่ห้ามบันทึกค่า secret จริง
- Production ควรโหลดค่า ENV ผ่านระบบจัดการความลับ (เช่น AWS SSM, GCP Secret Manager) แล้ว inject ระหว่าง deploy
- ทดสอบค่าที่ตั้งไว้ด้วย `php artisan config:cache` และ `php artisan config:show` บน staging ก่อนนำขึ้น production
- หมุนเวียน secret สำคัญ (APP_KEY, DB_PASSWORD, tokens) อย่างน้อยปีละหนึ่งครั้ง หรือเมื่อเกิดเหตุ security incident
- เก็บสเปรดชีต/CMDB สำหรับ ENV สำคัญพร้อมผู้รับผิดชอบ เพื่อให้ตรวจสอบการเปลี่ยนแปลงย้อนหลังได้
