# ROUTES.md – สรุปเส้นทางและสัญญา API

เอกสารนี้รวบรวม endpoint ที่เตรียมไว้ในสตาร์ตเตอร์ (Laravel + Sanctum) พร้อมสิทธิ์ที่ต้องมี พารามิเตอร์ และตัวอย่างการใช้งาน โปรดอัปเดตทุกครั้งที่เพิ่มหรือแก้ไขเส้นทางใหม่

## 0. หน้าสาธารณะ (Frontend Pages)
| Path | หมวด | คำอธิบาย | สิทธิ์ |
| --- | --- | --- | --- |
| `/` | หน้าแรก | แสดงบริการ โครงการ Quick links และข่าวล่าสุด | สาธารณะ |
| `/about/leadership` | เกี่ยวกับโรงพยาบาล | ทำเนียบผู้บริหารและโครงสร้างการบริหาร | สาธารณะ |
| `/about/history` | เกี่ยวกับโรงพยาบาล | ลำดับเหตุการณ์สำคัญของโรงพยาบาล | สาธารณะ |
| `/about/vision-mission-values` | เกี่ยวกับโรงพยาบาล | วิสัยทัศน์ พันธกิจ และค่านิยม | สาธารณะ |
| `/ethics`, `/ethics/club`, `/ethics/anti-stigma`, `/ethics/laws-acts` | ธรรมาภิบาล/จริยธรรม | นโยบายธรรมาภิบาล ชมรมจริยธรรม มาตรการลดการตีตรา และกฎหมายที่เกี่ยวข้อง | สาธารณะ |
| `/academic/publications` | วิชาการ | ฐานข้อมูลผลงานวิชาการและงานวิจัย | สาธารณะ |
| `/programs/health-rider` | โครงการเด่น | สมัครบริการ Health Rider ส่งยาถึงบ้าน | สาธารณะ (ใช้ฟอร์ม) |
| `/services/online` | บริการออนไลน์ | รวมบริการนัดหมาย ผลตรวจออนไลน์ และช่องทางติดต่อ | สาธารณะ |
| `/transparency/procurement-ita` | ความโปร่งใส | ข่าวจัดซื้อจัดจ้างและสรุปผล ITA | สาธารณะ |
| `/forms/medical-record-request` | แบบฟอร์ม | คำขอรับสำเนาประวัติการรักษา (อัปโหลดไฟล์ได้) | สาธารณะ |
| `/forms/donation` | แบบฟอร์ม | แบบฟอร์มรับบริจาคและออกใบเสร็จ | สาธารณะ |
| `/forms/satisfaction` | แบบฟอร์ม | แบบประเมินความพึงพอใจผู้รับบริการ | สาธารณะ |
| `/intranet/fuel-reimbursement` | ระบบภายใน | ระบบเบิกจ่ายน้ำมัน (แสดงเฉพาะผู้มีสิทธิ์) | Require login + role=staff |
| `/intranet/document-center` | ระบบภายใน | คลังเอกสารภายในพร้อมตัวกรอง | Require login + role=staff |

## 1. เส้นทางสาธารณะ (Public API)
| Method | Path | Auth | คำอธิบาย | พารามิเตอร์/หมายเหตุ | ตัวอย่าง Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | ไม่ต้องล็อกอิน | ตรวจสุขภาพระบบ Laravel API | ใช้สำหรับ monitoring และ uptime check | `{ "data": { "ok": true, "app": { "name": "PPH Hospital", "environment": "staging", "version": "11.0.0" }, "services": { "database": { "status": "ok", "connection": "sqlite" }, "queue": { "status": "ok", "connection": "sync" }, "storage": { "status": "ok", "disk": "local" } } }, "meta": { "request_id": "req-123", "timestamp": "2025-01-03T04:05:06Z" } }` |
| GET | `/api/security/csrf-token` | ไม่ต้องล็อกอิน | ขอ CSRF token ใหม่ (cookie + ใช้ประกอบ header `X-CSRF-Token`) | ควรเรียกก่อนทุก POST/PUT/DELETE | `{ "csrfToken": "..." }` |
| GET | `/api/news` | ไม่ต้องล็อกอิน | รายการข่าวประชาสัมพันธ์ทั้งหมด | รองรับ query `page`, `per_page (<=50)`, `sort` (`-published_at` เป็นค่าเริ่มต้น, `published_at` สำหรับเก่าสุดก่อน) | `{ "data": { "news": [ { "id": 1, "title": "Latest Update", "body": "รายละเอียด...", "published_at": "2025-01-01T12:00:00Z" } ], "pagination": { "current_page": 1, "per_page": 10, "total": 2, "last_page": 1 } }, "meta": { "request_id": "req-abc" } }` |
| GET | `/api/news/featured` | ไม่ต้องล็อกอิน | รายการข่าวที่ติดดาว / แสดงหน้าแรก | เรียงตาม `displayOrder` แล้วตาม `publishedAt` | `{ "news": [ ... ] }` |
| GET | `/api/policies/privacy` | ไม่ต้องล็อกอิน | ข้อความนโยบายความเป็นส่วนตัวฉบับล่าสุด | ใช้แสดงในหน้า onboarding/ยอมรับนโยบาย | `{ "policy": "โรงพยาบาลให้ความสำคัญ..." }` |
| GET | `/api/policies/terms` | ไม่ต้องล็อกอิน | ข้อกำหนดการใช้งานระบบสารสนเทศ | ใช้ในหน้า Terms of Use | `{ "terms": "ระบบสารสนเทศภายในนี้..." }` |

