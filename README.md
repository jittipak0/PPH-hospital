# Hospital Full Starter v2

ชุดโค้ดนี้ปรับ backend Laravel ให้รองรับสถาปัตยกรรม Hexagonal (Ports & Adapters) และสามารถสลับการเชื่อมต่อฐานข้อมูลได้ทันทีผ่านไฟล์คอนฟิกหรือ `.env` โดยไม่กระทบ API ที่มีอยู่ (เช่น `/api/health`). เอกสารเชิงลึกอยู่ในโฟลเดอร์ [`docs/`](docs/).

## ภาพรวมสถาปัตยกรรม Backend
- **Domain** – กำหนดสัญญา (Port) และ Entity ที่ไม่พึ่งพา Laravel เช่น `App\Domain\User\Contracts\UserRepository` และ `App\Domain\User\Entities\User`.
- **Application / Use Cases** – ชั้นบริการที่ใช้ Port เท่านั้น เช่น `CreateUser` และ `ListUsers`.
- **Infrastructure / Adapters** – การเชื่อมต่อจริงกับ Eloquent หรือหน่วยความจำ (`App\Infrastructure\Persistence\Eloquent\UserRepository`, `...\Memory\UserRepository`).
- Dependency ถูกจัดการด้วย Service Container ผ่านไฟล์ `config/datastore.php` เพื่อ map interface → adapter ตาม driver ที่เลือก

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
php artisan test                           # หรือ vendor/bin/phpunit
```
- ทดสอบเฉพาะสัญญา repository: `php artisan test --testsuite=Integration`
- ทดสอบ unit ของ use case: `php artisan test --testsuite=Unit`

ขั้นตอน deployment และ runbook เพิ่มเติมอธิบายไว้ใน [`docs/RUNBOOK.md`](docs/RUNBOOK.md).
