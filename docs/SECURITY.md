# SECURITY.md – แนวปฏิบัติด้านความปลอดภัยของแพลตฟอร์ม

ข้อมูลที่เกี่ยวข้องกับสถานพยาบาลถือเป็นข้อมูลอ่อนไหวสูง เอกสารนี้สรุปมาตรการพื้นฐานที่ทุกทีมต้องปฏิบัติ รวมถึงรายการตรวจสอบที่ต้องทำอย่างสม่ำเสมอ โปรดอัปเดตเมื่อมีนโยบายหรือเครื่องมือใหม่

## 1. แอปพลิเคชันและโค้ด
- ใช้ HTTPS ทุกสภาพแวดล้อม พร้อมเปิด HSTS (Strict-Transport-Security)
- กำหนด Security Header ผ่าน Nginx: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`
- ปิด `APP_DEBUG` ใน production และไม่ส่ง stack trace กลับไปยังผู้ใช้
- ตรวจสอบ input ทุกจุดด้วย Laravel Form Request + escape output ใน frontend เพื่อป้องกัน XSS/SQL Injection
- ใช้ Sanctum token abilities (`viewer`, `staff`, `admin`) และตรวจสอบสิทธิ์ใน policy/service ทุกครั้ง
- เปิด rate limit สำหรับ endpoint สำคัญ เช่น login, news CRUD (เช่น `60 requests/min/user`)
- จัดการไฟล์อัปโหลด: ตรวจ MIME/ขนาดไฟล์ เก็บนอก webroot และสแกนไวรัสก่อนให้ดาวน์โหลด
- จัดการ dependency ด้วย Dependabot/Renovate และตรวจสอบช่องโหว่ผ่าน `npm audit` / `composer audit`

## 2. ข้อมูลและความเป็นส่วนตัว
- เก็บข้อมูลส่วนบุคคลตามหลักการ minimized: เก็บเท่าที่จำเป็น
- เข้ารหัสข้อมูลอ่อนไหว (เช่น หมายเลขเวชระเบียน) ด้วย `Crypt::encrypt` หรือ column encryption
- แยกสิทธิ์การเข้าถึงข้อมูลตามบทบาทในฐานข้อมูล (database user แยกสำหรับ read/write)
- บันทึกการเข้าถึงข้อมูลสำคัญ (audit trail) เพื่อรองรับการตรวจสอบย้อนหลัง
- กำหนดนโยบาย retention และลบข้อมูลที่หมดอายุหรือไม่ได้ใช้งาน
- กำหนด least privilege ให้ service account ที่ใช้ใน `DATASTORE_CONNECTION` (จำกัดเฉพาะ schema ของแอป ไม่อนุญาต DDL)
- หมุนรหัสผ่านฐานข้อมูลหรือ Secret ของ service account อย่างน้อยทุก 90 วัน พร้อมบันทึกวันที่หมุนในระบบจัดการความลับ

## 3. โครงสร้างพื้นฐาน
- ใช้ firewall จำกัดการเข้าถึงพอร์ต (อนุญาตเฉพาะ 80/443 สำหรับสาธารณะ, 22 สำหรับ IP ที่อนุญาต)
- อัปเดตระบบปฏิบัติการ, PHP, Node.js, MySQL เป็นประจำตามรอบ patch ของผู้ผลิต
- ใช้ระบบสำรองข้อมูลอัตโนมัติ + จัดเก็บในที่ปลอดภัย (offsite + encryption)
- ตรวจสอบสิทธิ์ของ process/file: web user (`www-data`) ไม่มีสิทธิ์เขียนเกินความจำเป็น
- เปิดใช้ Fail2ban/ModSecurity หรือ WAF หากระบบเชื่อมต่ออินเทอร์เน็ตสาธารณะ
- ติดตั้งระบบตรวจสอบการบุกรุก (IDS/IPS) และเชื่อมต่อ log เข้ากับระบบรวมศูนย์
- หากใช้งาน connection หลายชุด ให้แยก secret/credential ต่อ connection และจำกัด firewall/SG ให้เฉพาะต้นทางที่จำเป็นเท่านั้น

## 4. กระบวนการและบุคลากร
- บังคับใช้ 2FA กับบัญชีที่เข้าถึงเซิร์ฟเวอร์, GitHub, ระบบบริหารโครงการ
- ทบทวนสิทธิ์ (access review) รายไตรมาสสำหรับ GitHub, Database, Cloud provider
- มีขั้นตอนแจ้งเหตุ security incident ที่ชัดเจน (ดู `docs/RUNBOOK.md`)
- จัดอบรมความปลอดภัยประจำปีให้กับทีมพัฒนาและดูแลระบบ
- เก็บหลักฐานการทดสอบ penetration หรือ vulnerability scan และติดตามผลการแก้ไข

## 5. ตารางตรวจสอบประจำ (Security Checklist)
| ความถี่ | งานที่ต้องทำ | ผู้รับผิดชอบ |
| --- | --- | --- |
| รายวัน | ตรวจ log ผิดปกติ (auth fail, error 5xx), สถานะ backup | DevOps on duty |
| รายสัปดาห์ | รัน `npm audit` / `composer audit`, ตรวจผลสแกน WAF | Lead developer |
| รายเดือน | ทบทวน TLS cert, อัปเดตแพตช์ระบบ, ตรวจ account ที่ไม่ได้ใช้งาน | Infra team |
| รายไตรมาส | ทดสอบกู้คืนข้อมูล, ทำ access review, vulnerability scan | Security officer |
| รายปี | จัดอบรม security awareness, ทบทวนนโยบาย PDPA/กฎหมายที่เกี่ยวข้อง | CISO / HR |

## 6. การรายงานช่องโหว่
- ภายในองค์กร: สร้าง ticket หมวด Security ในระบบบริหารโครงการ และแจ้งผ่าน Teams ช่อง #security-alert
- ภายนอกองค์กร: กำหนดอีเมล `security@hospital.local` และตอบรับภายใน 3 วันทำการ
- ติดตามการแก้ไขจนเสร็จ พร้อมเอกสารประกอบ (patch note, test case)

## 7. เอกสารอ้างอิงที่เกี่ยวข้อง
- `docs/CODING_RULES.md` – กฎการเขียนโค้ดที่ช่วยลดความเสี่ยง security
- `docs/ENV.md` – การจัดการตัวแปรแวดล้อมและความลับ
- `docs/RUNBOOK.md` – กระบวนการ deploy/rollback และ incident response
- Postman collection – ใช้ทดสอบ endpoint security (auth, rate limit, validation)
