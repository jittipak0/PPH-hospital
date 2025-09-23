import React, { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PackageCard } from '../components/patient/PackageCard'
import { api, type Clinic, type HealthPackage } from '../lib/api'

export const Services: React.FC = () => {
  const [packages, setPackages] = useState<HealthPackage[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [pkg, clinicItems] = await Promise.all([api.fetchHealthPackages(), api.fetchClinics()])
      if (!cancelled) {
        setPackages(pkg)
        setClinics(clinicItems)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Container>
        <header>
          <h1>บริการสำหรับผู้ป่วย</h1>
          <p>
            เราออกแบบขั้นตอนและบริการเพื่อตอบโจทย์ผู้รับบริการทุกวัย ตั้งแต่การลงทะเบียน การรักษา การฟื้นฟู ไปจนถึงการติดตามผลอย่างต่อเนื่อง
          </p>
        </header>
      </Container>

      <PageSection id="process" title="ขั้นตอนการเข้ารับบริการ">
        <Grid columns={2}>
          <article className="card">
            <h3>ผู้ป่วยใหม่</h3>
            <ol>
              <li>เตรียมบัตรประชาชนหรือบัตรประจำตัวที่ออกโดยรัฐ</li>
              <li>แจ้งสิทธิการรักษาพยาบาลที่ใช้ และยื่นหลักฐาน</li>
              <li>รับบัตรคิวและเข้าตรวจคัดกรองเบื้องต้น</li>
              <li>พบแพทย์ตามแผนกที่ได้รับมอบหมาย</li>
            </ol>
          </article>
          <article className="card">
            <h3>ผู้ป่วยเก่า</h3>
            <ol>
              <li>แสดงบัตรผู้ป่วยและบัตรประชาชนเพื่อยืนยันตัวตน</li>
              <li>ตรวจสอบสิทธิการรักษาหรือหนังสือส่งตัว (ถ้ามี)</li>
              <li>เข้ารับการตรวจซ้ำตามตารางนัดหมายเดิม หรือขอเปลี่ยนเวลาที่เคาน์เตอร์บริการ</li>
            </ol>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="clinics" title="ตารางออกตรวจและคลินิกเฉพาะทาง">
        <Grid columns={clinics.length > 0 ? Math.min(clinics.length, 3) : 3}>
          {clinics.map((clinic) => (
            <article key={clinic.id} className="card">
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p><strong>เวลาทำการ:</strong> {clinic.operatingHours}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="packages" title="โปรแกรมตรวจสุขภาพ" description="แพ็กเกจตรวจสุขภาพที่คัดสรรโดยทีมแพทย์">
        <Grid columns={packages.length > 0 ? Math.min(packages.length, 3) : 2}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </Grid>
      </PageSection>

      <PageSection id="rights" title="สิทธิการรักษาพยาบาล">
        <Grid columns={2}>
          <article className="card">
            <h3>สิทธิบัตรทอง (บัตรประกันสุขภาพถ้วนหน้า)</h3>
            <p>แสดงบัตรประชาชนหรือเอกสารสิทธิพร้อมสำเนาทะเบียนบ้าน ระบบจะตรวจสอบสิทธิผ่านฐานข้อมูลสำนักงานหลักประกันสุขภาพแห่งชาติ</p>
          </article>
          <article className="card">
            <h3>สิทธิประกันสังคม</h3>
            <p>ยื่นบัตรประชาชนพร้อมหนังสือส่งตัวจากสถานพยาบาลต้นสังกัด หรือใช้บริการออนไลน์ของสำนักงานประกันสังคม</p>
          </article>
          <article className="card">
            <h3>สิทธิข้าราชการและรัฐวิสาหกิจ</h3>
            <p>แสดงบัตรข้าราชการ/รัฐวิสาหกิจ พร้อมหนังสือรับรองสิทธิ หากใช้สิทธิบุตรหรือคู่สมรสให้แนบสำเนาทะเบียนบ้าน</p>
          </article>
          <article className="card">
            <h3>ประกันสุขภาพเอกชน</h3>
            <p>เตรียมกรมธรรม์ เลขกรมธรรม์ และเอกสารยืนยันจากบริษัทประกัน หากต้องสำรองจ่าย โรงพยาบาลจะอำนวยความสะดวกเรื่องเอกสารเรียกร้องค่าสินไหม</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}
