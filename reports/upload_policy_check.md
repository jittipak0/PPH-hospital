# Upload Policy Check

| Requirement (docs) | Implementation | Observation | Status |
| --- | --- | --- | --- |
| รองรับไฟล์เฉพาะแบบฟอร์ม `medical-record-request` พร้อมตรวจ MIME, EXT, ขนาด ≤ `FORM_UPLOAD_MAX_MB` 【F:docs/SECURITY.md†L21-L36】【F:docs/ENV.md†L46-L60】 | `formsApi.submitMedicalRecordRequest` แนบไฟล์ตรง ๆ ใน `FormData` โดยไม่ตรวจ MIME/ขนาด หรือ whitelist ส่วนขยาย | เสี่ยงอัปโหลดไฟล์ต้องห้ามไปยัง backend (ภาระ validation ทั้งหมดตกที่ backend) | ❌ |
| ส่งค่า `consent` เป็น boolean/true ตามข้อกำหนด PDPA | Frontend ส่ง string `1/0` ใน FormData | Laravel จะรับเป็น truthy/falsey แต่อ่านง่ายน้อยลง และไม่ตรง contract | ⚠️ |
| Sanitise ข้อมูลก่อน log | ฟังก์ชัน log (`console.info`) สำหรับฟอร์ม appointment/contact เท่านั้น ไม่มีการ log payload ของฟอร์มที่ยิง backend | ไม่มีการ log PII แต่ควรยืนยันว่าฝั่ง backend log ตาม policy | ✅ (ไม่มี log เพิ่มเติม) |

## ข้อเสนอแนะ
1. เพิ่มการตรวจ MIME/extension/ขนาดที่ client ตามค่า `FORM_ALLOWED_MIME`, `FORM_ALLOWED_EXT`, `FORM_UPLOAD_MAX_MB`
2. ปรับ `consent` ให้เป็น boolean ใน FormData (ใช้ `formData.append('consent', payload.consent ? 'true' : 'false')` หรือส่งผ่าน JSON)
3. เพิ่ม feedback ให้ผู้ใช้เมื่อไฟล์ถูกปฏิเสธก่อนส่ง เพื่อประสบการณ์ใช้งานที่ดี
