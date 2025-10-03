# ENV & CORS Integration Review

## Base URL usage
- ฟอร์มสาธารณะ (`formsApi`) ใช้ `VITE_API_BASE_URL` หากไม่ตั้งค่าจะ fallback เป็น `window.location.origin` ซึ่งเสี่ยง mismatch กับโดเมน API จริง และไม่ครอบคลุมกรณี SSR หรือสคริปต์รันนอกเบราว์เซอร์ 【F:frontend/src/lib/formsApi.ts†L40-L56】
- พื้นที่ staff (`secureApi`) ใช้ `VITE_SECURE_API` แต่ตั้งค่า default เป็น `http://localhost:4000/api` ที่ไม่ตรงกับข้อเสนอในเอกสาร (`http://localhost:8000`) และไม่แบ่ง staging/prod ตาม `docs/ENV.md` 【F:frontend/src/lib/secureApi.ts†L28-L35】【F:docs/ENV.md†L38-L58】
- คอนเทนต์ข่าวสาธารณะ (`api.fetchNews`) ใช้ `VITE_PUBLIC_API` แต่ fallback เป็น `http://localhost:4000/api` เช่นเดียวกัน ส่งผลให้ดึงข้อมูลจาก mock service ไม่ตรง API จริงเมื่อไม่ตั้งค่า ENV 【F:frontend/src/lib/api.ts†L46-L75】【F:frontend/src/lib/api.ts†L244-L278】

## Credentials & CORS
- ทุกคำขอของ `formsApi` และ `secureApi` ตั้ง `credentials: 'include'` เพื่อใช้ cookie/CSRF ซึ่งสอดคล้องกับนโยบาย Sanctum แต่ต้องแน่ใจว่า `SANCTUM_STATEFUL_DOMAINS` ฝั่ง backend ครอบคลุมโดเมน frontend ตาม `docs/ENV.md` 【F:frontend/src/lib/formsApi.ts†L58-L76】【F:frontend/src/lib/secureApi.ts†L33-L80】【F:docs/ENV.md†L52-L58】
- ยังไม่มีการตั้ง header `Accept` เป็น `application/json` ตามข้อกำหนดใน `docs/ROUTES.md` สำหรับคำขอที่เปลี่ยนข้อมูล ทำให้ Laravel อาจส่ง HTML error กลับมาและทำให้ parser ฝั่ง frontend ล้มเหลว 【F:docs/ROUTES.md†L5-L8】【F:frontend/src/lib/formsApi.ts†L90-L114】

## แนะนำไฟล์ `.env.local`
ตัวอย่างไฟล์ `.env.local.sample` ถูกเพิ่มไว้ที่ `frontend/.env.local.sample` ให้ copy ไปสร้าง `.env.local` แล้วแก้ค่าให้ตรงสภาพแวดล้อม 【F:frontend/.env.local.sample†L1-L6】

## ช่องว่างที่ต้องแก้
1. ปรับ default base URL ให้ตรงกับ `docs/ENV.md` และสนับสนุน staging/prod ผ่าน `.env`
2. เพิ่มการตั้งค่า `Accept: application/json` ทุกคำขอที่เปลี่ยนข้อมูลตามนโยบาย Laravel
3. จัดทำคู่มือ mapping ระหว่างโดเมน frontend ↔ `SANCTUM_STATEFUL_DOMAINS` ใน README เพื่อเลี่ยงปัญหา cookie ไม่ถูกตั้ง
