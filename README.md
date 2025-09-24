# PPH Hospital Secure Portal Starter

Starter code base ที่แยก frontend (React) และ backend (Express) เพื่อสาธิตระบบความปลอดภัยสำหรับบุคลากรโรงพยาบาล PPH ตามข้อกำหนดการยืนยันตัวตน, RBAC, นโยบายความเป็นส่วนตัว และการปกป้องข้อมูลผู้ใช้

## โครงสร้างโปรเจกต์

```
PPH-hospital/
├── backend/         # Express API + SQLite (better-sqlite3)
├── frontend/        # React + Vite dashboard
├── docs/            # เอกสารเดิมจากโปรเจกต์
├── nginx/, systemd/ # ตัวอย่าง deployment (ยังสามารถใช้งานร่วมได้)
└── README.md
```

## Backend (Express + SQLite)

- Authentication: `bcrypt` + JWT access token อายุ 15 นาที
- Refresh token เก็บไว้ในตาราง `sessions` (hash + fingerprint) อายุ 7 วัน
- RBAC: `authorize([roles])` จำกัดสิทธิ์สำหรับ `admin`, `doctor`, `nurse`, `staff`
- Audit log สำหรับทุก request ที่ผ่านการยืนยันตัวตน
- Input validation ด้วย `zod`, ป้องกัน XSS ด้วย sanitizer, CSRF token สำหรับฟอร์ม
- Privacy/Terms endpoint พร้อมรองรับการยอมรับนโยบายและลบบัญชี (PDPA/GDPR)

### เริ่มต้นใช้งาน backend

```bash
cd backend
cp .env.example .env   # แก้ไขค่า secret ตามสภาพแวดล้อม
npm install
npm run dev            # หรือ npm start สำหรับ production
```

ค่า environment สำคัญใน `.env`:

- `PORT` – พอร์ตของ Express API (ค่าเริ่มต้น 4000)
- `DB_URL` – path ของ SQLite (เช่น `sqlite://./data/database.sqlite`)
- `JWT_SECRET`, `REFRESH_TOKEN_SECRET` – ความลับสำหรับเซ็น token
- `TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY` – อายุของ access/refresh token
- `CSRF_SECRET` – secret สำหรับตั้งค่า `cookie-parser`

### Endpoint หลัก

| Method | Path | Description | Role |
| ------ | ---- | ----------- | ---- |
| POST | `/auth/login` | เข้าสู่ระบบ + รับ JWT/Refresh token | บุคลากรภายใน |
| POST | `/auth/refresh` | ขอ access token ใหม่ | ทุกคน (มี refresh token) |
| POST | `/auth/logout` | ยกเลิก refresh token | ทุกคน |
| GET | `/admin/users` | รายชื่อบุคลากร | admin |
| POST | `/admin/users` | สร้างบัญชีใหม่ | admin |
| PATCH | `/admin/users/:id/role` | อัปเดตบทบาท | admin |
| DELETE | `/admin/users/:id` | ลบบัญชี | admin |
| GET | `/doctor/patients` | ข้อมูลผู้ป่วยของแพทย์ | doctor |
| GET | `/nurse/shifts` | ตารางเวรพยาบาล | nurse |
| GET | `/staff/announcements` | ข่าวสารภายใน | staff, admin |
| DELETE | `/account/me` | ลบบัญชีตนเอง | ผู้ใช้ที่ล็อกอิน |
| GET | `/info/policy` | นโยบายความเป็นส่วนตัว | สาธารณะ |
| GET | `/info/terms` | ข้อตกลงการใช้งาน | สาธารณะ |

บัญชีตัวอย่าง (รหัสผ่าน `Password123!`): `admin`, `dr.smith`, `nurse.annie`, `staff.joe`

## Frontend (React + Vite)

- Login Form พร้อม checkbox ยอมรับนโยบายความเป็นส่วนตัว
- Dashboard เฉพาะบทบาท (Admin/Doctor/Nurse/Staff)
- หน้าแสดงนโยบายความเป็นส่วนตัวและข้อตกลงการใช้งาน
- ใช้ Context เก็บ token/สถานะผู้ใช้ และ refresh token อัตโนมัติเมื่อ 401

### เริ่มต้นใช้งาน frontend

```bash
cd frontend
npm install
npm run dev
```

ไฟล์ `.env` สำหรับ frontend (ถ้าต้องการปรับ API base):

```
VITE_API_URL=http://localhost:4000
```

## การทดสอบ

- Backend: `npm test` (Jest ทดสอบ middleware RBAC)
- Frontend: `npm test` (Vitest configuration พร้อม Testing Library)

## ข้อแนะนำด้านความปลอดภัยเพิ่มเติม

- รันผ่าน HTTPS/Reverse Proxy และเพิ่ม rate limit ตามสภาพแวดล้อมจริง
- ปรับ secret ให้สุ่มและเก็บใน secret manager
- ต่อยอดเชื่อมต่อ LDAP/SSO หรือระบบ HR ภายในหากต้องการใช้จริง

