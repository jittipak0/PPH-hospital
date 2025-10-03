# Payload Contract Verification

## สรุปจากการอ่านโค้ด frontend

### Public content
- `api.fetchNews` เรียก `GET {PUBLIC_API}/news` และคาดหวัง payload `{ news: [...] }` โดยไม่อ่าน `data.pagination` หรือ `meta` ทำให้ไม่รองรับรูปแบบ `{ data: { news, pagination }, meta }` ตามเอกสาร และไม่ส่งพารามิเตอร์ `page/per_page/sort` 【F:frontend/src/lib/api.ts†L244-L278】【F:docs/ROUTES.md†L32-L70】
- เมื่อ response ไม่ตรง (`response.ok === false`) จะ fallback เป็น dataset ในตัว ไม่ alert ผู้ใช้ว่า API ล้มเหลว ส่งผลให้ error ถูกซ่อน 【F:frontend/src/lib/api.ts†L260-L278】

### Public forms
- Medical record request: แปลง `consent` เป็น string `1/0` และบังคับ `email`, `reason` เป็น required ต่างจาก contract ที่ optional; ไม่แนบ metadata สำหรับไฟล์ตาม policy (MIME/size ไม่ตรวจ) 【F:frontend/src/lib/formsApi.ts†L97-L137】【F:docs/ROUTES.md†L72-L112】
- Donation: ส่งค่า `note` เสมอ (default `''`) และบังคับ `phone`, `email` เป็น required ขัดกับ schema (`phone/email` optional) 【F:frontend/src/lib/formsApi.ts†L133-L160】【F:docs/ROUTES.md†L114-L142】
- Satisfaction: บังคับ `service_date` และส่งทุก field แม้ optional, ไม่จัดการ timezone/format ตามสัญญาที่ระบุ `date` 【F:frontend/src/lib/formsApi.ts†L162-L182】【F:docs/ROUTES.md†L144-L170】
- Health rider: บังคับ `hn` ทั้งที่ optional และส่ง `consent` เป็น boolean (ตรงสัญญา) แต่ไม่มี validation สำหรับ `zipcode` (ไม่ตรวจความยาว) 【F:frontend/src/lib/formsApi.ts†L184-L211】【F:docs/ROUTES.md†L172-L188】

### Authentication & Staff APIs
- `secureApi.request` สร้าง header `Content-Type: application/json` ทุกคำขอ ทำให้ `GET` ก็ใส่ header นี้ (ไม่จำเป็น) และไม่ตั้ง `Accept` 【F:frontend/src/lib/secureApi.ts†L41-L76】
- Login/refresh/logout คาดหวัง shape `{ accessToken, refreshToken, user }`; เมื่อ backend ส่ง `{ data: { token, user } }` จะ throw error จาก `response.ok` แม้สถานะ 200 เพราะ `data.message` ไม่มี 【F:frontend/src/lib/secureApi.ts†L64-L98】【F:docs/ROUTES.md†L160-L214】
- Staff news/doctor/nurse endpoint ทั้งหมดใช้ path `/news`, `/doctor/patients`, `/nurse/schedules` ต่างจาก contract `/api/staff/news` และไม่มี query pagination ทำให้ไม่รองรับ rate limit/filters ตามเอกสาร 【F:frontend/src/lib/secureApi.ts†L99-L173】【F:docs/ROUTES.md†L189-L228】
- User management (`/users`, `/account`, `/users/logs/audit`) ไม่มีในสัญญา API ส่งผลให้ backend จริงตอบ 404/403 แน่นอน 【F:frontend/src/lib/secureApi.ts†L174-L222】【F:docs/ROUTES.md†L189-L228】

## ตัวอย่างผลทดสอบอัตโนมัติ
จาก `npm run integrate:check` (smoke test) มีเพียง 3 endpoint ที่พยายามยิง (`/api/health`, `/api/security/csrf-token`, `/api/news`) และทั้งหมดล้มเหลวเพราะ backend ไม่ตอบ/ไม่ตรง config; รายละเอียดอยู่ใน `reports/smoke_results.json` 【F:reports/smoke_results.json†L1-L38】【a2bd33†L1-L6】

## คำแนะนำ
1. ปรับโค้ดให้ map payload `{ data, meta }` ทุก endpoint และรองรับ `error` object ตามมาตรฐาน Laravel
2. เพิ่มการตรวจ/แปลงค่า form ตาม schema (optional vs required, boolean vs string, validation สำหรับไฟล์และ zipcode)
3. Sync path/method กับสัญญา (`/api/staff/news` เป็นต้น) และลบ endpoint ที่ backend ไม่มี (users/logs/account) หรือย้ายไป feature roadmap
4. ใช้ smoke script ที่เพิ่ม cookie jar/CSRF flow เพื่อจับ error จริงหลังแก้ไข
