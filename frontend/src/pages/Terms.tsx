import React, { useEffect, useState } from 'react'
import { secureApi } from '../lib/secureApi'
import { PageMeta } from '../components/seo/PageMeta'

export const TermsPage: React.FC = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    secureApi
      .fetchTerms()
      .then((response) => setContent(response.terms))
      .catch(() => setContent('ไม่สามารถโหลดข้อตกลงการใช้งานได้'))
  }, [])

  return (
    <section className="policy-page">
      <PageMeta
        title="ข้อตกลงการใช้งาน | โรงพยาบาลโพนพิสัย"
        description="เงื่อนไขการใช้งานเว็บไซต์โรงพยาบาลโพนพิสัยและความรับผิดชอบของผู้ใช้บริการ"
        openGraph={{
          title: 'ข้อตกลงการใช้งานโรงพยาบาลโพนพิสัย',
          description: 'อ่านข้อกำหนดการใช้งานเว็บไซต์และบริการออนไลน์ของโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />
      <h1>ข้อตกลงการใช้งาน</h1>
      <p>{content}</p>
      <style>{`
        .policy-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 3rem 1rem;
          line-height: 1.8;
        }
      `}</style>
    </section>
  )
}
