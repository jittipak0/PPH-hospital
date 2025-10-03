# Laravel API Backend – Bootstrap & Security Baseline

โครงการนี้เป็น Laravel 11 (API only) ที่เตรียม middleware สำหรับ `X-Request-Id`, logging เชิงโครงสร้าง, การเลือก datastore ตาม `DATASTORE_DRIVER`, และมาตรฐานความปลอดภัยเบื้องต้น (Sanctum token abilities, CSRF, rate limit) ให้พร้อมต่อยอดฟีเจอร์ถัดไป

## การติดตั้ง

```bash
cd backend/laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate        # เมื่อใช้ driver = eloquent
php artisan db:seed        # สร้าง admin และข่าวตัวอย่าง (เฉพาะ local/testing)
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
```

### ตัวแปรสำคัญใน `.env`
- `DATASTORE_DRIVER` = `memory` (dev/test) หรือ `eloquent` (staging/prod)
- `DATASTORE_CONNECTION` = alias ใน `config/database.php`
- `SANCTUM_STATEFUL_DOMAINS` = โดเมนที่แชร์ cookie กับ SPA
- `RATE_LIMIT_PUBLIC`, `RATE_LIMIT_STAFF`, `RATE_LIMIT_AUTH_LOGIN_ATTEMPTS`, `RATE_LIMIT_AUTH_LOGIN_DECAY`
- `ADMIN_INITIAL_USERNAME`, `ADMIN_INITIAL_NAME`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`

## การรันและตรวจสอบ

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

ตรวจสุขภาพระบบและล็อก

```bash
curl -H "Accept: application/json" http://localhost:8000/api/health
# log โครงสร้าง JSON พร้อม request context
tail -f storage/logs/structured.log | jq '.'
```

## ตัวอย่างเรียกข่าวสาธารณะ

```bash
curl -sS -H "Accept: application/json" \
  "http://localhost:8000/api/news?per_page=5&sort=-published_at" | jq '.'
```

- `per_page` ปรับจำนวนรายการ (สูงสุด 50 ต่อหน้า)
- `page` ระบุหน้าที่ต้องการ (เริ่มที่ 1)
- `sort` เลือก `-published_at` (ค่าเริ่มต้น: ใหม่ล่าสุดก่อน) หรือ `published_at` (เก่าสุดก่อน)

ทุกคำตอบของ API จะมี header `X-Request-Id` (หากไม่ส่งมาจะถูกสร้างให้) และถูกแนบเข้า context ของ log ทุกชั้น สามารถใช้ค่าเดียวกันเพื่อตามรอยคำสั่งซื้อทั้งใน response และ log

## การทดสอบ

```bash
composer lint
php artisan test
```

## ทดสอบ Auth เบื้องต้นด้วย `curl`
1. ขอ CSRF cookie และดึงค่า token จากไฟล์ cookie
   ```bash
   curl -s -c cookies.txt http://localhost:8000/sanctum/csrf-cookie
   export CSRF_TOKEN=$(grep XSRF-TOKEN cookies.txt | tail -n 1 | awk '{print $7}')
   ```
2. เรียก `POST /api/auth/login` (ตัวอย่าง user จาก seeder: `admin` / `ChangeMe123!`)
   ```bash
   curl -sS -b cookies.txt -c cookies.txt \
     -H "Content-Type: application/json" \
     -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
     -H "X-Requested-With: XMLHttpRequest" \
     -X POST http://localhost:8000/api/auth/login \
     -d '{"username":"admin","password":"ChangeMe123!"}' | tee login.json | jq '.'
   ```
3. ใช้ token ที่ได้เพื่อเรียกดูโปรไฟล์ staff
   ```bash
   export ACCESS_TOKEN=$(jq -r '.data.token.access_token' login.json)
   curl -sS -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Accept: application/json" \
     http://localhost:8000/api/staff/me | jq '.'
   ```
4. ออกจากระบบ (แนบ header เดิมและ cookie ชุดเดียวกัน)
   ```bash
   export CSRF_TOKEN=$(grep XSRF-TOKEN cookies.txt | tail -n 1 | awk '{print $7}')
   curl -sS -b cookies.txt -c cookies.txt \
     -H "Content-Type: application/json" \
     -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
     -H "X-Requested-With: XMLHttpRequest" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -X POST http://localhost:8000/api/auth/logout | jq '.'
   ```

> หมายเหตุ: เก็บไฟล์ cookie และ token ไว้ในที่ปลอดภัย ห้าม commit และห้าม log ค่า credential ลงไฟล์ log

## Rate Limit และสิทธิ์การเข้าถึง
- `throttle:public-api` ครอบคลุม endpoint สาธารณะ (ค่าเริ่มต้น 60/min/IP)
- `throttle:staff-api` ใช้กับ route ที่ต้องการ `auth:sanctum` (120/min/user)
- `throttle:auth-login` จำกัดการ login (20 ครั้ง/5 นาที/IP + username)
- Token abilities: `viewer ⊂ staff ⊂ admin` (ระบุใน `auth.token_abilities`)

## โครงสร้าง Log
- Middleware → Controller → Service จะ log ระดับ `debug` โดยมี context: `request_id`, `ip`, `user_agent`, `user_id` (ถ้ามี)
- หลีกเลี่ยงการ log PII/credential ทุกกรณี หากต้องอ้างอิง username จะใช้ค่า hash (`sha256 + APP_KEY`)
- เปลี่ยนระดับ log ผ่าน `.env` (`LOG_LEVEL`) ได้ตามสภาพแวดล้อม

## สลับ datastore
```bash
# memory (dev/test)
DATASTORE_DRIVER=memory

# eloquent + sqlite (staging/prod เริ่มต้น)
DATASTORE_DRIVER=eloquent
DATASTORE_CONNECTION=sqlite
php artisan migrate --force
php artisan db:seed --force
```

## Troubleshooting
- 419 / CSRF: ตรวจว่ามี `X-Requested-With: XMLHttpRequest`, header `X-CSRF-TOKEN` และ cookie จาก `/sanctum/csrf-cookie`
- 401: ตรวจ rate limit (`429`) และความถูกต้องของ token + abilities
- ล็อกเห็น `Session store not set`: ตรวจ `SESSION_DRIVER` และว่ามี StartSession middleware (คอนฟิกไว้แล้วสำหรับกลุ่ม `api`)
