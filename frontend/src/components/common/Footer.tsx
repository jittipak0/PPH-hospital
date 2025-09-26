import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div>
          <strong>โรงพยาบาลโพนพิสัย</strong>
          <p>เพื่อสุขภาพที่ดีของคนไทยทุกคน</p>
        </div>
        <nav aria-label="ลิงก์สำคัญ">
          <ul>
            <li>
              <Link to="/donation">การรับบริจาค</Link>
            </li>
            <li>
              <Link to="/feedback/satisfaction">ประเมินความพึงพอใจ</Link>
            </li>
            <li>
              <Link to="/sitemap">แผนผังเว็บไซต์</Link>
            </li>
          </ul>
        </nav>
        <div className="site-footer__social">
          <p>ติดตามเรา</p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            📘
          </a>
          <a href="https://line.me" target="_blank" rel="noopener noreferrer" aria-label="Line">
            💬
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
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          padding: 2rem 0;
          align-items: flex-start;
        }
        .site-footer__inner ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .site-footer__inner a {
          color: #fff;
          text-decoration: none;
        }
        .site-footer__inner a:hover {
          text-decoration: underline;
        }
        .site-footer__social {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .site-footer__social a {
          font-size: 1.5rem;
        }
        .site-footer__credit {
          text-align: center;
          padding: 1rem 0;
          background: rgba(0, 0, 0, 0.2);
          font-size: 0.9rem;
        }
        @media (max-width: 640px) {
          .site-footer__inner {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  )
}
