# Frontend Integration Notes

## Environment variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์นี้โดยอ้างอิงจากตัวอย่างด้านล่าง (ไม่ต้องใส่ secret จริง):

```
VITE_APP_NAME=PPH Hospital Portal
VITE_API_BASE_URL=http://localhost:8000
VITE_PUBLIC_API=http://localhost:8000/api
VITE_SECURE_API=http://localhost:8000/api
```

- `VITE_API_BASE_URL` ต้องไม่มี `/` ต่อท้าย ตามเอกสาร `docs/ENV.md`
- `VITE_PUBLIC_API` และ `VITE_SECURE_API` ใช้เมื่อเชื่อมต่อ endpoint ภายนอก/พื้นที่ staff (สคริปต์ frontend ปัจจุบัน fallback เป็น `http://localhost:4000/api` หากไม่ตั้งค่า)

## Integration check

เรียกคำสั่งด้านล่างจากโฟลเดอร์ `frontend` เพื่อสร้างรายงาน diff และสรุป smoke test:

```bash
npm run integrate:check
```

คำสั่งนี้จะสร้าง/อัปเดตไฟล์รายงานในโฟลเดอร์ `reports/` ระดับ root ของโปรเจกต์ ได้แก่

- `reports/route_contract_diff.md`
- `reports/smoke_results.json`

ตรวจสอบผลลัพธ์และดำเนินการแก้ไขตามรายการที่รายงาน
