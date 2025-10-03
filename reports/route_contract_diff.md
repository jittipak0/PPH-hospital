# Route Contract Diff Report

- Missing endpoints: 9
- Extra frontend-only endpoints: 19
- Contract mismatches: 5

## Endpoints missing from frontend implementation
| Method | Path |
| --- | --- |
| GET | /api/health |
| GET | /api/news |
| POST | /api/auth/login |
| POST | /api/auth/logout |
| GET | /api/staff/me |
| GET | /api/staff/news |
| POST | /api/staff/news |
| PUT | /api/staff/news/{id} |
| DELETE | /api/staff/news/{id} |

## Frontend endpoints without contract coverage
| Method | Path | Source |
| --- | --- | --- |
| GET | /news | src/lib/secureApi.ts:132-142 |
| GET | /security/csrf-token | src/lib/secureApi.ts:32-47 |
| POST | /auth/login | src/lib/secureApi.ts:64-76 |
| POST | /auth/refresh | src/lib/secureApi.ts:77-86 |
| POST | /auth/logout | src/lib/secureApi.ts:87-98 |
| GET | /doctor/patients | src/lib/secureApi.ts:99-112 |
| GET | /nurse/schedules | src/lib/secureApi.ts:113-121 |
| GET | /staff/news | src/lib/secureApi.ts:122-131 |
| POST | /news | src/lib/secureApi.ts:143-152 |
| PUT | /news/{id} | src/lib/secureApi.ts:153-164 |
| DELETE | /news/{id} | src/lib/secureApi.ts:165-173 |
| GET | /users | src/lib/secureApi.ts:174-180 |
| POST | /users | src/lib/secureApi.ts:181-190 |
| PUT | /users/{id} | src/lib/secureApi.ts:191-200 |
| DELETE | /users/{id} | src/lib/secureApi.ts:201-204 |
| GET | /users/logs/audit | src/lib/secureApi.ts:205-213 |
| DELETE | /account | src/lib/secureApi.ts:214-222 |
| GET | /policies/privacy | src/lib/secureApi.ts:223-227 |
| GET | /policies/terms | src/lib/secureApi.ts:228-231 |

## Contract mismatches (shape/header/schema differences)
### GET /api/security/csrf-token
- มี header เกินสัญญา `x-requested-with: xmlhttprequest`
- รูปแบบ response 200 ไม่ตรง
contract: {"shape":{"data":{"csrf_token":"string"},"meta":{"request_id":"string"}}}
frontend: {"shape":{"csrfToken":"string"}}
- frontend ไม่รองรับ response สถานะ 429
- frontend ไม่รองรับ response สถานะ 500

### POST /api/forms/medical-record-request
- ขาด header บังคับ `accept: application/json`
- ขาด header บังคับ `x-csrf-token`
- มี header เกินสัญญา `x-csrf-token: <cached token>`
- เงื่อนไข required ของ `email` ไม่ตรง (contract=false, frontend=true)
- เงื่อนไข required ของ `reason` ไม่ตรง (contract=false, frontend=true)
- ชนิดข้อมูลของ `consent` ไม่ตรง (contract=boolean, frontend=string)
- รูปแบบ response 201 ไม่ตรง
contract: {"shape":{"data":{"id":"number","submitted_at":"string"},"meta":{"request_id":"string"}}}
frontend: {"shape":{"id":"string","message":"string","ok":"boolean"}}
- frontend ไม่รองรับ response สถานะ 400
- frontend ไม่รองรับ response สถานะ 419
- frontend ไม่รองรับ response สถานะ 429
- frontend ไม่รองรับ response สถานะ 500

### POST /api/forms/donation
- ขาด header บังคับ `accept: application/json`
- ขาด header บังคับ `x-csrf-token`
- มี header เกินสัญญา `x-csrf-token: <cached token>`
- เงื่อนไข required ของ `phone` ไม่ตรง (contract=false, frontend=true)
- เงื่อนไข required ของ `email` ไม่ตรง (contract=false, frontend=true)
- รูปแบบ response 201 ไม่ตรง
contract: {"shape":{"data":{"id":"number","reference_code":"string","submitted_at":"string"},"meta":{"request_id":"string"}}}
frontend: {"shape":{"id":"string","message":"string","ok":"boolean"}}
- frontend ไม่รองรับ response สถานะ 400
- frontend ไม่รองรับ response สถานะ 419
- frontend ไม่รองรับ response สถานะ 429
- frontend ไม่รองรับ response สถานะ 500

### POST /api/forms/satisfaction
- ขาด header บังคับ `accept: application/json`
- ขาด header บังคับ `x-csrf-token`
- มี header เกินสัญญา `x-csrf-token: <cached token>`
- เงื่อนไข required ของ `service_date` ไม่ตรง (contract=false, frontend=true)
- รูปแบบ response 201 ไม่ตรง
contract: {"shape":{"data":{"id":"number","submitted_at":"string"},"meta":{"request_id":"string"}}}
frontend: {"shape":{"id":"string","message":"string","ok":"boolean"}}
- frontend ไม่รองรับ response สถานะ 400
- frontend ไม่รองรับ response สถานะ 419
- frontend ไม่รองรับ response สถานะ 429
- frontend ไม่รองรับ response สถานะ 500

### POST /api/programs/health-rider/apply
- ขาด header บังคับ `accept: application/json`
- ขาด header บังคับ `x-csrf-token`
- มี header เกินสัญญา `x-csrf-token: <cached token>`
- เงื่อนไข required ของ `hn` ไม่ตรง (contract=false, frontend=true)
- รูปแบบ response 201 ไม่ตรง
contract: {"shape":{"data":{"id":"number","submitted_at":"string"},"meta":{"request_id":"string"}}}
frontend: {"shape":{"id":"string","message":"string","ok":"boolean"}}
- frontend ไม่รองรับ response สถานะ 400
- frontend ไม่รองรับ response สถานะ 419
- frontend ไม่รองรับ response สถานะ 429
- frontend ไม่รองรับ response สถานะ 500
