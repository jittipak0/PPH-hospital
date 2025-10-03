# Frontend ↔ Backend Integration Summary

## Executive summary
- **สถานะรวม: ไม่ผ่าน** – frontend ปัจจุบันไม่สอดคล้องกับสัญญา API หลัก (news, forms, auth, staff) ทั้งในเรื่อง path, payload, header, และ error shape
- **Coverage:**
  - Path+method ที่พบใน frontend เทียบกับสัญญา = **5/14 (35.7%)** – อีก 9 endpoint ไม่ถูกเรียกเลย 【F:reports/route_contract_diff.md†L6-L18】
  - เมื่อพิจารณา schema/header → ไม่มี endpoint ใดสอดคล้องครบถ้วน (5/5 mismatch) 【F:reports/route_contract_diff.md†L20-L66】
- **Smoke test:** ทุกการทดลองยิง API ล้มเหลวเพราะ base URL/contract ไม่ตรง (0/3 สำเร็จ) 【F:reports/smoke_results.json†L1-L38】【a2bd33†L1-L6】

## Checklist overview
| Item | Status | หลักฐาน |
| --- | --- | --- |
| Auth & RBAC | ❌ | `reports/auth_rbac_flow.md` – ไม่มี `/api/staff/me`, shape login ผิด, route guard ไม่ครอบคลุม |
| CSRF flow | ❌ | `reports/csrf_forms_checklist.md` – token shape ผิด, header ขาด `Accept`, optional field ถูกบังคับ |
| Upload policy | ❌ | `reports/upload_policy_check.md` – ไม่ตรวจ MIME/EXT/ขนาด, consent เป็น string |
| Rate limit / Error UX | ❌ | `reports/error_handling_matrix.md` – ไม่รองรับ 401/403/429 ตามเอกสาร |
| Observability | ❌ | `reports/observability.md` – ไม่อ่าน/ส่ง `X-Request-Id`, log PII โดยตรง |
| ENV & Base URL | ⚠️ | `reports/env_integration.md` – ต้องตั้งค่าเองผ่าน `.env.local`, default fallback ผิดโดเมน |

## Key gaps (prioritized)
1. **Critical – Auth contract mismatch:** ปรับ `secureApi` ให้สอดคล้องกับ response `{ data: { token, user }, meta }`, เรียก `/api/staff/me`, และใช้ abilities แทน role string 【F:reports/auth_rbac_flow.md†L3-L33】
2. **Critical – Form submission schema:** แก้ header `Accept`, map error `{ error: { message } }`, และ align required/optional fields รวมถึง CSRF token shape 【F:reports/route_contract_diff.md†L24-L66】【F:reports/csrf_forms_checklist.md†L3-L12】
3. **High – Endpoint path drift:** ปรับ path `/staff/news` ทั้งชุดให้ตรง `/api/staff/news` และลบ endpoint ที่ backend ไม่มี เช่น `/users`, `/account`, `/auth/refresh` 【F:reports/route_contract_diff.md†L20-L44】【F:reports/payload_contracts.md†L20-L32】
4. **High – Upload validation:** เพิ่ม client-side MIME/size guard ตาม `docs/SECURITY.md` เพื่อลดภาระ backend และ UX ผิดพลาด 【F:reports/upload_policy_check.md†L3-L9】
5. **Medium – Observability:** ดึง `X-Request-Id` จาก response และรวม log ให้ไม่เผย PII เพื่อรองรับ incident response 【F:reports/observability.md†L1-L13】
6. **Medium – News fetch fallback:** แจ้งผู้ใช้เมื่อดึงข่าวไม่สำเร็จ แทน fallback เงียบ เพื่อให้ทีม monitor ปัญหาได้ทัน 【F:reports/payload_contracts.md†L6-L12】

## Action items
- [ ] ปรับ `formsApi`/`secureApi` ให้รองรับโครงสร้าง `{ data, meta }` และ error `{ error: { message, details } }`
- [ ] เพิ่ม `Accept: application/json` และส่งค่า CSRF ตาม field `data.csrf_token`
- [ ] แก้ routing + RBAC ให้ใช้ `RequireAuth` ครอบหน้า `/dashboard` และเช็ค `abilities`
- [ ] เพิ่ม validation ฝั่ง client สำหรับไฟล์แนบ (MIME/ขนาด) และ optional field handling ตาม `docs/ROUTES.md`
- [ ] ใช้ `X-Request-Id` ใน log/error message + เตรียม UI แสดงรหัสให้ผู้ใช้แจ้ง incident
- [ ] อัปเดต `.env.local`/README ให้ชัดเจนเรื่อง base URL และ SANCTUM domains, แล้ว rerun `npm run integrate:check`

## เอกสารอ้างอิง
- Route diff & smoke test: `reports/route_contract_diff.md`, `reports/smoke_results.json`
- การวิเคราะห์เชิงลึก: `reports/env_integration.md`, `reports/auth_rbac_flow.md`, `reports/csrf_forms_checklist.md`, `reports/payload_contracts.md`, `reports/error_handling_matrix.md`, `reports/upload_policy_check.md`, `reports/observability.md`
