# Hospital Full Starter v2

ชุดโค้ดนี้ปรับ backend Laravel ให้รองรับสถาปัตยกรรม Hexagonal (Ports & Adapters) และสามารถสลับการเชื่อมต่อฐานข้อมูลได้ทันทีผ่านไฟล์คอนฟิกหรือ `.env` โดยไม่กระทบ API ที่มีอยู่ (เช่น `/api/health`). หากต้องการเริ่มต้นแบบรวดเร็วโดยไม่ใช้ Laravel สามารถเลือกโฟลเดอร์ [`backend/simple-api`](backend/simple-api) ซึ่งเป็น Express เวอร์ชันย่อพร้อม health check, ข่าว และฟอร์มตัวอย่างได้เลย. เอกสารเชิงลึกอยู่ในโฟลเดอร์ [`docs/`](docs/).

## ภาพรวมสถาปัตยกรรม Backend
- **Domain** – กำหนดสัญญา (Port) และ Entity ที่ไม่พึ่งพา Laravel เช่น `App\Domain\User\Contracts\UserRepository` และ `App\Domain\User\Entities\User`.
- **Application / Use Cases** – ชั้นบริการที่ใช้ Port เท่านั้น เช่น `CreateUser` และ `ListUsers`.
- **Infrastructure / Adapters** – การเชื่อมต่อจริงกับ Eloquent หรือหน่วยความจำ (`App\Infrastructure\Persistence\Eloquent\UserRepository`, `...\Memory\UserRepository`).
- Dependency ถูกจัดการด้วย Service Container ผ่านไฟล์ `config/datastore.php` เพื่อ map interface → adapter ตาม driver ที่เลือก

## ขั้นตอนเตรียมทรัพยากรตั้งแต่ติดตั้ง Linux
1. **ติดตั้งดิสโทร Linux** – แนะนำ Ubuntu LTS (เช่น 22.04) สำหรับสภาพแวดล้อมที่มีแพ็กเกจครบและรองรับระยะยาว
2. **อัปเดตระบบพื้นฐาน**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **ติดตั้งเครื่องมือพื้นฐาน** – Git, curl, unzip, build-essential
   ```bash
   sudo apt install -y git curl unzip build-essential
   ```
4. **ติดตั้ง Docker และ Docker Compose Plugin** – ตามคู่มือ [Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) แล้วตรวจสอบด้วย `docker --version` และ `docker compose version`
5. **ติดตั้ง Node.js + pnpm** – ใช้ [NodeSource](https://github.com/nodesource/distributions) เพื่อติดตั้ง Node.js LTS จากนั้นติดตั้ง pnpm (ใช้ใน frontend)
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
6. **ติดตั้ง PHP และ Composer** – หากต้องการรัน Laravel นอก Docker ให้ติดตั้ง PHP 8.2+, ส่วนขยาย (`php8.2-cli php8.2-mbstring php8.2-xml php8.2-sqlite3 php8.2-mysql` เป็นต้น) และ Composer ตามเอกสารทางการ
7. **โคลนโปรเจ็กต์และเตรียมไฟล์สภาพแวดล้อม**
   ```bash
   git clone https://github.com/<org>/PPH-hospital.git
   cd PPH-hospital/backend
   cp .env.example .env
   ```
8. **สร้างทรัพยากรใน Docker (ทางเลือกแนะนำ)**
   ```bash
   docker compose up -d --build
   docker compose exec backend composer install
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate --force
   docker compose exec backend php artisan db:seed --force
   ```
9. **ติดตั้ง dependency สำหรับ frontend**
   ```bash
   cd ../frontend
   pnpm install
   ```
10. **ตรวจสุขภาพระบบ** – รันชุดทดสอบหรือ health check
    ```bash
    cd ../backend
    php artisan test
    curl http://localhost:8000/api/health
    ```

## วิธีสลับฐานข้อมูล
1. แก้ไข `.env` (หรือ `.env.testing`) ให้กำหนด
   ```ini
   DATASTORE_DRIVER=eloquent   # eloquent | memory
   DATASTORE_CONNECTION=sqlite # sqlite | mysql | pgsql | sqlsrv
   ```
2. หากเลือก `eloquent` ให้เตรียม connection ที่ชื่อเดียวกับ `DATASTORE_CONNECTION` ไว้ใน `config/database.php` (รองรับ sqlite/mysql/pgsql/sqlsrv ตามค่าเริ่มต้นของ Laravel).
3. หากเลือก `memory` ระบบจะใช้ repository ในหน่วยความจำทันที เหมาะสำหรับงานทดสอบหรือโหมดฉุกเฉิน

> รายละเอียด mapping และตัวอย่าง sequence diagram ดูใน [`docs/DB.md`](docs/DB.md)

## คำสั่งที่ใช้บ่อย (backend)
```bash
cd backend
composer install
php artisan migrate --force                # เมื่อใช้ driver = eloquent
php artisan db:seed --force                # สร้าง admin และข่าว dev (local/testing)
php artisan test                           # หรือ vendor/bin/phpunit
```
- ทดสอบเฉพาะสัญญา repository: `php artisan test --testsuite=Integration`
- ทดสอบ unit ของ use case: `php artisan test --testsuite=Unit`

ขั้นตอน deployment และ runbook เพิ่มเติมอธิบายไว้ใน [`docs/RUNBOOK.md`](docs/RUNBOOK.md).

## Laravel API Backend (Laravel 11)

โฟลเดอร์ `backend` เป็นโครง Laravel 11 แบบ API only พร้อม Sanctum, middleware สำหรับกำหนด `X-Request-Id` และ logging ที่ดึง context ของคำขออัตโนมัติ

### เตรียมสภาพแวดล้อม
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

### รันเซิร์ฟเวอร์พัฒนา
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### ตรวจสอบโค้ดและทดสอบ
```bash
composer lint
composer format
php artisan test
```

### สังเกตการณ์และตรวจสุขภาพ
- ตรวจ health check: `curl -H "Accept: application/json" http://localhost:8000/api/health`
- ทุก response จะมี header `X-Request-Id` สามารถส่งมากับคำขอเองหรือให้ระบบสร้างให้ และค่าจะสะท้อนใน log
- ดู log แบบ JSON: `tail -f storage/logs/structured.log | jq '.'`

### สลับ datastore
- `.env` ใช้ `DATASTORE_DRIVER=memory` สำหรับการพัฒนา/ทดสอบ, เปลี่ยนเป็น `eloquent` เมื่อเชื่อมฐานข้อมูลจริง
- ปรับ `DATASTORE_CONNECTION` ให้ตรงกับ alias ใน `config/database.php`