## 2. Authentication
| Method | Path | Auth | คำอธิบาย | Payload | Response |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | ไม่ต้องล็อกอิน (แต่ต้องส่ง CSRF) | ล็อกอินด้วยรหัสบุคลากร HOSxP | `{ "username": "hosxp01", "password": "Secret!", "acceptPolicies": true, "rememberMe": true }` + header `X-CSRF-Token` | 200 + `{ "accessToken": "...", "refreshToken": "...", "user": { id, username, role, fullName, department, acceptedPolicies, lastLoginAt, cid } }`<br>กรณียังไม่ยอมรับนโยบายและ `acceptPolicies` ไม่ส่งจะได้ 412 + `{ "message": "จำเป็นต้องยอมรับ...", "code": "POLICY_ACCEPTANCE_REQUIRED" }`<br>Rate limit 20 ครั้ง/5 นาที/ไอพี |
| POST | `/api/auth/refresh` | ไม่ต้องล็อกอิน | ขอ access token ใหม่โดยใช้ refresh token | `{ "refreshToken": "..." }` (อ่าน/ส่งผ่าน cookie `refreshToken` ก็ได้) | 200 + `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }` |
| POST | `/api/auth/logout` | Bearer token | ออกจากระบบและยกเลิก refresh token | Header `Authorization: Bearer <access>` + body `{ "refreshToken": "..." }` (ถ้าไม่ส่งจะใช้ค่าจาก cookie) | 200 + `{ "success": true }` + เคลียร์ cookie `refreshToken`, `ccid` |

## 3. ข่าวและคอนเทนต์ภายใน
| Method | Path | Auth (Role) | คำอธิบาย | Payload/Query | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/staff/news` | Bearer + (`staff`,`admin`) | ดึงข่าวทั้งหมดสำหรับแดชบอร์ดภายใน (รวมฉบับร่าง) | รองรับ query `page`, `per_page (<=50)`, `sort` (`-published_at` เป็นค่าเริ่มต้น) | 200 + `{ "data": { "news": [ { "id": 12, "title": "นโยบายใหม่", "summary": "เนื้อหา 120 ตัวอักษรแรก...", "body": "เนื้อหาฉบับเต็ม", "published_at": "2025-01-01T12:00:00Z", "created_at": "2025-01-01T10:00:00Z", "updated_at": "2025-01-01T10:00:00Z" } ], "pagination": { "current_page": 1, "per_page": 10, "total": 1, "last_page": 1 } }, "meta": { "request_id": "req-abc" } }` |
| POST | `/api/staff/news` | Bearer + `admin` | สร้างข่าวใหม่ | Header: `X-CSRF-Token`, `X-Requested-With: XMLHttpRequest`<br>Body `{ "title": "หัวข้อ", "body?": "รายละเอียด", "published_at?": "2025-01-01T12:00:00Z" }` | 201 + `{ "data": { "id": 99, "title": "หัวข้อ", "summary": "ตัวอย่าง 120 ตัวอักษร...", "body": "รายละเอียด", "published_at": "2025-01-01T12:00:00Z", "created_at": "2025-01-02T04:05:06Z", "updated_at": "2025-01-02T04:05:06Z" }, "meta": { "request_id": "req-xyz" } }` |
| PUT | `/api/staff/news/{id}` | Bearer + `admin` | แก้ไขข่าว | Header: `X-CSRF-Token`, `X-Requested-With`<br>Body `{ "title?": "อัปเดต", "body?": "รายละเอียดใหม่", "published_at?": null }` (ต้องมีอย่างน้อย 1 ฟิลด์) | 200 + `{ "data": { ... }, "meta": { "request_id" } }` หรือ 404 + `{ "error": { "message": "News article not found." }, "meta": { "request_id" } }` |
| DELETE | `/api/staff/news/{id}` | Bearer + `admin` | ลบข่าว | Header: `X-CSRF-Token`, `X-Requested-With` | 204 No Content (404 หากไม่พบ) |

## 4. จัดการผู้ใช้ (Admin)
| Method | Path | Auth (Role) | คำอธิบาย | Payload | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/users` | Bearer + `admin` | รายชื่อผู้ใช้ทั้งหมด | - | `{ "users": [ { id, username, role, acceptedPolicies, cid, fullName, department, lastLoginAt, createdAt, updatedAt } ] }` |
| POST | `/api/users` | Bearer + `admin` | สร้างผู้ใช้ระบบภายใน | `{ "username": "itstaff", "password": "StrongPass!", "role": "staff" }` | 201 + `{ "user": { id, username, role, acceptedPolicies, cid, fullName, department, lastLoginAt } }` |
| PUT | `/api/users/{userId}` | Bearer + `admin` | ปรับสิทธิ์/รีเซ็ตรหัส/เปลี่ยนสถานะยอมรับนโยบาย | `{ "username?", "password?", "role?", "acceptedPolicies?" }` (ต้องมีอย่างน้อย 1 ฟิลด์) | 200 + `{ "user": { ... } }` หรือ 404 ถ้าไม่พบ |
| DELETE | `/api/users/{userId}` | Bearer + `admin` | ลบบัญชีผู้ใช้ | - | 204 No Content |
| GET | `/api/users/logs/audit` | Bearer + `admin` | ดู audit log ล่าสุด | - | `{ "logs": [ { id, action, ip, createdAt, username } ] }` |

