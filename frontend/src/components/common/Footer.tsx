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
        <nav aria-label="ลิงก์สำคัญ">
          <ul className={styles.linkList}>
            <li>
              <a
                href="https://www.example-hospital.go.th/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                นโยบายความเป็นส่วนตัว
              </a>
            </li>
            <li>
              <a
                href="https://www.example-hospital.go.th/terms"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                เงื่อนไขการใช้งาน
              </a>
            </li>
            <li>
              <Link to="/sitemap" className={styles.link}>
                แผนผังเว็บไซต์
              </Link>
            </li>
          </ul>
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
