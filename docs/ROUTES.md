# ROUTES.md – สรุปเส้นทางและสัญญา API

Laravel API นี้รองรับทั้ง endpoint สาธารณะ, ฟอร์ม และพื้นที่ทำงานของ staff ผ่าน Sanctum token. ทุก response ยึดรูปแบบ `{ "data": ..., "meta": { "request_id": "..." } }` หรือ `{ "error": ... }` เมื่อเกิดข้อผิดพลาด โปรดอัปเดตเอกสารเมื่อมีการเพิ่ม/แก้ endpoint

> ทุกคำขอที่เปลี่ยนข้อมูลต้องแนบ header `Accept: application/json`, `X-CSRF-TOKEN` (ค่าจาก `/api/security/csrf-token`) และ `X-Requested-With: XMLHttpRequest`

## 1. สาธารณะ (ไม่ต้องล็อกอิน)

### GET `/api/health`
- **คำอธิบาย:** ตรวจสุขภาพระบบ backend
- **Rate limit:** `throttle:public-api` (`RATE_LIMIT_PUBLIC` requests/นาที/ไอพี)
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "ok": true,
    "app": {
      "name": "PPH Hospital API",
      "environment": "staging",
      "version": "11.0.0"
    },
    "services": {
      "database": { "status": "ok", "connection": "sqlite" },
      "queue": { "status": "ok", "connection": "database" },
      "storage": { "status": "ok", "disk": "local" }
    }
  },
  "meta": {
    "request_id": "req-123",
    "timestamp": "2025-01-04T05:06:07Z"
  }
}
```

### GET `/api/security/csrf-token`
- **คำอธิบาย:** แจก CSRF token ให้ frontend (ส่งทั้ง cookie `XSRF-TOKEN` และค่าใน body)
- **Rate limit:** `throttle:public-api`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "csrf_token": "QzE2c..."
  },
  "meta": {
    "request_id": "req-csrf"
  }
}
```

### GET `/api/news`
- **คำอธิบาย:** ดึงข่าวประชาสัมพันธ์ที่เผยแพร่แล้ว (เรียงล่าสุดก่อน)
- **Query:** `page` (ค่าเริ่ม 1), `per_page` (ค่าเริ่ม 10 สูงสุด 50), `sort` (`-published_at` หรือ `published_at`)
- **Rate limit:** `throttle:public-api`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "news": [
      {
        "id": 12,
        "title": "เปิดให้บริการคลินิกนอกเวลา",
        "body": "รายละเอียดข่าว...",
        "published_at": "2025-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 8,
      "last_page": 1
    }
  },
  "meta": {
    "request_id": "req-news"
  }
}
```

### POST `/api/forms/medical-record-request`
- **คำอธิบาย:** ยื่นคำขอรับสำเนาประวัติการรักษา + อัปโหลดไฟล์สำเนาบัตรประชาชน
- **Header บังคับ:** `X-CSRF-TOKEN`, `X-Requested-With: XMLHttpRequest`
- **Payload (multipart/form-data):**
  - `full_name` *(string, required)*
  - `hn` *(string, required)*
  - `citizen_id` *(string, required)* – ไม่เก็บ plain text จะถูกแฮชทันที
  - `phone` *(string, required)*
  - `email` *(string, optional)*
  - `address` *(string, required)*
  - `reason` *(string, optional)*
  - `consent` *(boolean, required)*
  - `idcard_file` *(file, optional)* – MIME/EXT ต้องอยู่ใน `FORM_ALLOWED_MIME`/`FORM_ALLOWED_EXT`, ขนาด ≤ `FORM_UPLOAD_MAX_MB`
- **Response 201 ตัวอย่าง**
```json
{
  "data": {
    "id": 45,
    "submitted_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-med"
  }
}
```

### POST `/api/forms/donation`
- **คำอธิบาย:** บันทึกการแจ้งบริจาค
- **Header บังคับ:** เหมือนด้านบน
- **Payload (JSON):** `donor_name`, `amount` (>0), `channel` (`cash|bank|promptpay`), `phone?`, `email?`, `note?`
- **Response 201 ตัวอย่าง**
```json
{
  "data": {
    "id": 7,
    "reference_code": "A1B2C3D4E5",
    "submitted_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-donation"
  }
}
```

### POST `/api/forms/satisfaction`
- **คำอธิบาย:** แบบประเมินความพึงพอใจ (คะแนน 1-5)
- **Payload (JSON):** `score_overall`, `score_waittime`, `score_staff`, `comment?`, `service_date?`
- **Response 201 ตัวอย่าง**
```json
{
  "data": {
    "id": 3,
    "submitted_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-survey"
  }
}
```

### POST `/api/programs/health-rider/apply`
- **คำอธิบาย:** สมัครบริการส่งยาถึงบ้าน
- **Payload (JSON):** `full_name`, `hn?`, `address`, `district`, `province`, `zipcode`, `phone`, `line_id?`, `consent`
- **Response 201 ตัวอย่าง**
```json
{
  "data": {
    "id": 11,
    "submitted_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-rider"
  }
}
```

## 2. Authentication (Sanctum Personal Access Token)

### POST `/api/auth/login`
- **คำอธิบาย:** เข้าสู่ระบบด้วย username/password ของบุคลากร
- **Middleware:** `throttle:auth-login`, `api.csrf`
- **Payload (JSON):** `username`, `password`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "token": {
      "access_token": "1|Xyz...",
      "token_type": "Bearer",
      "abilities": ["staff"]
    },
    "user": {
      "id": "1",
      "username": "staff01",
      "name": "Staff User",
      "email": "staff@example.com",
      "role": "staff",
      "abilities": ["staff"],
      "last_login_at": "2025-01-04T05:06:07Z"
    }
  },
  "meta": {
    "request_id": "req-login"
  }
}
```
- **Response 401 เมื่อ credential ไม่ถูกต้อง**
```json
{
  "error": {
    "message": "Authentication failed."
  },
  "meta": {
    "request_id": "req-login"
  }
}
```