## 5. บทบาทเฉพาะ
| Method | Path | Auth (Role) | คำอธิบาย | Response |
| --- | --- | --- | --- | --- |
| GET | `/api/doctor/patients` | Bearer + `doctor` | รายชื่อผู้ป่วยในความดูแลของแพทย์ | `{ "patients": [ { id, name, diagnosis, updatedAt } ] }` |
| GET | `/api/nurse/schedules` | Bearer + `nurse` | ตารางเวรพยาบาล | `{ "schedules": [ { id, shiftDate, shiftType } ] }` |

## 6. บัญชีผู้ใช้
| Method | Path | Auth | คำอธิบาย | Payload | Response |
| --- | --- | --- | --- | --- | --- |
| DELETE | `/api/account` | Bearer (ทุกบทบาท) | ลบบัญชีตัวเอง (ต้องยืนยันรหัสผ่าน) | `{ "password": "CurrentPass!" }` | 204 No Content (หากรหัสผ่านผิด -> 401 + `{ "message": "Password confirmation failed" }` ) |

## 7. รูปแบบ Error และสถานะ HTTP ที่ใช้
- ข้อมูลไม่ผ่าน validation (Zod): 400 + `{ "message": "Invalid request payload", "issues": [{ "path": "field", "message": "..." }] }`
- ไม่ผ่านการยืนยันตัวตน: 401 + `{ "message": "Authentication required" }` หรือ `{ "message": "Invalid or expired token" }`
- รหัสผ่านยืนยันไม่ถูกต้อง (ลบบัญชี): 401 + `{ "message": "Password confirmation failed" }`
- ยังไม่ยอมรับนโยบาย: 412 + `{ "message": "จำเป็นต้องยอมรับ...", "code": "POLICY_ACCEPTANCE_REQUIRED" }`
- สิทธิ์ไม่พอ: 403 + `{ "message": "Insufficient permissions" }`
- ไม่พบข้อมูล: 404 + `{ "message": "ไม่พบข้อมูลข่าวประชาสัมพันธ์" }` หรือ `{ "message": "User not found" }`
- เรียก login ถี่เกิน (rate limit): 429 + `{ "message": "Too many requests, please try again later." }`
- เชื่อมต่อฐานบุคลากรไม่ได้: 503 + `{ "message": "ไม่สามารถเชื่อมต่อฐานข้อมูลบุคลากรได้" }`
- ข้อผิดพลาดอื่น: 500 + `{ "message": "Internal server error" }`

## 5. แนวทางเพิ่มเติม
- ทุก endpoint ต้องแนบ `Accept: application/json` และ (สำหรับวิธีที่เปลี่ยนสถานะ) header `X-CSRF-Token` ที่ได้จาก `/api/security/csrf-token`
- เก็บ refresh token ไว้ใน HttpOnly cookie ตามที่ API ตอบกลับ และอย่าจัดเก็บ access token ลง localStorage
- หากเพิ่มเวอร์ชันใหม่ ให้นำหน้าด้วย `/api/v2/...` และดูแลให้เอกสารทั้ง Postman + README อัปเดตทันที
- เพิ่ม test และ seed ข้อมูลจำลองเมื่อเพิ่ม resource ใหม่ เพื่อให้ endpoint ที่ใช้ role เฉพาะสามารถทดสอบได้ง่าย
- ระบุ rate limit เพิ่มเติมไว้ใน `docs/SECURITY.md` หากมีการตั้งค่าใหม่
