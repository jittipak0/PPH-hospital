# Error Handling Matrix

| Endpoint group | Expected status codes (docs) | Frontend behaviour | Assessment |
| --- | --- | --- | --- |
| Public forms (`/api/forms/*`, `/api/programs/health-rider/apply`) | 201 success, 400 validation, 419 CSRF, 429 rate limit, 500 server 【F:docs/ROUTES.md†L72-L188】 | `formsApi` โยน `FormApiError` ที่ดึง `message` และ `errors` จากบอดี้ราบ (ไม่ใช่ `error.message`). เมื่อ backend ส่ง `{ error: { message } }` จะไม่เจอข้อความและ fallback เป็น "ไม่สามารถส่งข้อมูลได้"; ไม่มีการจับ 429/419 แยก | ❌ ไม่ตรง schema และไม่มี UX เฉพาะสถานะสำคัญ 【F:frontend/src/lib/formsApi.ts†L80-L124】 |
| CSRF token (`GET /api/security/csrf-token`) | 200/429/500 【F:docs/ROUTES.md†L20-L46】 | หาก response ไม่ `ok` จะ throw `Error('ไม่สามารถดึง CSRF token ได้')` โดยไม่อ่านข้อความจาก body; ไม่ retry | ⚠️ ข้อความรวม generic แต่พอใช้งานได้ (ยังไม่อ่าน `error.message`) 【F:frontend/src/lib/formsApi.ts†L58-L78】 |
| Auth login/logout | 200 success, 401 invalid, 429 limiter, 500 server 【F:docs/ROUTES.md†L160-L214】 | `secureApi.request` อ่าน `message` จาก root level (คาดว่า backend ส่ง `{ message }`); ถ้าไม่พบจะใช้ข้อความ default "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์"; ไม่จับ 429/419 เฉพาะ ก่อให้เกิด UX เดิม | ❌ Response shape mismatch ทำให้ 401/429 จาก backend กลายเป็น generic error 【F:frontend/src/lib/secureApi.ts†L41-L90】 |
| Staff APIs (`/api/staff/news`, `/api/staff/me`) | 200 success, 401/403 auth, 429 limiter, 404 not found | ทุกคำขอใช้ `secureApi.request` เดียวกัน → กรณี 403/404 จะได้ข้อความ default ไม่ระบุปัญหา, ไม่มี redirect/log out เมื่อ 401 | ❌ ไม่มี fail-safe (เช่น logout เมื่อ token หมดอายุ) หรือข้อความระบุสิทธิ์ 【F:frontend/src/lib/secureApi.ts†L71-L137】 |
| Public news (`GET /api/news`) | 200 success, 400 query invalid, 429 limiter, 500 server 【F:docs/ROUTES.md†L32-L70】 | หาก `fetch` ล้มเหลวหรือ status ≠ 200 จะ fallback dataset mock และ log `console.warn`; ผู้ใช้ไม่เห็น error | ⚠️ ไม่แจ้งผู้ใช้ แต่ยังมีคอนเทนต์สำรอง; เสี่ยงปิดบังปัญหา prod 【F:frontend/src/lib/api.ts†L260-L278】 |

## ข้อเสนอปรับปรุง
1. ปรับ parser ให้รองรับ payload `{ error: { message, details } }` และ map status → UX (แสดง field error, แจ้งให้ retry, สั่งรีเฟรช token ฯลฯ)
2. เมื่อเจอ 401/419 จาก `secureApi` ให้ trigger logout/redirect หรือขอ CSRF token ใหม่ตาม `docs/SECURITY.md`
3. แสดงข้อความเฉพาะสำหรับ 429 (rate limit) และ 403 (สิทธิ์ไม่พอ) แทน generic error เพื่อช่วยผู้ใช้
4. สำหรับข่าวสาธารณะ ให้แจ้ง banner ว่า "ข้อมูลล่าสุดไม่สามารถดึงได้" แทน fallback เงียบ ๆ
