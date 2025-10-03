# ENV.md – ตัวแปรแวดล้อมที่ต้องใช้

ตารางนี้สรุปตัวแปรสำคัญสำหรับทั้งฝั่ง Laravel API และ React Frontend เพื่อให้ทีมตั้งค่าได้ถูกต้องทั้งใน dev, staging และ production โปรดบันทึกความลับลงใน Secret Manager หรือ `.env` ที่ไม่ถูก commit ตามนโยบายความปลอดภัย

## Backend (Laravel)
| Key | ใช้ทำอะไร | ค่าแนะนำ (ตัวอย่าง) | หมายเหตุ |
| --- | --- | --- | --- |
| APP_NAME | ชื่อระบบ | `HospitalAPI` | แสดงใน log / queue |
| APP_ENV | โหมดการทำงาน | `local` / `staging` / `production` | มีผลกับ debug และ caching |
| APP_KEY | คีย์เข้ารหัส | `base64:...` | สร้างด้วย `php artisan key:generate` ห้ามใช้ซ้ำข้ามระบบ |
| APP_DEBUG | เปิด error detail | `true` (dev) / `false` (prod) | ปิดใน production เสมอ |
| APP_URL | URL หลักของ API | `https://api.hospital.local` | ใช้สร้างลิงก์และลิงก์ในอีเมล |
| LOG_CHANNEL | ช่องทาง log | `stack` | พิจารณาเปิด syslog/sentry เพิ่ม |
| DB_CONNECTION | ชนิดฐานข้อมูลเริ่มต้นของ Laravel | `mysql` | ใช้กับ connection อื่น ๆ หาก `DATASTORE_CONNECTION` ไม่ได้ตั้งไว้ |
| DATASTORE_DRIVER | ตัวเลือก adapter ของ repository | `eloquent` / `memory` | `memory` ใช้สำหรับเทสหรือ fallback แบบ in-memory |
| DATASTORE_CONNECTION | alias connection ที่ adapter Eloquent ต้องใช้ | `sqlite` / `mysql` / `pgsql` / `sqlsrv` | ต้องมีการคอนฟิกใน `config/database.php` |
| DB_HOST | โฮสต์ฐานข้อมูล | `127.0.0.1` หรือ service name | สำหรับ docker ให้ใช้ชื่อ service |
| DB_PORT | พอร์ตฐานข้อมูล | `3306` | |
| DB_DATABASE | ชื่อฐานข้อมูล | `hospital` | สร้างก่อน migrate |
| DB_USERNAME | ผู้ใช้ฐานข้อมูล | `hospital_app` | จำกัดสิทธิ์เฉพาะ CRUD |
| DB_PASSWORD | รหัสผ่านฐานข้อมูล | `********` | เก็บใน secret manager |
| SANCTUM_STATEFUL_DOMAINS | รายการโดเมนที่แชร์ cookie | `hospital.local,localhost` | จำเป็นเมื่อ frontend ใช้ cookie-based auth |
| RATE_LIMIT_PUBLIC | เพดานคำขอสาธารณะ (requests/min/ip) | `60` | ใช้กับ endpoint สาธารณะทุกตัว |
| RATE_LIMIT_STAFF | เพดานคำขอฝั่ง staff (requests/min/user) | `120` | ใช้กับ route ที่ต้อง auth:sanctum |
| RATE_LIMIT_AUTH_LOGIN_ATTEMPTS | จำนวนครั้ง login ที่อนุญาต | `20` | นับรวมทุกบทบาทต่อไอพี |
| RATE_LIMIT_AUTH_LOGIN_DECAY | รีเซ็ต rate limit (นาที) | `5` | ใช้คู่กับค่า attempts ข้างต้น |
| SESSION_DRIVER | ตัวจัดการ session | `cookie` หรือ `file` | API-only สามารถตั้งเป็น `cookie` |
| CACHE_DRIVER | ตัวจัดการแคช | `file` / `redis` | เปิด redis ใน production เพื่อประสิทธิภาพ |
| QUEUE_CONNECTION | งานคิว | `sync` (dev) / `redis` (prod) | หากใช้ queue worker ให้ตั้ง systemd เพิ่ม |
| MAIL_MAILER | ส่งอีเมล | `smtp` | ตั้งค่า mail host/username/password เพิ่มเติม |
| BROADCAST_DRIVER | Realtime | `log` / `pusher` / `redis` | เปิดเมื่อใช้ WebSocket/SSE |
| FORM_UPLOAD_MAX_MB | จำกัดขนาดไฟล์แนบฟอร์ม (MB) | `5` | ใช้กับคำขอประวัติการรักษา ปรับที่ backend เท่านั้น |
| FORM_ALLOWED_MIME | MIME type ที่อนุญาต | `application/pdf,image/jpeg,image/png` | คั่นด้วยเครื่องหมายจุลภาค |
| FORM_ALLOWED_EXT | นามสกุลไฟล์ที่อนุญาต | `pdf,jpg,jpeg,png` | ต้องสอดคล้องกับ MIME type |

## Frontend (Vite / React)
| Key | ใช้ทำอะไร | ค่าแนะนำ (ตัวอย่าง) | หมายเหตุ |
| --- | --- | --- | --- |
| VITE_API_BASE_URL | จุดเชื่อมต่อ API หลัก | `http://localhost:8000` (dev) / `https://api.hospital.local` (prod) | หากไม่ระบุจะ fallback เป็น origin ของเว็บ |
| VITE_APP_NAME | ชื่อที่จะแสดงใน UI | `Hospital Portal` | ใช้ใน header / title |
| VITE_ENABLE_MOCK | เปิดโหมด mock API | `false` (default) | เมื่อจำลองให้ตั้ง `true` และเตรียมไฟล์ mock ใน `src/lib` |

## แนวทางบริหารจัดการค่า ENV
- สร้างไฟล์ `.env.example` ที่มีค่า placeholder เพื่อให้ onboarding ง่ายขึ้น แต่ห้ามใส่ค่า secret จริง
- Production ควรโหลดค่า ENV ผ่านระบบจัดการความลับ (เช่น AWS SSM, GCP Secret Manager) แล้ว inject ตอน deploy
- ตรวจสอบความถูกต้องด้วย `php artisan config:cache` และ `php artisan config:show` (dev) ก่อน deploy ขึ้นจริง
- หมุนเวียนคีย์สำคัญ (DB, APP_KEY, API token) อย่างน้อยปีละ 1 ครั้งหรือเมื่อเกิดเหตุ security incident
- บันทึกค่า ENV ที่สำคัญพร้อมเจ้าของในสเปรดชีตหรือ CMDB เพื่อให้ติดตามการเปลี่ยนแปลงได้
