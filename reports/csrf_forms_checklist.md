# CSRF Forms Checklist

| Form | Token retrieval | Submission headers | Notes | Status |
| --- | --- | --- | --- | --- |
| Medical record request | เรียก `GET /api/security/csrf-token` แต่คาดหวัง body เป็น `{ csrfToken }` ทำให้พังกับ payload จริง `{ data: { csrf_token } }` | ตั้ง `X-Requested-With`, `X-CSRF-Token` (ไม่มี `Accept: application/json`) | ไม่มีการ validate ไฟล์ตาม policy และส่ง `consent` เป็น string `1/0` | ❌
| Donation form | ใช้ `ensureCsrfToken` เดียวกัน (token shape ผิด) | ส่ง `Content-Type: application/json`, `X-Requested-With`, `X-CSRF-Token` แต่ยังขาด `Accept` | บังคับ `email`, `phone` เป็น required ทั้งที่ optional และไม่ handle error shape | ❌
| Satisfaction survey | ใช้ `ensureCsrfToken` (shape ผิด) | เช่นเดียวกับด้านบน | บังคับ `service_date` เป็น required ขัดสัญญา | ❌
| Health rider apply | ใช้ `ensureCsrfToken` (shape ผิด) | ตั้ง header JSON เหมือนฟอร์มอื่น | บังคับ `hn` เป็น required (เอกสาร optional) | ❌

## Observations
- แม้จะเรียก endpoint token ก่อน submit แต่การอ่านค่า `csrfToken` แทน `data.csrf_token` ทำให้ header `X-CSRF-Token` ว่าง/null กับ API จริง 【F:frontend/src/lib/formsApi.ts†L52-L78】
- ไม่ตั้ง `Accept: application/json` ทำให้ fallback error ของ Laravel เป็น HTML; `parseError` จะไม่พบบอดี้ `error` ตามมาตรฐาน 【F:frontend/src/lib/formsApi.ts†L80-L124】【F:docs/ROUTES.md†L5-L8】
- ขาดการจัดการ cookie `XSRF-TOKEN` (ไม่มีการตรวจว่าตั้งค่าได้หรือไม่) หากโดเมนไม่อยู่ใน `SANCTUM_STATEFUL_DOMAINS` จะล้มเหลวตาม `docs/SECURITY.md` 【F:docs/SECURITY.md†L9-L28】
