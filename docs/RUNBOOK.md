# RUNBOOK – คู่มือการ Deploy / Rollback และดูแลระบบ

จุดประสงค์ของเอกสารนี้คือให้ทีม DevOps และนักพัฒนามีขั้นตอนที่ชัดเจนสำหรับการปล่อยซอฟต์แวร์ ตรวจสุขภาพระบบ และกู้คืนเมื่อเกิดเหตุผิดปกติ โปรดอัปเดตเมื่อมีสถาปัตยกรรมหรือเครื่องมือใหม่

## 1. ตารางเวลาปล่อยซอฟต์แวร์ (ตัวอย่าง)
- **รอบหลัก:** ทุกวันพุธ 20:00 น. (เวลานอกชั่วโมงทำการ รพ.)
- **เจ้าของงาน:** Release Manager (DevOps) + ผู้แทนทีมพัฒนา
- **ช่องทางสื่อสาร:** Microsoft Teams (ห้อง #hospital-ops) และ Incident Hotline

## 2. Pre-deploy Checklist
- [ ] PR ทั้งหมด merge เข้า `main` และผ่าน CI (lint, test, build)
- [ ] อัปเดต `docs/CHANGELOG.md` ระบุฟีเจอร์/แก้ไข/ผลกระทบ
- [ ] ตรวจสอบ Migration ใหม่และเตรียมแผน rollback (มีสำรองข้อมูลล่าสุด)
- [ ] สร้าง/ตรวจสอบโฟลเดอร์ `storage/app/private/forms` ให้ web user เขียนได้ (เก็บไฟล์อัปโหลดจากฟอร์มสาธารณะ)
- [ ] ค่า ENV ใน staging = production (ยกเว้น secret) โดยเฉพาะ `DATASTORE_DRIVER`/`DATASTORE_CONNECTION` และทดสอบรอบสุดท้ายผ่าน Postman
- [ ] แจ้งทีมที่เกี่ยวข้องอย่างน้อย 4 ชั่วโมงก่อน deploy

## 3. ขั้นตอน Deploy Production

### 3.1 Backend (Laravel API)
1. SSH เข้าเครื่อง production ด้วยบัญชีที่ได้รับอนุญาต
2. ดึงโค้ดล่าสุด: `git fetch --all && git checkout main && git pull`
3. ติดตั้ง dependency: `composer install --no-dev --prefer-dist --optimize-autoloader`
4. ตรวจสอบไฟล์ `.env` ว่าอัปเดตค่าล่าสุดแล้ว (APP_KEY, SANCTUM, DB, QUEUE, DATASTORE\_*)
   - หากยังไม่มี `APP_KEY` ให้รัน `php artisan key:generate --force`
5. หาก `DATASTORE_DRIVER=eloquent` ให้รัน migration: `php artisan migrate --force`
6. ตรวจสอบว่า `storage/app/private/forms` มีอยู่จริง และสิทธิ์ถูกต้อง (`mkdir -p storage/app/private/forms && chown www-data`) 
7. เคลียร์/คอมไพล์แคช: `php artisan config:cache && php artisan route:cache && php artisan view:cache`
8. รีสตาร์ต queue worker (ถ้ามี): `php artisan queue:restart`

### 3.2 Frontend (Vite Build)
1. เข้าโฟลเดอร์ `frontend`
2. ติดตั้ง dependency: `npm ci`
3. สร้างไฟล์ build: `npm run build`
4. คัดลอกไฟล์ใน `dist/` ไปยังโฟลเดอร์ที่ Nginx เสิร์ฟ (เช่น `/var/www/hospital-frontend`)
5. ตรวจสอบสิทธิ์ไฟล์ให้เป็นของ web user (`www-data`)

### 3.3 Nginx / PHP-FPM
1. ทดสอบคอนฟิก: `sudo nginx -t`
2. รีโหลด Nginx: `sudo systemctl reload nginx`
3. ตรวจสอบสถานะ PHP-FPM: `sudo systemctl status php8.2-fpm`
4. ตรวจ log สั้น ๆ ว่าไม่มี error เพิ่ม (`/var/log/nginx/error.log`, `/var/log/php8.2-fpm.log`)

## 4. หลัง Deploy (Post-deploy)
- ตรวจ endpoint สำคัญ: `GET /api/health` (Laravel API ควรตอบ `{ "ok": true, "request_id": "..." }`), `GET /api/news`, `POST /api/auth/login`
- ตรวจหน้าเว็บหลักและการโหลดข่าวใน frontend
- ยืนยันว่า metric/monitoring (APM, uptime robot) แสดงค่าปกติ
- อัปเดตช่องทางสื่อสารแจ้งว่า deploy เสร็จ พร้อมลิงก์ release note

## 5. ขั้นตอน Rollback
1. แจ้ง Incident channel พร้อมระบุเหตุผลและเวลาที่คาดกู้คืนเสร็จ
2. กลับไปยัง tag หรือ commit ก่อนหน้า: `git checkout <last-stable-tag>`
3. หาก migration ใหม่ทำให้เกิดปัญหา ให้รัน `php artisan migrate:rollback --step=1` (เฉพาะเมื่อปลอดภัย)
4. กู้คืนไฟล์ build frontend เวอร์ชันก่อนหน้าจาก artifact ที่เก็บไว้
5. รีโหลด Nginx/PHP-FPM และทดสอบ `GET /api/health` อีกครั้ง
6. บันทึกเหตุการณ์และบทเรียนลง postmortem ภายใน 24 ชั่วโมง

> หาก rollback แล้วต้องการกลับไปใช้ฐานข้อมูลหลัก ให้ตรวจสอบว่า `.env` ตั้ง `DATASTORE_DRIVER=eloquent` และ connection พร้อมก่อนเปิดบริการอีกครั้ง

## 6. การจัดการเหตุขัดข้อง (Incident Response)
- **ระดับ P1 (ระบบใช้การไม่ได้):** แจ้ง Ops hotline ภายใน 5 นาที เรียก core team เข้าประชุมฉุกเฉิน
- **ระดับ P2 (บางฟังก์ชันใช้งานไม่ได้):** แจ้งผ่าน Teams + สร้าง incident ticket ระบุผลกระทบ
- **บันทึกหลักฐาน:** เก็บ log, request id, เวลาที่เกิดเหตุ, ผู้ใช้ที่ได้รับผลกระทบ
- **การสื่อสารผู้ใช้งาน:** ใช้เทมเพลตประกาศใน intranet หรือ SMS แจ้งเจ้าหน้าที่ตามความรุนแรง

## 7. งานบำรุงรักษาต่อเนื่อง
- สำรองฐานข้อมูลอัตโนมัติ (daily full backup + weekly offsite) ตรวจสอบ log backup ทุกเช้า
- ทดสอบการกู้คืนข้อมูลบน staging ทุกไตรมาสและอัปเดตเอกสารผลลัพธ์
- ตรวจสอบการหมดอายุของ TLS certificate ก่อนถึงกำหนด 30 วัน
- ตรวจสอบ security patch ของ Laravel, PHP, Node.js ทุกเดือน และวางแผนอัปเดต

## 11. Health Check และ Log Observability (Laravel API)
- Health check backend: `curl -H "Accept: application/json" https://<host>/api/health` → ค่าที่ได้ต้องเป็น `{ "ok": true, "request_id": "..." }`
- ตรวจ log ที่เพิ่ม context (`request_id`, `user_id`, `ip`, `user_agent`): `cd backend/laravel && tail -f storage/logs/structured.log | jq '.'`
- หากต้อง trace ตามคำขอเฉพาะ ให้ค้นด้วย `jq 'select(.extra.request_id == "<id>")' storage/logs/structured.log`

## 10. การจัดการฐานข้อมูลและการสลับ driver
- **เปิดใช้ MySQL/PGSQL ใน production:**
  1. ติดตั้งและเปิดบริการฐานข้อมูล (MySQL/PG) พร้อมสร้าง database/user ที่จำกัดสิทธิ์ (ดู `docs/SECURITY.md`).
  2. เพิ่ม connection ใน `config/database.php` หากต้องใช้ alias เพิ่มเติม และตั้งค่า `.env` ให้ `DB_CONNECTION` และ `DATASTORE_CONNECTION` ตรงกับ alias นั้น
  3. ตั้ง `DATASTORE_DRIVER=eloquent` แล้วรัน `php artisan migrate --force`
- **สลับเป็น Memory ชั่วคราว:**
  1. แก้ `.env` หรือ export env ชั่วคราว `DATASTORE_DRIVER=memory`
  2. เคลียร์ cache (`php artisan config:clear`) และรีสตาร์ต queue/worker ที่พึ่งพา repository
  3. ฟีเจอร์ที่เกี่ยวข้องกับฐานข้อมูลจะทำงานแบบ in-memory รีสตาร์ตบริการอีกครั้งและเปลี่ยนกลับเป็น `eloquent` เมื่อระบบหลักพร้อม
- **การ rollback ฐานข้อมูล:**
  - บันทึก snapshot/backup ก่อนรัน migration เสมอ
  - ใช้ `php artisan migrate:rollback` เฉพาะกรณีที่ schema เปลี่ยนโดยปลอดภัย และตรวจสอบผลกระทบกับ service ก่อนเปิดให้ผู้ใช้

## 8. เครื่องมือที่เกี่ยวข้อง
- **Monitoring:** UptimeRobot/Prometheus + Grafana (latency, error rate, CPU, memory)
- **Log Aggregation:** ELK / Loki (เก็บรวม log จาก Laravel + Nginx)
- **Alerting:** PagerDuty หรือ Teams webhook กำหนด threshold จาก health check
- **เอกสารอ้างอิง:** `docs/SECURITY.md`, `docs/CODING_RULES.md`, Postman collection

## 9. Checklist ปิดงาน deploy
- [ ] บันทึก release note + link pull request
- [ ] อัปเดตสถานะ ticket ในระบบบริหารโครงการ (Jira/Linear)
- [ ] ทำ sanity test 3 ฟังก์ชันหลัก (login, list news, create/update news)
- [ ] ส่งรายงานสรุปให้ Product Owner และทีมสนับสนุน
