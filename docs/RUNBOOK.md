# RUNBOOK – คู่มือการ Deploy / Rollback และดูแลระบบ

เอกสารนี้เป็น playbook สำหรับทีม DevOps และพัฒนาในการปล่อยโค้ด Laravel API + Frontend พร้อมแนวทางตรวจสุขภาพระบบ และขั้นตอนกู้คืนเมื่อเกิดเหตุผิดปกติ โปรดอัปเดตทุกครั้งที่มีสถาปัตยกรรมหรือเครื่องมือใหม่

## 1. ตารางปล่อยซอฟต์แวร์ (ตัวอย่าง)
- **รอบหลัก:** ทุกวันพุธ 20:00 น. (เวลานอกชั่วโมงทำการ)
- **เจ้าของ:** Release Manager (DevOps) + ตัวแทนทีมพัฒนา
- **ช่องสื่อสาร:** Microsoft Teams ห้อง `#hospital-ops` + Incident Hotline

## 2. Pre-deploy Checklist
- [ ] PR รวมเข้า `main` และผ่าน CI (`composer lint`, `php artisan test --coverage --min=85`)
- [ ] อัปเดต `docs/CHANGELOG.md` ระบุฟีเจอร์และผลกระทบ
- [ ] สำรองฐานข้อมูล production ล่าสุด (dump + snapshot)
- [ ] ตรวจ `.env` ให้มีค่า ENV ครบ (APP_KEY, SANCTUM_STATEFUL_DOMAINS, DATASTORE_*, FORM_*, RATE_LIMIT_*)
- [ ] เตรียมโฟลเดอร์ `storage/app/private/forms` และตั้งสิทธิ์ `chmod 750` + owner `www-data`
- [ ] ตรวจสอบ queue worker/script ที่ต้องหยุดระหว่าง deploy (เช่น Horizon, queue:work)
- [ ] แจ้งทีมที่เกี่ยวข้องล่วงหน้าอย่างน้อย 4 ชั่วโมง

## 3. ขั้นตอน Deploy Backend (Laravel API)
1. SSH เข้า server ด้วยบัญชีที่ได้รับอนุญาต (มี 2FA)
2. `git fetch --all && git checkout main && git pull`
3. ติดตั้ง dependency: `composer install --no-dev --prefer-dist --optimize-autoloader`
4. อัปเดตค่า ENV หากมีการเพิ่ม (ใช้ `php artisan config:show` ตรวจอีกครั้ง)
5. สร้างคีย์ (ครั้งแรก): `php artisan key:generate --force`
6. รัน migration เมื่อ `DATASTORE_DRIVER=eloquent`: `php artisan migrate --force`
7. เคลียร์/คอมไพล์ cache: `php artisan config:cache && php artisan route:cache && php artisan view:cache`
8. รีสตาร์ต queue worker: `php artisan queue:restart`
9. ตรวจสอบสิทธิ์โฟลเดอร์ไฟล์แนบอีกครั้ง: `ls -ld storage/app/private/forms`

## 4. Deploy Frontend (Vite Build)
1. เข้าโฟลเดอร์ `frontend`
2. `npm ci`
3. สร้าง build: `npm run build`
4. คัดลอกไฟล์ `dist/` ไปยังโฟลเดอร์ที่ Nginx ให้บริการ (เช่น `/var/www/pph-frontend`)
5. ตรวจสิทธิ์ไฟล์ (`chown -R www-data:www-data /var/www/pph-frontend`)
6. `sudo nginx -t && sudo systemctl reload nginx`

## 5. Post-deploy Verification
- `curl -H "Accept: application/json" https://<host>/api/health` → ควรได้ `{ "data": { "ok": true, ... }, "meta": { "request_id": "..." } }`
- `curl -H "Accept: application/json" https://<host>/api/news`
- ขอ CSRF token: `curl -i https://<host>/api/security/csrf-token`
- ทดสอบ login: ใช้ Postman หรือ `curl -X POST https://<host>/api/auth/login` พร้อม header CSRF และ credential ของผู้ใช้ทดสอบ
- ส่งฟอร์มอย่างน้อยหนึ่งรายการ (ใช้ Postman collection) ตรวจว่าไฟล์ถูกเก็บใน `storage/app/private/forms/medical-records`
- ตรวจ log: `cd backend/laravel && tail -f storage/logs/structured.log | jq '.'` → ตรวจหา `request_id` ที่เพิ่งทดสอบ
- ยืนยัน monitoring/uptime robot ไม่มี alert

## 6. ขั้นตอน Rollback
1. แจ้ง Incident channel พร้อมเหตุผลและเวลาคาดการณ์กู้คืน
2. `git checkout <previous-stable-tag>` และ `composer install --no-dev`
3. หาก migration มีปัญหาและ rollback ได้ ให้รัน `php artisan migrate:rollback --step=1`
4. คืนค่า build frontend เวอร์ชันก่อนหน้าจาก artifact
5. `php artisan config:cache && php artisan route:cache`
6. Reload service: `sudo systemctl reload nginx` และตรวจ `GET /api/health`
7. บันทึก postmortem ภายใน 24 ชั่วโมง

## 7. Incident Response
- ระดับ P1: ระบบใช้งานไม่ได้ → โทร Incident Hotline ภายใน 5 นาที รวบรวม log + request_id
- ระดับ P2: ฟังก์ชันบางส่วนล้มเหลว → แจ้ง Teams + สร้าง incident ticket ระบุผลกระทบผู้ใช้
- บันทึกเวลาเริ่ม/สิ้นสุด, ผู้รับผิดชอบ, workaround, และการป้องกันไม่ให้เกิดซ้ำ

## 8. Observability & Log Workflow
- Log ทั้งหมดอยู่ที่ `storage/logs/structured.log` (JSON)
- ค้นด้วย `jq 'select(.extra.request_id == "<id>")' storage/logs/structured.log`
- หากต้อง tail แบบ filter ผู้ใช้: `jq 'select(.extra.user_id == "<uid>")'`
- ตั้ง shipping ไปยัง ELK/Loki ให้ส่งเฉพาะ channel `structured`

## 9. การจัดการ Datastore Driver
- **โหมด production (ฐานข้อมูลจริง):** ตั้ง `DATASTORE_DRIVER=eloquent`, `DATASTORE_CONNECTION=<connection>` → รัน `php artisan migrate --force`
- **โหมด dev/test:** ตั้ง `DATASTORE_DRIVER=memory` เพื่อให้ Feature/Unit test ทำงานบน in-memory repository
- หลังเปลี่ยนค่าให้รัน `php artisan config:clear` แล้วรีสตาร์ต queue worker เพื่อโหลดค่าล่าสุด

## 10. งานบำรุงรักษาต่อเนื่อง
- สำรองฐานข้อมูลรายวัน + ตรวจ log สำเร็จ/ล้มเหลวทุกเช้า
- ทดสอบการกู้คืนข้อมูลและไฟล์แนบทุกไตรมาส
- ตรวจ expiry ของ TLS certificate ล่วงหน้า 30 วัน
- รัน `composer audit` และตรวจ patch PHP/Laravel ทุกเดือน

## 11. Checklist ปิดงาน Deploy
- [ ] บันทึก release note + ลิงก์ PR
- [ ] ปรับสถานะ ticket ในระบบจัดการงาน
- [ ] ทำ smoke test: login, list news, สร้าง/แก้ไขข่าว staff
- [ ] แจ้งทีมสนับสนุนว่าระบบพร้อมใช้งาน พร้อมแนบ request_id ที่ใช้ทดสอบ