### POST `/api/auth/logout`
- **คำอธิบาย:** เพิกถอน token ปัจจุบัน
- **Middleware:** `auth:sanctum`, `throttle:staff-api`, `api.csrf`
- **Header:** `Authorization: Bearer <token>`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "success": true
  },
  "meta": {
    "request_id": "req-logout"
  }
}
```

### GET `/api/staff/me`
- **คำอธิบาย:** ดึงโปรไฟล์ผู้ใช้งานปัจจุบันพร้อม abilities
- **Middleware:** `auth:sanctum`, `throttle:staff-api`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "id": "1",
    "username": "admin",
    "name": "System Administrator",
    "email": "admin@example.com",
    "role": "admin",
    "abilities": ["admin","staff"],
    "last_login_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-me"
  }
}
```

## 3. Staff News Management (ต้องมี Sanctum token)

### GET `/api/staff/news`
- **สิทธิ์:** token ต้องมี ability `staff` หรือ `admin`
- **Query:** `page`, `per_page` (≤50), `sort` (`-published_at` เริ่มต้น)
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "news": [
      {
        "id": 5,
        "title": "ตารางเวรประจำเดือน",
        "summary": "รายละเอียดฉบับเต็ม 120 ตัวอักษรแรก...",
        "body": "รายละเอียดฉบับเต็ม...",
        "published_at": "2025-01-01T12:00:00Z",
        "created_at": "2025-01-01T10:00:00Z",
        "updated_at": "2025-01-02T08:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 3,
      "last_page": 1
    }
  },
  "meta": {
    "request_id": "req-staff-news"
  }
}
```

### POST `/api/staff/news`
- **สิทธิ์:** ability `admin`
- **Header:** ต้องมี CSRF + `X-Requested-With`
- **Payload (JSON):** `title` (required), `body?`, `published_at?`
- **Response 201 ตัวอย่าง**
```json
{
  "data": {
    "id": 6,
    "title": "ประกาศหยุดให้บริการ",
    "summary": "ประกาศหยุด...",
    "body": "เนื้อหาประกาศ",
    "published_at": "2025-01-05T00:00:00Z",
    "created_at": "2025-01-04T05:06:07Z",
    "updated_at": "2025-01-04T05:06:07Z"
  },
  "meta": {
    "request_id": "req-create-news"
  }
}
```

### PUT `/api/staff/news/{id}`
- **สิทธิ์:** ability `admin`
- **Payload (JSON):** ต้องมีอย่างน้อยหนึ่งฟิลด์จาก `title`, `body`, `published_at`
- **Response 200 ตัวอย่าง**
```json
{
  "data": {
    "id": 6,
    "title": "ประกาศหยุดให้บริการ (อัปเดต)",
    "summary": "ประกาศหยุด...",
    "body": "เนื้อหาที่แก้ไข",
    "published_at": "2025-01-05T06:00:00Z",
    "created_at": "2025-01-04T05:06:07Z",
    "updated_at": "2025-01-04T08:09:10Z"
  },
  "meta": {
    "request_id": "req-update-news"
  }
}
```
- **Response 404:** `{ "error": { "message": "News article not found." }, "meta": { "request_id": "..." } }`

### DELETE `/api/staff/news/{id}`
- **สิทธิ์:** ability `admin`
- **Response:** `204 No Content` พร้อม header `X-Request-Id`

## 4. รูปแบบ Error มาตรฐาน
| สถานะ | เงื่อนไข | Payload |
| --- | --- | --- |
| 400 | Validation ไม่ผ่าน | `{ "error": { "message": "The given data was invalid.", "details": { "field": ["message"] } }, "meta": {"request_id": "..."} }` |
| 401 | ไม่มีสิทธิ์/ token ผิด | `{ "error": { "message": "Authentication failed." }, "meta": {"request_id": "..."} }` |
| 403 | สิทธิ์ไม่เพียงพอ | `{ "error": { "message": "This action is unauthorized." }, "meta": {"request_id": "..."} }` |
| 404 | ไม่พบข้อมูล | `{ "error": { "message": "News article not found." }, "meta": {"request_id": "..."} }` |
| 419 | CSRF ผิด | `{ "error": { "message": "CSRF token mismatch." }, "meta": {"request_id": "..."} }` |
| 429 | เกิน rate limit | `{ "error": { "message": "Too many requests." }, "meta": {"request_id": "..."} }` |
| 500 | ข้อผิดพลาดภายใน | `{ "error": { "message": "Internal server error." }, "meta": {"request_id": "..."} }` |

## 5. หมายเหตุเพิ่มเติม
- ทุก log ที่ระดับ DEBUG จะมี context `request_id`, `user_id` (ถ้ามี), `ip`, `user_agent` แต่จะไม่บันทึกข้อมูล PII/credential
- ใช้ Postman collection ใน `postman/PPH-hospital.postman_collection.json` สำหรับทดสอบ และตั้งค่า environment ให้ตรงกับโดเมนแต่ละสภาพแวดล้อม
- เมื่อเพิ่ม endpoint ใหม่ ต้องเพิ่ม test (Feature + Unit), อัปเดตเอกสารนี้ และ sync Postman collection พร้อม environment
