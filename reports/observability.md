# Observability & Request ID Review

## Request tracing
- เอกสารกำหนดให้ backend แนบ `X-Request-Id` ทุกคำขอและให้ log ฝั่ง frontend ระบุ ID เมื่อส่ง error ต่อทีม SRE 【F:docs/SECURITY.md†L29-L38】
- โค้ด frontend ไม่มีการอ่าน header `X-Request-Id` จาก response ใด ๆ (`fetch` ทุกตัวละทิ้ง header) และไม่ส่ง header ดังกล่าวเมื่อเรียกซ้ำ → tracing end-to-end ทำไม่ได้ 【F:frontend/src/lib/formsApi.ts†L75-L124】【F:frontend/src/lib/secureApi.ts†L41-L137】

## Client-side logging
- `api.fetchNews` และฟอร์มต่าง ๆ log ด้วย `console.info/warn` เพื่อ debug แต่ไม่ได้ระบุ request id หรือป้องกัน PII (เช่น log payload ทั้งก้อนใน console) 【F:frontend/src/lib/api.ts†L268-L278】【F:frontend/src/lib/api.ts†L286-L311】
- ไม่มีการตั้งค่า log level หรือ wrapper รวมศูนย์ ทำให้การเก็บ log production ทำได้ยากและมีความเสี่ยงเปิดเผยข้อมูลใน DevTools

## คำแนะนำ
1. เขียน utility อ่าน header `X-Request-Id` จากทุก response แล้วผูกกับ error/log message ที่ส่งให้ผู้ใช้/ทีม incident
2. เมื่อยิง request ซ้ำ (retry) ให้ส่ง header `X-Request-Id` เดิมหรือแนบใน body เพื่อช่วยทีม backend correlate
3. ลดการ log payload ที่มี PII ใน console; หากจำเป็นต้อง debug ให้ mask ข้อมูลสำคัญก่อน log
