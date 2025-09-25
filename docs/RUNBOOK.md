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
- [ ] ค่า ENV ใน staging = production (ยกเว้น secret) และทดสอบรอบสุดท้ายผ่าน Postman
- [ ] แจ้งทีมที่เกี่ยวข้องอย่างน้อย 4 ชั่วโมงก่อน deploy

## 3. ขั้นตอน Deploy Production

### 3.1 Backend (Laravel API)
1. SSH เข้าเครื่อง production ด้วยบัญชีที่ได้รับอนุญาต
2. ดึงโค้ดล่าสุด: `git fetch --all && git checkout main && git pull`
3. ติดตั้ง dependency: `composer install --no-dev --prefer-dist --optimize-autoloader`
4. ตรวจสอบไฟล์ `.env` ว่าอัปเดตค่าล่าสุดแล้ว (โดยเฉพาะ SANCTUM, DB, QUEUE)
5. รัน migration: `php artisan migrate --force`
6. เคลียร์/คอมไพล์แคช: `php artisan config:cache && php artisan route:cache && php artisan view:cache`
7. รีสตาร์ต queue worker (ถ้ามี): `php artisan queue:restart`

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
- ตรวจ endpoint สำคัญ: `GET /api/health`, `GET /api/news`, `POST /api/auth/login`
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

### Rollback ฐานข้อมูลเมื่อ migrate ผิดพลาด
- หากใช้ MySQL/PG ให้ใช้ snapshot ล่าสุดของ instance หรือ backup (*.sql) ที่เตรียมไว้ก่อน deploy
- สำหรับ SQLite ให้คัดลอกไฟล์ฐานข้อมูลสำรองที่สร้างก่อน deploy กลับมาทับตำแหน่งเดิม แล้ว rerun `php artisan config:cache`
- หากต้องการหยุดการเขียนข้อมูลชั่วคราว ให้สลับ `DATASTORE_DRIVER=memory` ใน `.env` แล้ว `php artisan config:clear` เพื่อให้ API ยังตอบสนองได้แม้ฐานข้อมูลหลักมีปัญหา (ข้อมูลที่เขียนในโหมดนี้จะไม่ถาวร)

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

## 10. การเปิดใช้ฐานข้อมูลต่างชนิด (MySQL / PostgreSQL / SQLite / SQL Server)
1. ตั้งค่า `.env` ให้ตรงกับชนิดที่ต้องการ เช่น `DB_CONNECTION=mysql`, `DATASTORE_DRIVER=eloquent`, `DATASTORE_CONNECTION=mysql`, ปรับ host/port/credential
2. สร้างฐานข้อมูลและผู้ใช้ล่วงหน้า โดยจำกัดสิทธิ์ให้เฉพาะ schema ที่เกี่ยวข้อง (ดู `docs/SECURITY.md`)
3. รัน `php artisan key:generate` หากไฟล์ `.env` ใหม่ยังไม่มี `APP_KEY`
4. รัน `php artisan migrate --force` เพื่อสร้างตารางบน connection ใหม่ จากนั้น smoke test `GET /api/health`
5. หากต้องสลับกลับมา SQLite ให้แก้ ENV เป็น `sqlite` ทั้งสองตัวและสร้างไฟล์ SQLite ตามเส้นทางที่กำหนด (เช่น `touch database/database.sqlite`)

## 11. การสลับ driver เป็น Memory ชั่วคราว
- แก้ `.env` ตั้ง `DATASTORE_DRIVER=memory` แล้วสั่ง `php artisan config:clear`
- โหมดนี้จะเก็บข้อมูลใน process memory เท่านั้น ใช้ได้กับกรณีทดสอบหรือเมื่อฐานข้อมูลหลักล่มและต้องการตอบ 200 กับ endpoint บางตัว เช่น `/api/health`
- เมื่อระบบฐานข้อมูลกลับมาปกติ ให้สลับกลับ `eloquent` และรัน `php artisan config:cache` + `php artisan migrate --force`
- แจ้งทีมใช้งานว่า ข้อมูลที่เกิดขึ้นระหว่างใช้ memory adapter จะไม่ถูกบันทึกจริง ต้องบันทึกซ้ำเมื่อระบบหลักพร้อม
