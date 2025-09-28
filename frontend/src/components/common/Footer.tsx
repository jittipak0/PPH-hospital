import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'
import styles from './Footer.module.scss'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.siteFooter}>
      <Container className={styles.inner}>
        <div>
          <strong className={styles.brandTitle}>โรงพยาบาลโพนพิสัย</strong>
          <p className={styles.brandDescription}>เพื่อสุขภาพที่ดีของคนไทยทุกคน</p>
        </div>
        <nav aria-label="ลิงก์สำคัญ" className={styles.linksNav}>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>ข้อมูลองค์กร</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/about/leadership" className={styles.link}>
                  ทำเนียบโครงสร้างการบริหาร
                </Link>
              </li>
              <li>
                <Link to="/about/history" className={styles.link}>
                  ประวัติโรงพยาบาล
                </Link>
              </li>
              <li>
                <Link to="/about/vision-mission-values" className={styles.link}>
                  วิสัยทัศน์/พันธกิจ/ค่านิยม
                </Link>
              </li>
              <li>
                <Link to="/ethics" className={styles.link}>
                  ธรรมาภิบาล/จริยธรรม
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>บริการและฟอร์ม</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/services/online" className={styles.link}>
                  บริการออนไลน์
                </Link>
              </li>
              <li>
                <Link to="/programs/health-rider" className={styles.link}>
                  โครงการ Health Rider
                </Link>
              </li>
              <li>
                <Link to="/forms/medical-record-request" className={styles.link}>
                  แบบขอประวัติการรักษา
                </Link>
              </li>
              <li>
                <Link to="/forms/donation" className={styles.link}>
                  แบบฟอร์มรับบริจาค
                </Link>
              </li>
              <li>
                <Link to="/forms/satisfaction" className={styles.link}>
                  แบบประเมินความพึงพอใจ
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>ระบบและนโยบาย</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/transparency/procurement-ita" className={styles.link}>
                  จัดซื้อจัดจ้าง/ข่าวสาร ITA
                </Link>
              </li>
              <li>
                <Link to="/academic/publications" className={styles.link}>
                  ผลงานวิชาการ
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className={styles.link}>
                  แผนผังเว็บไซต์
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className={styles.link}>
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link to="/terms" className={styles.link}>
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkHeading}>ระบบภายใน</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/intranet/fuel-reimbursement" className={styles.link}>
                  ระบบเบิกจ่ายน้ำมัน
                </Link>
              </li>
              <li>
                <Link to="/intranet/document-center" className={styles.link}>
                  ศูนย์จัดเก็บเอกสาร
                </Link>
              </li>
              <li>
                <Link to="/login" className={styles.link}>
                  เข้าสู่ระบบบุคลากร
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.social}>
          <p>ติดตามเรา</p>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className={styles.socialLink}
          >
            📘
          </a>
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Line"
            className={styles.socialLink}
          >
            💬
          </a>
        </div>
      </Container>
      <div className={styles.credit}>© {new Date().getFullYear()} โรงพยาบาลโพนพิสัย กระทรวงสาธารณสุข</div>
    </footer>
  )
}
