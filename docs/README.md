# Hospital Platform Docs Overview

ชุดสตาร์ตเตอร์นี้ประกอบด้วย Laravel 11 API สำหรับ backend, React (Vite) สำหรับ frontend, Nginx config ตัวอย่าง และเอกสารประกอบการปฏิบัติงาน ด้านล่างสรุปหัวข้อสำคัญสำหรับทีมที่ต้องการเริ่มต้นอย่างรวดเร็ว

## โครงสร้างโครงการ
```
backend                # Laravel API (Sanctum, Form Request, Repository abstraction)
frontend               # React 18 + Vite
nginx/                 # ตัวอย่าง server block/frontend proxy
postman/               # Postman collection + environment สำหรับทุกสภาพแวดล้อม
docs/                  # เอกสาร (ENV, ROUTES, DB, SECURITY, RUNBOOK, CODING_RULES)
```

## Backend (Laravel API)
### การติดตั้ง (ครั้งแรก)
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
```
- ตั้งค่า ENV สำคัญตาม `docs/ENV.md` โดยเฉพาะ `DATASTORE_DRIVER`, `DATASTORE_CONNECTION`, `FORM_*`, `RATE_LIMIT_*`, `SANCTUM_STATEFUL_DOMAINS`
- Seeder จะสร้างผู้ใช้ admin จากค่า `ADMIN_INITIAL_*`

### การรันสำหรับพัฒนา
```bash
php artisan serve --host=0.0.0.0 --port=8000
```
- Log JSON เก็บที่ `storage/logs/structured.log`; ใช้ `jq` เพื่ออ่านพร้อม context
- ทุก response จะมี header `X-Request-Id` สามารถใช้ trace log ต่อได้

### การทดสอบ / QA
```bash
composer lint          # เรียกใช้ Laravel Pint --test
php artisan test       # เรียก PHPUnit (ใช้ sqlite in-memory)
XDEBUG_MODE=coverage php artisan test --coverage --min=85
```
- coverage target ≥ 85% (ตั้งค่าใน `phpunit.xml`)
- ใช้ Postman collection ใน `postman/PPH-hospital.postman_collection.json` สำหรับ smoke test หลัง deploy

### การสลับ Datastore
- โหมดพัฒนา/ทดสอบ: ตั้ง `DATASTORE_DRIVER=memory` เพื่อใช้ in-memory repositories (ไม่ต้องมีฐานข้อมูล)
- โหมด production/staging: ตั้ง `DATASTORE_DRIVER=eloquent` และกำหนด `DATASTORE_CONNECTION` ให้ตรงกับ connection alias (เช่น `mysql`)
- หลังเปลี่ยนค่าให้รัน `php artisan config:clear`

### ตัวอย่าง Curl สำคัญ
```bash
# Health check
curl -H "Accept: application/json" http://localhost:8000/api/health

# ขอ CSRF token
curl -c cookies.txt http://localhost:8000/api/security/csrf-token

# Login (ใช้ cookie + token)
curl -b cookies.txt -H "X-CSRF-TOKEN: $(jq -r '.data.csrf_token' csrf.json)" \
     -H "Content-Type: application/json" \
     -X POST -d '{"username":"admin","password":"ChangeMe123!"}' \
     http://localhost:8000/api/auth/login

# ยื่นแบบฟอร์มบริจาค (ต้องแนบ cookie และ header AJAX)
curl -b cookies.txt -H "X-CSRF-TOKEN: <token>" -H "X-Requested-With: XMLHttpRequest" \
     -H "Content-Type: application/json" -d '{"donor_name":"Jane","amount":500,"channel":"bank"}' \
     http://localhost:8000/api/forms/donation
```
> ตัวอย่างเต็มสำหรับทุก endpoint อยู่ใน Postman collection

## Frontend (React)
```bash
cd frontend
cp .env.example .env    # ตั้ง VITE_API_BASE_URL ให้ชี้ backend
npm install
npm run dev
```
- ใช้ Token จาก `/api/auth/login` หรือ cookie-based (เมื่อเรียกจากโดเมนเดียวกัน)
- ปรับเนื้อหาหน้าต่าง ๆ ให้ตรงกับ API contract ใน `docs/ROUTES.md`

## เอกสารอื่นที่เกี่ยวข้อง
- `docs/ENV.md` – รายละเอียดตัวแปรแวดล้อมทั้งหมด
- `docs/ROUTES.md` – API contract แบบเต็มพร้อมตัวอย่าง request/response
- `docs/DB.md` – schema + retention + แนวทางเข้ารหัสข้อมูล
- `docs/SECURITY.md` – นโยบาย rate limit, CSRF, upload, token abilities
- `docs/RUNBOOK.md` – ขั้นตอน deploy/rollback/incident

## Workflow แนะนำ
1. อ่าน `docs/CODING_RULES.md` ก่อนเริ่มงานใหม่ เพื่อปฏิบัติตามมาตรฐานโค้ดและ logging
2. พัฒนาบน branch ของตนเองและรัน `composer lint` + `php artisan test` ทุกครั้งก่อน push
3. อัปเดตเอกสาร/ Postman ทันทีเมื่อเพิ่ม endpoint หรือ ENV ใหม่
4. ใช้ checklist ใน `docs/RUNBOOK.md` เป็น gate ก่อน deploy production

## การสนับสนุน
- ปัญหาเกี่ยวกับโครงสร้างพื้นฐาน แจ้ง DevOps ผ่าน Teams `#hospital-ops`
- ปัญหาโค้ด/bug ใช้ issue tracker ตามโปรเซสของทีม (Jira/Linear)
- Security incident ให้ทำตาม `docs/SECURITY.md` และ escalated ภายใน 5 นาที
