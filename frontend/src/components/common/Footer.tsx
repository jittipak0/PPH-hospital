import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'
import { siteSections } from '../../config/siteMap'

export const Footer: React.FC = () => {
  const columnA = siteSections.slice(0, Math.ceil(siteSections.length / 2))
  const columnB = siteSections.slice(Math.ceil(siteSections.length / 2))

  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>โรงพยาบาลโพนพิสัย</strong>
          <p>เพื่อสุขภาพที่ดีของคนไทยทุกคน</p>
          <p className="site-footer__contact">โทร. 042-000-999 | อีเมล info@pph-hospital.go.th</p>
        </div>
        <nav aria-label="หมวดหมู่หลัก" className="site-footer__nav">
          <div className="site-footer__column">
            <h3>หมวดหมู่</h3>
            <ul>
              {columnA.map((section) => (
                <li key={section.id}>
                  <Link to={section.path}>{section.label}</Link>
                  {section.children ? (
                    <ul>
                      {section.children.map((child) => (
                        <li key={child.path}>
                          <Link to={child.path}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__column">
            <h3>บริการอื่น ๆ</h3>
            <ul>
              {columnB.map((section) => (
                <li key={section.id}>
                  <Link to={section.path}>{section.label}</Link>
                  {section.children ? (
                    <ul>
                      {section.children.map((child) => (
                        <li key={child.path}>
                          <Link to={child.path}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              <li>
                <Link to="/sitemap">แผนผังเว็บไซต์</Link>
              </li>
              <li>
                <Link to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="site-footer__social">
          <p>ติดตามเรา</p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            📘 Facebook
          </a>
          <a href="https://line.me" target="_blank" rel="noopener noreferrer" aria-label="Line">
            💬 Line Official
          </a>
        </div>
      </Container>
      <div className="site-footer__credit">© {new Date().getFullYear()} โรงพยาบาลโพนพิสัย กระทรวงสาธารณสุข</div>
      <style>{`
        .site-footer {
          background: var(--color-primary);
          color: #fff;
          margin-top: 4rem;
        }
        .site-footer__inner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
          padding: 2.5rem 0;
          align-items: flex-start;
        }
        .site-footer__brand p {
          margin: 0.25rem 0;
        }
        .site-footer__contact {
          font-size: 0.95rem;
          opacity: 0.9;
        }
        .site-footer__nav {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .site-footer__column h3 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .site-footer__column ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .site-footer__column ul ul {
          margin-top: 0.35rem;
          padding-left: 1rem;
          gap: 0.35rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .site-footer__inner a {
          color: #fff;
          text-decoration: none;
        }
        .site-footer__inner a:hover,
        .site-footer__inner a:focus {
          text-decoration: underline;
        }
        .site-footer__social {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .site-footer__social a {
          font-size: 1rem;
        }
        .site-footer__credit {
          text-align: center;
          padding: 1rem 0;
          background: rgba(0, 0, 0, 0.2);
          font-size: 0.9rem;
        }
        @media (max-width: 640px) {
          .site-footer__nav {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  )
}
