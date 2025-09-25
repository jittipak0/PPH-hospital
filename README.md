# Hospital Full Starter v2

ระบบตัวอย่างสำหรับบริหารโรงพยาบาล ประกอบด้วย Laravel Backend + React Frontend + เอกสาร deploy ครบชุด รายละเอียดเชิงลึกอยู่ในโฟลเดอร์ [`docs/`](docs/) แต่หัวข้อนี้สรุปภาพรวมสถาปัตยกรรม backend ที่เพิ่งปรับเป็น Hexagonal (Ports & Adapters) และขั้นตอนใช้งานสำคัญ

## สถาปัตยกรรม Backend (Hexagonal)
Backend ถูกแยกเป็น 3 เลเยอร์หลักตามแนวคิด Hexagonal Architecture เพื่อให้สลับแหล่งข้อมูลได้ง่ายโดยไม่กระทบ API เดิม

- **Domain** – กำหนดสัญญา (Interface) ของ Repository และออบเจ็กต์โดเมน (DTO/Entity) ที่ใช้แลกเปลี่ยนข้อมูล เช่น `App\Domain\User\Contracts\UserRepository`
- **Application / Use Cases** – ตรรกะกรณีใช้งานที่เรียกผ่าน Controller โดยพึ่งพา Port จาก Domain เท่านั้น เช่น `CreateUser`, `ListUsers`
- **Infrastructure / Adapters** – อะแดปเตอร์จริงของแต่ละ Repository (Eloquent, In-memory) ประกาศใน `config/datastore.php` และถูก bind ผ่าน `AppServiceProvider`

ดังนั้น Controller จะรับ Interface จาก Service Container และไม่ทราบว่าขณะนั้นเชื่อมต่อฐานข้อมูลประเภทใด

## การสลับฐานข้อมูล
สามารถเลือกใช้ Eloquent (กับ connection ที่ต้องการ) หรือ Memory Adapter ได้โดยไม่แก้โค้ด เพียงตั้งค่าใน `.env`

```env
DATASTORE_DRIVER=eloquent   # eloquent | memory
DATASTORE_CONNECTION=sqlite # ชื่อ connection ใน config/database.php เช่น sqlite/mysql/pgsql/sqlsrv
```

Service Container จะอ่าน mapping จาก `config/datastore.php` แล้ว bind interface → adapter ให้โดยอัตโนมัติ หากตั้งค่าเป็น `memory` ระบบจะใช้ repository ในหน่วยความจำ เหมาะกับการทดสอบหรือกรณีฉุกเฉิน ขณะที่ `eloquent` จะบังคับ model ใช้ connection ตาม alias ที่กำหนด

## ขั้นตอนเริ่มพัฒนา Backend
1. `cd backend`
2. `cp .env.example .env` (ถ้ายังไม่มี APP_KEY รัน `php artisan key:generate`)
3. ตั้งค่า DB / Datastore ตามสภาพแวดล้อม (ค่าเริ่มต้นใช้ SQLite)
4. `composer install`
5. `php artisan migrate`
6. `php artisan serve` สำหรับ dev server

Frontend ให้ดู README ในโฟลเดอร์ `frontend/`

## การทดสอบ
- Unit & Integration: `php artisan test` หรือ `./vendor/bin/phpunit`
- Static Analysis (Larastan): `./vendor/bin/phpstan analyse`

workflow CI ใหม่จะเรียกใช้ชุดคำสั่งด้านบนโดยอัตโนมัติบน SQLite in-memory

## เอกสารประกอบเพิ่มเติม
- [`docs/ENV.md`](docs/ENV.md) – ตารางตัวแปรแวดล้อมที่ต้องใช้
- [`docs/DB.md`](docs/DB.md) – อธิบาย Ports & Adapters และ mapping เชื่อมต่อฐานข้อมูล
- [`docs/RUNBOOK.md`](docs/RUNBOOK.md) – ขั้นตอน deploy/rollback พร้อมคู่มือเปิดใช้ DB หลายชนิด
- [`docs/SECURITY.md`](docs/SECURITY.md) – แนวปฏิบัติด้านความปลอดภัยและ least privilege สำหรับ service account

> โปรดอัปเดตเอกสารทุกครั้งที่เพิ่ม aggregate ใหม่หรือมีการเชื่อมต่อ datasource เพิ่มเติม เพื่อให้ทีม Dev/DevOps เข้าใจตรงกัน
